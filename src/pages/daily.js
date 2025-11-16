// pages/daily.js
import React, { useEffect, useState, useRef } from "react";
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
} from "firebase/firestore";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
import Head from "next/head";

export default function Daily({ initialFeeds }) {
  const [feeds, setFeeds] = useState(initialFeeds || []);
  const [text, setText] = useState("");
  const [bg, setBg] = useState("#ffffff");
  const [username, setUsername] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [commentInputsOpen, setCommentInputsOpen] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const editableDivRef = useRef(null);

  // Load username
  useEffect(() => {
    const u = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (u) setUsername(u);
    else {
      const generated = `user-${Math.floor(Math.random() * 9999)}`;
      setUsername(generated);
      localStorage.setItem("username", generated);
    }
  }, []);

  // Increment views once per 24h per user per feed
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const now = Date.now();
        const viewed = JSON.parse(localStorage.getItem("viewedFeeds") || "{}");

        for (const f of feeds) {
          if (!viewed[f.id] || now - viewed[f.id] > 24 * 60 * 60 * 1000) {
            const ref = doc(db, "feeds", f.id);
            await updateDoc(ref, { views: firestoreIncrement(1) });
            viewed[f.id] = now;
          }
        }
        localStorage.setItem("viewedFeeds", JSON.stringify(viewed));
        // Update state to reflect new views locally
        setFeeds(prev => prev.map(f => {
          const addView = !viewed[f.id] || now - viewed[f.id] <= 24 * 60 * 60 * 1000 ? 1 : 0;
          return { ...f, views: (f.views || 0) + addView };
        }));
      } catch (err) {
        console.error("Firestore Error (views):", err);
      }
    };

    if (feeds.length) incrementViews();
  }, [feeds]);

  // Post submit
  const handlePost = async () => {
    if (!text.trim()) return alert("Andika post mbere yo gusubiza.");
    if (text.length > 500) return alert("Post ntigomba kurenza inyuguti 500.");
    setLoadingPost(true);
    try {
      const newFeed = {
        username,
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
      const clientFeed = { id: docRef.id, ...newFeed, createdAt: new Date().toISOString() };
      setFeeds(prev => [clientFeed, ...prev]);
      if (editableDivRef.current) editableDivRef.current.textContent = "";
      setText("");
    } catch (err) {
      console.error("Firestore Error (post):", err);
      alert(`Habaye ikosa muri Firestore: ${err.message}`);
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
      console.error("Firestore Error (like):", err);
      alert(`Habaye ikosa mu kongera like: ${err.message}`);
    }
  };

  const handleShare = async (feed) => {
    try {
      const summary = feed.text.slice(0, 90);
      await navigator.clipboard.writeText(summary);
      const ref = doc(db, "feeds", feed.id);
      await updateDoc(ref, { shares: firestoreIncrement(1) });
      setFeeds(prev => prev.map(f => f.id === feed.id ? { ...f, shares: (f.shares || 0) + 1 } : f));
      alert("Summary copied!");
    } catch (err) {
      console.error("Firestore Error (share):", err);
      alert(`Habaye ikosa mu gusangiza: ${err.message}`);
    }
  };

  // Comments section
  const toggleComments = async (fid) => {
    setCommentInputsOpen(prev => ({ ...prev, [fid]: !prev[fid] }));
    if (!commentsData[fid]) {
      try {
        const commentsSnap = await getDocs(collection(db, `feeds/${fid}/comments`));
        const comments = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCommentsData(prev => ({ ...prev, [fid]: comments }));
      } catch (err) {
        console.error("Firestore Error (fetch comments):", err);
      }
    }
  };

  const submitComment = async (fid) => {
    const c = (commentText[fid] || "").trim();
    if (!c) return;
    if (c.length > 500) return alert("Comment ntigomba kurenza 500 chars");
    try {
      const docRef = await addDoc(collection(db, `feeds/${fid}/comments`), {
        username,
        text: c,
        createdAt: serverTimestamp(),
      });
      const ref = doc(db, "feeds", fid);
      await updateDoc(ref, { commentsCount: firestoreIncrement(1) });
      // Update comments locally
      setCommentsData(prev => ({
        ...prev,
        [fid]: [...(prev[fid] || []), { id: docRef.id, username, text: c, createdAt: new Date().toISOString() }]
      }));
      setFeeds(prev => prev.map(f => f.id === fid ? { ...f, commentsCount: (f.commentsCount || 0) + 1 } : f));
      setCommentText(prev => ({ ...prev, [fid]: "" }));
    } catch (err) {
      console.error("Firestore Error (comment):", err);
      alert(`Habaye ikosa mu kubika comment: ${err.message}`);
    }
  };

  return (
    <>
      <Head><title>Daily Feed</title></Head>
      <Header />
      <main className={styles.container}>
        <section className={styles.postBox}>
          <h2>Andika Post</h2>
          <div className={styles.textareaWrap}>
            <div
              className={styles.editableDiv}
              ref={editableDivRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => {
                const t = e.currentTarget.textContent || "";
                if (t.length > 500) e.currentTarget.textContent = t.slice(0, 500);
                setText(e.currentTarget.textContent);
              }}
              style={{ backgroundColor: bg }}
            />
          </div>
          <div className={styles.controls}>
            <label>
              Background:
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className={styles.colorInput}/>
            </label>
            <div className={styles.usernameWrap}>
              <label>Username:</label>
              <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); localStorage.setItem("username", e.target.value); }}
                className={styles.usernameInput}
              />
            </div>
            <button className={styles.submitBtn} onClick={handlePost} disabled={loadingPost}>
              {loadingPost ? "Saving..." : "Submit"}
            </button>
          </div>
        </section>

        <section className={styles.feedsList}>
          {feeds.length === 0 && <div className={styles.empty}>Nta feeds ziboneka.</div>}
          {feeds.map(feed => (
            <article key={feed.id} className={styles.feedCard} style={{ background: feed.bg }}>
              <div className={styles.feedHeader}>
                <strong>{feed.username}</strong>
                <div className={styles.meta}>{new Date(feed.createdAt).toLocaleString()}</div>
              </div>
              <div className={styles.feedBody}>
                <div className={styles.feedText}>{feed.text}</div>
              </div>
              <div className={styles.feedFoot}>
                <div className={styles.metrics}>
                  <button className={styles.iconBtn} onClick={() => handleLike(feed.id)}>
                    <FiThumbsUp /> <span>{feed.likes}</span>
                  </button>
                  <button className={styles.iconBtn} onClick={() => toggleComments(feed.id)}>
                    <FiMessageCircle /> <span>{feed.commentsCount}</span>
                  </button>
                  <button className={styles.iconBtn} onClick={() => handleShare(feed)}>
                    <FiShare2 /> <span>{feed.shares}</span>
                  </button>
                  <div className={styles.viewsBadge}>Views: {feed.views}</div>
                </div>
              </div>
              {commentInputsOpen[feed.id] && (
                <div className={styles.commentArea}>
                  {(commentsData[feed.id] || []).map(c => (
                    <div key={c.id} className={styles.commentItem}>
                      <strong>{c.username}</strong>: {c.text}
                    </div>
                  ))}
                  <textarea
                    placeholder="Andika comment..."
                    value={commentText[feed.id] || ""}
                    maxLength={500}
                    className={styles.commentInput}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [feed.id]: e.target.value }))}
                  />
                  <button className={styles.commentBtn} onClick={() => submitComment(feed.id)}>Send</button>
                </div>
              )}
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

// SSR feeds
export async function getServerSideProps() {
  try {
    const feedsCol = collection(db, "feeds");
    const q = query(feedsCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const feeds = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        username: data.username,
        text: data.text,
        bg: data.bg,
        likes: data.likes || 0,
        commentsCount: data.commentsCount || 0,
        shares: data.shares || 0,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      };
    });
    return { props: { initialFeeds: feeds } };
  } catch (err) {
    console.error("SSR Firestore Error:", err);
    return { props: { initialFeeds: [] } };
  }
}
