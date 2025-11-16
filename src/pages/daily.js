// pages/daily.js
import React, { useEffect, useState } from "react";
import styles from "../styles/daily.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db, serverTimestamp, firestoreIncrement } from "../components/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
  serverTimestamp as _serverTimestamp,
  limit
} from "firebase/firestore";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";

export default function Daily({ initialFeeds }) {
  // initialFeeds comes from SSR
  const [feeds, setFeeds] = useState(initialFeeds || []);
  const [text, setText] = useState("");
  const [bg, setBg] = useState("#ffffff");
  const [username, setUsername] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [commentInputsOpen, setCommentInputsOpen] = useState({}); // feedId -> boolean
  const [commentText, setCommentText] = useState({}); // feedId -> text

  useEffect(() => {
    // get username from localStorage (or ask user to input)
    const u = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (u) setUsername(u);
    else {
      const generated = `user-${Math.floor(Math.random() * 9999)}`;
      setUsername(generated);
      localStorage.setItem("username", generated);
    }
  }, []);

  // When component mounts, increment views for each feed once (client-side)
  useEffect(() => {
    // Increment views for each feed on client mount
    // (This will cause writes to firestore; fine for many setups but adjust if heavy)
    const incrementViews = async () => {
      try {
        for (const f of feeds) {
          const ref = doc(db, "feeds", f.id);
          await updateDoc(ref, { views: firestoreIncrement(1) });
        }
        // Optimistically update local counts
        setFeeds(prev => prev.map(p => ({ ...p, views: (p.views || 0) + 1 })));
      } catch (err) {
        console.warn("views increment failed", err);
      }
    };
    if (feeds.length) incrementViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Andika post mbere yo gusubiza.");
    if (text.length > 500) return alert("Post ntigomba kurenza inyuguti 500.");
    setLoadingPost(true);
    try {
      const newFeed = {
        username: username || "anonymous",
        text: text.trim(),
        bg,
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
        shares: 0,
        views: 0,
      };
      const col = collection(db, "feeds");
      const docRef = await addDoc(col, newFeed);
      // Build client feed object
      const clientFeed = {
        id: docRef.id,
        ...newFeed,
        createdAt: new Date().toISOString(),
      };
      // Show immediately
      setFeeds(prev => [{ ...clientFeed }, ...prev]);
      setText("");
      alert("Post ibitswe!");
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu kubika post.");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleLike = async (feedId) => {
    try {
      const ref = doc(db, "feeds", feedId);
      await updateDoc(ref, { likes: firestoreIncrement(1) });
      setFeeds(prev => prev.map(f => f.id === feedId ? { ...f, likes: (f.likes || 0) + 1 } : f));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (feed) => {
    try {
      // summary = first 90 chars
      const summary = feed.text.slice(0, 90);
      await navigator.clipboard.writeText(summary);
      const ref = doc(db, "feeds", feed.id);
      await updateDoc(ref, { shares: firestoreIncrement(1) });
      setFeeds(prev => prev.map(f => f.id === feed.id ? { ...f, shares: (f.shares || 0) + 1 } : f));
      alert("Summary copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    }
  };

  const toggleComments = (feedId) => {
    setCommentInputsOpen(prev => ({ ...prev, [feedId]: !prev[feedId] }));
  };

  const submitComment = async (feedId) => {
    const text = (commentText[feedId] || "").trim();
    if (!text) return;
    if (text.length > 500) return alert("Comment ntigomba kurenza 500 chars.");
    try {
      // Save comment in subcollection
      const commentRef = collection(db, `feeds/${feedId}/comments`);
      await addDoc(commentRef, {
        username: username || "anonymous",
        text,
        createdAt: serverTimestamp(),
      });
      // increment commentsCount
      const feedRef = doc(db, "feeds", feedId);
      await updateDoc(feedRef, { commentsCount: firestoreIncrement(1) });
      setFeeds(prev => prev.map(f => f.id === feedId ? { ...f, commentsCount: (f.commentsCount || 0) + 1 } : f));
      setCommentText(prev => ({ ...prev, [feedId]: "" }));
      alert("Comment yabitswe");
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu kubika comment");
    }
  };

  return (
    <>
      <Head>
        <title>Daily Feed</title>
      </Head>
      <div className={styles.pageWrap}>
        <Header />
        <main className={styles.container}>
          <section className={styles.postBox}>
            <h2>Andika Post</h2>
            <textarea
              className={styles.textarea}
              placeholder="Andika hano (max 500 chars)"
              value={text}
              maxLength={500}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.controls}>
              <label>
                Background:
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className={styles.colorInput}
                />
              </label>
              <div className={styles.usernameWrap}>
                <label style={{ marginRight: 8 }}>Username:</label>
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    localStorage.setItem("username", e.target.value);
                  }}
                  className={styles.usernameInput}
                />
              </div>
              <button className={styles.submitBtn} onClick={handlePost} disabled={loadingPost}>
                {loadingPost ? "Saving..." : "Submit"}
              </button>
            </div>
            <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
              {text.length}/500 characters
            </div>
          </section>

          <section className={styles.feedsList}>
            {feeds.length === 0 && <div className={styles.empty}>Nta feeds ziboneka.</div>}
            {feeds.map(feed => (
              <article
                key={feed.id}
                className={styles.feedCard}
                style={{ background: feed.bg || "#fff" }}
              >
                <div className={styles.feedHeader}>
                  <div>
                    <strong>{feed.username}</strong>
                    <div className={styles.meta}>{new Date(feed.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className={styles.feedBody}>
                  <div className={styles.feedText} title={feed.text}>
                    {feed.text}
                  </div>
                </div>

                <div className={styles.feedFoot}>
                  <div className={styles.metrics}>
                    <button className={styles.iconBtn} onClick={() => handleLike(feed.id)}>
                      <FiThumbsUp /> <span>{feed.likes || 0}</span>
                    </button>

                    <button className={styles.iconBtn} onClick={() => toggleComments(feed.id)}>
                      <FiMessageCircle /> <span>{feed.commentsCount || 0}</span>
                    </button>

                    <button className={styles.iconBtn} onClick={() => handleShare(feed)}>
                      <FiShare2 /> <span>{feed.shares || 0}</span>
                    </button>

                    <div className={styles.viewsBadge}>
                      Views: {feed.views || 0}
                    </div>
                  </div>
                </div>

                {commentInputsOpen[feed.id] && (
                  <div className={styles.commentArea}>
                    <textarea
                      placeholder="Andika comment..."
                      value={commentText[feed.id] || ""}
                      maxLength={500}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [feed.id]: e.target.value }))}
                      className={styles.commentInput}
                    />
                    <button className={styles.commentBtn} onClick={() => submitComment(feed.id)}>Send</button>
                  </div>
                )}
              </article>
            ))}
          </section>

          <Footer />
        </main>
      </div>
    </>
  );
}

// SSR to fetch feeds
export async function getServerSideProps(context) {
  try {
    const feedsCol = collection(db, "feeds");
    const q = query(feedsCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const feeds = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        username: data.username || "anonymous",
        text: data.text || "",
        bg: data.bg || "#fff",
        likes: data.likes || 0,
        commentsCount: data.commentsCount || 0,
        shares: data.shares || 0,
        views: data.views || 0,
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
      };
    });
    return { props: { initialFeeds: feeds } };
  } catch (err) {
    console.error("SSR fetch error:", err);
    return { props: { initialFeeds: [] } };
  }
}
