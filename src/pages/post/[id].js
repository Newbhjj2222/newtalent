// pages/post/[id].js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { db } from "../../components/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { FaShareAlt } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Bible from "../../components/Bible";
import NesMine from "../../components/NesMine";
import styles from "../../components/PostDetail.module.css";

const extractSeriesAndEpisode = (head) => {
  if (!head) return { title: null, season: null, episode: null };
  const cleanedHead = head
    .replace(/[\/\-_:.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  const isFinal = /FINAL(LY)?/.test(cleanedHead);

  const seasonMatch = cleanedHead.match(/SEASON\s*0*(\d+)|S\s*0*(\d+)/i);
  let season = seasonMatch ? parseInt(seasonMatch[1] || seasonMatch[2], 10) : 1;

  const episodeMatch = cleanedHead.match(
    /EPISODE\s*0*(\d+)|EP\s*0*(\d+)|E\s*0*(\d+)/i
  );
  let episode = episodeMatch
    ? parseInt(episodeMatch[1] || episodeMatch[2] || episodeMatch[3], 10)
    : 1;

  if (isFinal) episode = 999;

  const title = cleanedHead
    .replace(/SEASON\s*0*\d+/gi, "")
    .replace(/S\s*0*\d+/gi, "")
    .replace(/EPISODE\s*0*\d+/gi, "")
    .replace(/EP\s*0*\d+/gi, "")
    .replace(/E\s*0*\d+/gi, "")
    .replace(/FINAL(LY)?/gi, "")
    .trim();

  return { title, season, episode };
};

const PostDetails = ({ postData, commentsData, prevPostId, nextPostId }) => {
  const router = useRouter();
  const [comments, setComments] = useState(commentsData || []);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [views, setViews] = useState(postData?.views || 0);
  const domain = "https://newtalentsg.co.rw"; // ✅ Domain yawe

  useEffect(() => {
    if (typeof window !== "undefined" && postData?.id) {
      const storedUsername = localStorage.getItem("username");
      if (!storedUsername) {
        router.push("/login");
        return;
      }
      setCurrentUser(storedUsername);

      // --- Count views ---
      const incrementViews = async () => {
        try {
          const postRef = doc(db, "posts", postData.id);
          await updateDoc(postRef, { views: increment(1) });

          // refresh view count locally
          const snap = await getDoc(postRef);
          if (snap.exists()) {
            setViews(snap.data().views || 0);
          }
        } catch (err) {
          console.error("View update failed:", err);
        }
      };
      incrementViews();

      // NES logic (author gains NES when someone reads)
      const handleNES = async () => {
        try {
          const username = storedUsername;
          const author = postData.author || "Unknown";

          if (username !== author && username.toLowerCase() !== "newtalentsg") {
            const depositerRef = doc(db, "depositers", username);
            const depositerSnap = await getDoc(depositerRef);

            if (!depositerSnap.exists()) {
              alert("Account yawe ntiboneka mubaguze NeS. Kugira ngo wemererwe gusoma banza uzigura. tugiye kukujyana aho uzigurira. niba ukeneye ubufasha twandikire Whatsapp +250722319367.");
              router.push("/balance");
              return;
            }

            const currentNes = Number(depositerSnap.data().nes) || 0;
            if (currentNes < 1) {
              alert("Nta NeS zihagije ufite zikwemerera gusoma iyi Nkuru. Nyamuneka banza uzigure. tugiye kukujyana aho uzigurira, niba ubibonye waziguze, twandikire Whatsapp nonaha tugufashe. +250722319367.");
              router.push("/balance");
              return;
            }

            await updateDoc(depositerRef, { nes: currentNes - 1 });

            if (author !== username) {
              const authorRef = doc(db, "authors", author);
              const authorSnap = await getDoc(authorRef);
              if (authorSnap.exists()) {
                const authorNes = Number(authorSnap.data().nes) || 0;
                await updateDoc(authorRef, { nes: authorNes + 1 });
              }
            }
          }
        } catch (err) {
          console.error("NES update failed:", err);
        }
      };

      handleNES();
    }
  }, [postData, router]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;
    try {
      const commentRef = collection(db, "posts", postData.id, "comments");
      await addDoc(commentRef, {
        text: newComment,
        author: currentUser,
        createdAt: new Date().toISOString(),
      });
      const updatedSnap = await getDocs(commentRef);
      setComments(updatedSnap.docs.map((d) => d.data()));
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleShare = (platform) => {
  const postUrl = window.location.href;

  // 1. Kuramo tags za HTML
  let cleanText = postData.story.replace(/<[^>]+>/g, "");

  // 2. Gusimbuza &nbsp; na izindi HTML entities n'ibisanzwe
  cleanText = cleanText
    .replace(/&nbsp;/g, " ") // Umwanya usanzwe
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  // 3. Gufata gusa inyandiko 800 za mbere
  cleanText = cleanText.slice(0, 800);

  const text = `${postData.head}\n\n${cleanText}...\nSoma inkuru yose ukanze aha 👉 ${postUrl}`;

  switch (platform) {
    case "whatsapp":
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      break;
    case "telegram":
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`,
        "_blank"
      );
      break;
    case "messenger":
      window.open(
        `fb-messenger://share?link=${encodeURIComponent(postUrl)}`,
        "_blank"
      );
      break;
    case "facebook":
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
        "_blank"
      );
      break;
    default:
      navigator.clipboard.writeText(text);
      alert("Text copied to clipboard ✅");
  }
};

  if (!postData) return <div>Post not found.</div>;

  return (
    <>
      <Head>
        <title>{postData.head}</title>
        <meta property="og:title" content={postData.head} />
        <meta
          property="og:description"
          content={postData.story.replace(/<[^>]+>/g, "").slice(0, 800)}
        />
        <meta property="og:image" content={`${domain}${postData.imageUrl}`} />
        <meta property="og:url" content={`${domain}/post/${postData.id}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postData.head} />
        <meta
          name="twitter:description"
          content={postData.story.replace(/<[^>]+>/g, "").slice(0, 800)}
        />
        <meta name="twitter:image" content={`${domain}${postData.imageUrl}`} />
      </Head>

      <Header />
      <div className={styles.postContainer}>
        {postData.imageUrl && (
          <img
            className={styles.postImage}
            src={postData.imageUrl}
            alt={postData.head}
          />
        )}
        <h2 className={styles.postTitle}>{postData.head}</h2>
        <Bible />
        <div
          className={styles.postStory}
          dangerouslySetInnerHTML={{ __html: postData.story }}
        />

        <div className={styles.postMeta}>
          <small>By: {postData.author || "Unknown"}</small>
          <small style={{ marginLeft: "10px" }}>👁 {views} views</small>
          <div className={styles.shareButtons}>
            <button
              className={styles.shareButton}
              onClick={() => handleShare("whatsapp")}
            >
              <FaShareAlt /> WhatsApp
            </button>
            <button
              className={styles.shareButton}
              onClick={() => handleShare("telegram")}
            >
              <FaShareAlt /> Telegram
            </button>
            <button
              className={styles.shareButton}
              onClick={() => handleShare("messenger")}
            >
              <FaShareAlt /> Messenger
            </button>
            <button
              className={styles.shareButton}
              onClick={() => handleShare("facebook")}
            >
              <FaShareAlt /> Facebook
            </button>
            <button
              className={styles.shareButton}
              onClick={() => handleShare("clipboard")}
            >
              <FaShareAlt /> Copy Link
            </button>
          </div>
        </div>

        <div className={styles.navigationButtons}>
          <button
            className={styles.navButton}
            disabled={!prevPostId}
            onClick={() => router.push(`/post/${prevPostId}`)}
          >
            ⬅ Previous
          </button>
          <button
            className={styles.navButton}
            disabled={!nextPostId}
            onClick={() => router.push(`/post/${nextPostId}`)}
          >
            Next ➡
          </button>
        </div>

        <div className={styles.commentsSection}>
          <h3>Comments</h3>
          {currentUser ? (
            <div className={styles.commentForm}>
              <textarea
                className={styles.commentTextarea}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
              />
              <button
                className={styles.commentButton}
                onClick={handleCommentSubmit}
              >
                Post Comment
              </button>
            </div>
          ) : (
            <p>Login to comment.</p>
          )}
          {comments.length ? (
            comments.map((c, i) => (
              <div key={i} className={styles.commentItem}>
                <p>{c.text}</p>
                <small className={styles.commentAuthor}>By: {c.author}</small>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        <NesMine username={currentUser} />
      </div>
      <Footer />
    </>
  );
};

// --- SSR logic
export async function getServerSideProps(context) {
  const { id } = context.params;

  const postRef = doc(db, "posts", id);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return { props: { postData: null } };
  const postData = { id: postSnap.id, ...postSnap.data() };

  const commentsRef = collection(db, "posts", id, "comments");
  const commentsSnap = await getDocs(commentsRef);
  const commentsData = commentsSnap.docs.map((d) => d.data());

  // --- Navigation logic ---
  const allPostsSnap = await getDocs(collection(db, "posts"));
  const allPosts = allPostsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const current = extractSeriesAndEpisode(postData.head);

  const postsWithInfo = allPosts
    .map((p) => ({ ...p, ...extractSeriesAndEpisode(p.head) }))
    .filter(
      (p) => p.title?.toUpperCase() === current.title.toUpperCase() && p.episode !== null
    );

  const seasonsMap = {};
  postsWithInfo.forEach((p) => {
    if (!seasonsMap[p.season]) seasonsMap[p.season] = [];
    seasonsMap[p.season].push(p);
  });

  Object.values(seasonsMap).forEach((seasonPosts) =>
    seasonPosts.sort((a, b) =>
      a.episode === 999 ? 1 : b.episode === 999 ? -1 : a.episode - b.episode
    )
  );

  let sortedPosts = [];
  Object.keys(seasonsMap)
    .sort((a, b) => a - b)
    .forEach((sn) => sortedPosts.push(...seasonsMap[sn]));

  const currentIndex = sortedPosts.findIndex((p) => p.id === id);
  const prevPostId = currentIndex > 0 ? sortedPosts[currentIndex - 1].id : null;

  let nextPostId = null;
  if (currentIndex < sortedPosts.length - 1) {
    const currentEpisode = sortedPosts[currentIndex].episode;
    if (currentEpisode === 999) {
      const nextSeason = current.season + 1;
      const nextSeasonPost = sortedPosts.find(
        (p) => p.season === nextSeason && p.episode === 1
      );
      nextPostId = nextSeasonPost ? nextSeasonPost.id : null;
    } else {
      nextPostId = sortedPosts[currentIndex + 1].id;
    }
  }

  return { props: { postData, commentsData, prevPostId, nextPostId } };
}

export default PostDetails;
