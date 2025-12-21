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
import styles from "../../components/PostDetail.module.css";

/* ================== HELPERS ================== */
const extractSeriesAndEpisode = (head) => {
  if (!head) return { title: null, season: 1, episode: 1 };

  const cleaned = head
    .replace(/[\/\-_:.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  const isFinal = /(FINAL(LY)?)/i.test(cleaned);

  const seasonMatch = cleaned.match(/SEASON\s*(\d+)|S\s*(\d+)/i);
  const season = seasonMatch ? parseInt(seasonMatch[1] || seasonMatch[2]) : 1;

  const episodeMatch = cleaned.match(/EPISODE\s*(\d+)|EP\s*(\d+)|E\s*(\d+)/i);
  let episode = episodeMatch
    ? parseInt(episodeMatch[1] || episodeMatch[2] || episodeMatch[3])
    : 1;

  if (isFinal) episode = 999;

  const title = cleaned
    .replace(/SEASON\s*\d+/gi, "")
    .replace(/S\s*\d+/gi, "")
    .replace(/EPISODE\s*\d+/gi, "")
    .replace(/EP\s*\d+/gi, "")
    .replace(/E\s*\d+/gi, "")
    .replace(/FINAL(LY)?/gi, "")
    .trim();

  return { title, season, episode };
};

/* ================== COMPONENT ================== */
const PostDetails = ({ postData, commentsData, prevPostId, nextPostId }) => {
  const router = useRouter();
  const [comments, setComments] = useState(commentsData || []);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [views, setViews] = useState(postData?.views || 0);
  const [hasCommented, setHasCommented] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  const domain = "https://www.newtalentsg.co.rw";

  /* ================== USER + VIEWS + NES ================== */
  useEffect(() => {
    if (!postData?.id) return;

    const init = async () => {
      const username = localStorage.getItem("username");

      if (!username) {
        setTimeout(() => setShowLoginWarning(true), 50000);
        setTimeout(() => router.push("/login"), 60000);
        return;
      }

      setCurrentUser(username);

      /* 🔹 COUNT VIEW AFTER 60s */
      setTimeout(async () => {
        try {
          const ref = doc(db, "posts", postData.id);
          await updateDoc(ref, { views: increment(1) });
          const snap = await getDoc(ref);
          if (snap.exists()) setViews(snap.data().views || 0);
        } catch {}
      }, 60000);

      /* 🔹 NES LOGIC (READER FREE, AUTHOR PAID) */
      try {
        const author = postData.author;
        if (username !== author && username.toLowerCase() !== "newtalentsg") {
          const authorRef = doc(db, "authors", author);
          const authorSnap = await getDoc(authorRef);
          if (authorSnap.exists()) {
            await updateDoc(authorRef, {
              nes: increment(1),
            });
          }
        }
      } catch (e) {
        console.error("NES error:", e);
      }
    };

    init();
  }, [postData, router]);

  /* ================== CHECK COMMENT ================== */
  useEffect(() => {
    if (!currentUser) return;
    const commented = comments.some((c) => c.author === currentUser);
    setHasCommented(commented);
  }, [comments, currentUser]);

  /* ================== COMMENT SUBMIT ================== */
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;

    const ref = collection(db, "posts", postData.id, "comments");
    await addDoc(ref, {
      text: newComment,
      author: currentUser,
      createdAt: new Date().toISOString(),
    });

    const snap = await getDocs(ref);
    setComments(snap.docs.map((d) => d.data()));
    setNewComment("");
    setHasCommented(true);
  };

  /* ================== SHARE ================== */
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `${postData.head}\n\nSoma inkuru yose 👉 ${url}`;

    if (platform === "whatsapp")
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    if (platform === "facebook")
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`
      );
  };

  if (!postData) return <div>Post not found</div>;

  /* ================== RENDER ================== */
  return (
    <>
      <Head>
        <title>{postData.head}</title>
        <meta
          name="description"
          content={postData.story.replace(/<[^>]+>/g, "").slice(0, 160)}
        />
        <link rel="canonical" href={`${domain}/post/${postData.id}`} />
      </Head>

      <Header />

      {showLoginWarning && (
        <div className={styles.loginWarning}>
          Musomyi, banza winjire cyangwa wiyandikishe.
        </div>
      )}

      <div className={styles.postContainer}>
        <Channel />

        {postData.imageUrl && (
          <img src={postData.imageUrl} className={styles.postImage} />
        )}

        <h2>{postData.head}</h2>
        <Bible />

        <div
          className={styles.postStory}
          dangerouslySetInnerHTML={{ __html: postData.story }}
        />

        <small>By {postData.author}</small>
        <small> 👁 {views}</small>

        <div className={styles.navigationButtons}>
          <button
            disabled={!prevPostId}
            onClick={() => router.push(`/post/${prevPostId}`)}
          >
            ⬅ Previous
          </button>

          <button
            disabled={!nextPostId || !hasCommented}
            onClick={() => router.push(`/post/${nextPostId}`)}
          >
            Next ➡
          </button>
        </div>

        {!hasCommented && nextPostId && (
          <p style={{ color: "red" }}>
            Tangira utange comment mbere yo kujya ku nkuru ikurikira ✍️
          </p>
        )}

        <div className={styles.commentsSection}>
          <h3>Comments</h3>

          {currentUser && (
            <>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Andika comment..."
              />
              <button onClick={handleCommentSubmit}>Post Comment</button>
            </>
          )}

          {comments.map((c, i) => (
            <div key={i}>
              <p>{c.text}</p>
              <small>By {c.author}</small>
            </div>
          ))}
        </div>

        <NesMine username={currentUser} />
      </div>

      <Footer />
    </>
  );
};

/* ================== SSR ================== */
export async function getServerSideProps({ params }) {
  const postRef = doc(db, "posts", params.id);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return { props: { postData: null } };

  const commentsSnap = await getDocs(
    collection(db, "posts", params.id, "comments")
  );

  const allSnap = await getDocs(collection(db, "posts"));
  const posts = allSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const currentIndex = posts.findIndex((p) => p.id === params.id);

  return {
    props: {
      postData: { id: postSnap.id, ...postSnap.data() },
      commentsData: commentsSnap.docs.map((d) => d.data()),
      prevPostId: posts[currentIndex - 1]?.id || null,
      nextPostId: posts[currentIndex + 1]?.id || null,
    },
  };
}

export default PostDetails;
