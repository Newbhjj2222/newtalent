// pages/post/[id].js
"use client";
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
import Channel from "../../components/Channel";
import Pin from "../../components/Pin";
import styles from "../../components/PostDetail.module.css";
const extractSeriesAndEpisode = (head) => {
  if (!head) return { title: null, season: null, episode: null };

  const cleanedHead = head
    .replace(/[\/\-_:.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  // 🔹 Reba niba ari FINAL cyangwa FINALLY
  const isFinal = /(FINAL(LY)?(\s*EPISODE)?|EPISODE\s*FINAL(LY)?)/i.test(cleanedHead);

  // 🔹 Shaka Season
  const seasonMatch = cleanedHead.match(/SEASON\s*0*(\d+)|S\s*0*(\d+)/i);
  let season = seasonMatch ? parseInt(seasonMatch[1] || seasonMatch[2], 10) : 1;

  // 🔹 Shaka Episode Number
  const episodeMatch = cleanedHead.match(/EPISODE\s*0*(\d+)|EP\s*0*(\d+)|E\s*0*(\d+)/i);
  let episode = episodeMatch
    ? parseInt(episodeMatch[1] || episodeMatch[2] || episodeMatch[3], 10)
    : null;

  // 🔹 Niba ari FINAL cyangwa FINALLY, shyiraho episode = 999
  if (isFinal) episode = 999;

  // 🔹 Niba ntabonye number ariko atari FINAL, nyishyire kuri 1
  if (episode === null || isNaN(episode)) episode = 1;

  // 🔹 Sobanura title (udukuremo ibintu byongera)
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
  const domain = "www.newtalentsg.co.rw"; // ✅ Domain yawe
  const [showLoginWarning, setShowLoginWarning] = useState(false);
const [limitWarning, setLimitWarning] = useState(false);
// --- Ureba user na views ---
useEffect(() => {
  if (typeof window === "undefined" || !postData?.id) return;

  const runLogic = async () => {
    const username = localStorage.getItem("username");

    // 🔴 User atinjiye
    if (!username) {
      await new Promise((r) => setTimeout(r, 50000));
      setShowLoginWarning(true);
      await new Promise((r) => setTimeout(r, 10000));
      router.push("/login");
      return;
    }

    setCurrentUser(username);

    /* =========================
       📅 DAILY READ LIMIT (3)
    ========================= */
    const today = new Date().toISOString().slice(0, 10);
    const readKey = `reads_${username}_${today}`;

    let readsToday = Number(localStorage.getItem(readKey)) || 0;

    if (readsToday >= 3) {
      // 🔎 Reba NES za user
      const depRef = doc(db, "depositers", username);
      const depSnap = await getDoc(depRef);

      const userNes = depSnap.exists()
        ? Number(depSnap.data().nes) || 0
        : 0;

      // ❌ Nta NES afite
      if (userNes < 1) {
        setLimitWarning(true);

        await new Promise((r) => setTimeout(r, 15000));
        router.push("/balance");
        return;
      }

      // ✅ Kata NES 1
      await updateDoc(depRef, {
        nes: increment(-1),
      });
    } else {
      // ✅ Increment daily free reads
      localStorage.setItem(readKey, readsToday + 1);
    }

    /* =========================
       ⏳ WAIT 60 SECONDS
    ========================= */
    await new Promise((r) => setTimeout(r, 60000));

    /* =========================
       👁️ VIEWS
    ========================= */
    try {
      const postRef = doc(db, "posts", postData.id);
      await updateDoc(postRef, { views: increment(1) });

      const snap = await getDoc(postRef);
      if (snap.exists()) {
        setViews(snap.data().views || 0);
      }
    } catch (err) {
      console.error("View update failed:", err);
    }

    /* =========================
       ⭐ NES TO AUTHOR
    ========================= */
    try {
      const author = postData.author;
      if (!author) return;

      if (username === "NewtalentsG") return;
      if (username === author) return;

      await updateDoc(doc(db, "authors", author), {
        nes: increment(1),
      });
    } catch (err) {
      console.error("Author NES update failed:", err);
    }
  };

  runLogic();
}, [postData, router]);
  // --- Comments ---
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

  // --- Share function ---
  const handleShare = (platform) => {
    const postUrl = window.location.href;

    let cleanText = postData.story
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<li>/gi, "- ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "");

    cleanText = cleanText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    cleanText = cleanText.slice(0, 1700);

    const text = `${postData.head}\n\n${cleanText.trim()}...\n\nSoma inkuru yose ukanze aha 👉 ${postUrl}`;

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
  <title>{postData.head} - New Talents Stories Group</title>

  <meta
    name="description"
    content={postData.story.replace(/<[^>]+>/g, "").slice(0, 160)}
  />
  <meta
    name="keywords"
    content={`${postData.head}, inkuru nyarwanda, inkuru ndende, stories Rwanda, newtalentsg`}
  />
  <meta name="author" content={postData.author || "New Talents Stories"} />

  <link rel="canonical" href={`${domain}/post/${postData.id}`} />

  {/* OPEN GRAPH */}
  <meta property="og:title" content={postData.head} />
  <meta
    property="og:description"
    content={postData.story.replace(/<[^>]+>/g, "").slice(0, 200)}
  />
  <meta property="og:image" content={`${domain}${postData.imageUrl}`} />
  <meta property="og:url" content={`${domain}/post/${postData.id}`} />
  <meta property="og:type" content="article" />

  {/* TWITTER */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={postData.head} />
  <meta
    name="twitter:description"
    content={postData.story.replace(/<[^>]+>/g, "").slice(0, 200)}
  />
  <meta name="twitter:image" content={`${domain}${postData.imageUrl}`} />

  {/* STRUCTURED DATA JSON-LD */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: postData.head,
        image: [`${domain}${postData.imageUrl}`],
        datePublished: postData.createdAt || "",
        dateModified: postData.updatedAt || postData.createdAt || "",
        author: {
          "@type": "Person",
          name: postData.author || "New Talents Stories",
        },
        publisher: {
          "@type": "Organization",
          name: "New Talents Stories Group",
          logo: {
            "@type": "ImageObject",
            url: `${domain}/logo.png`,
          },
        },
        description: postData.story.replace(/<[^>]+>/g, "").slice(0, 200),
        articleBody: postData.story.replace(/<[^>]+>/g, ""),
      }),
    }}
  />
</Head>

      <Header />
        <Pin />
        {limitWarning && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff7ed",
      color: "#9a3412",
      padding: "20px",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      border: "2px solid #fdba74",
      zIndex: 9999,
      width: "90%",
      maxWidth: "420px",
      textAlign: "center",
      boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
    }}
  >
    Musomyi, wemerewe gusoma ibice 3 gusa by’inkuru ku munsi.
    <br />
    <br />
    Niba ukeneye gukomeza gusoma nonaha, gura NES point.
  </div>
)}
          {showLoginWarning && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fee4e2",
    color: "#b42318",
    padding: "20px",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    border: "2px solid #f97066",
    zIndex: 9999,
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
  }}>
    Musomyi, kugirango ukomeze iyi nkuru, banza wiyandikishe cyangwa winjire.
  </div>
)}
      <div className={styles.postContainer}>
          <Channel />
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
            {["whatsapp", "telegram", "messenger", "facebook", "clipboard"].map(
              (platform) => (
                <button
                  key={platform}
                  className={styles.shareButton}
                  onClick={() => handleShare(platform)}
                >
                  <FaShareAlt /> {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              )
            )}
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
          <Channel />
      <Footer />
    </>
  );
};

// --- SSR Logic (Get server side props) ---
export async function getServerSideProps(context) {
  const { id } = context.params;

  const postRef = doc(db, "posts", id);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return { props: { postData: null } };
  const postData = { id: postSnap.id, ...postSnap.data() };

  const commentsRef = collection(db, "posts", id, "comments");
  const commentsSnap = await getDocs(commentsRef);
  const commentsData = commentsSnap.docs.map((d) => d.data());

  const allPostsSnap = await getDocs(collection(db, "posts"));
  const allPosts = allPostsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const normalizeTitle = (t) =>
    t
      ? t
          .toUpperCase()
          .replace(/[^\w]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";

  const current = extractSeriesAndEpisode(postData.head);

  const postsWithInfo = allPosts
    .map((p) => ({ ...p, ...extractSeriesAndEpisode(p.head) }))
    .filter(
      (p) =>
        normalizeTitle(p.title) === normalizeTitle(current.title) &&
        p.episode !== null
    );

  postsWithInfo.forEach((p) => {
    if (/FINAL(LY)?/i.test(p.head)) {
      p.episode = 999;
    }
  });

  const seasonsMap = {};
  postsWithInfo.forEach((p) => {
    if (!seasonsMap[p.season]) seasonsMap[p.season] = [];
    seasonsMap[p.season].push(p);
  });

  Object.values(seasonsMap).forEach((seasonPosts) =>
    seasonPosts.sort((a, b) => {
      const ea = a.episode === 999 ? Infinity : a.episode;
      const eb = b.episode === 999 ? Infinity : b.episode;
      return ea - eb;
    })
  );

  let sortedPosts = [];
  Object.keys(seasonsMap)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((sn) => sortedPosts.push(...seasonsMap[sn]));

  const currentIndex = sortedPosts.findIndex((p) => p.id === id);
  const prevPostId = currentIndex > 0 ? sortedPosts[currentIndex - 1].id : null;

  let nextPostId = null;
  if (currentIndex < sortedPosts.length - 1) {
    const currentPost = sortedPosts[currentIndex];
    if (currentPost.episode === 999) {
      const nextSeason = currentPost.season + 1;
      const nextSeasonPost = sortedPosts.find(
        (p) => p.season === nextSeason && p.episode === 1
      );
      nextPostId = nextSeasonPost ? nextSeasonPost.id : null;
    } else {
      nextPostId = sortedPosts[currentIndex + 1]?.id || null;
    }
  }

  return {
    props: { postData, commentsData, prevPostId, nextPostId },
  };
}

export default PostDetails;
