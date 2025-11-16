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
  getDoc
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

  useEffect(() => {
    const u = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (u) setUsername(u);
    else {
      const generated = `user-${Math.floor(Math.random() * 9999)}`;
      setUsername(generated);
      localStorage.setItem("username", generated);
    }
  }, []);

  useEffect(() => {
    const incrementViews = async () => {
      try {
        for (const f of feeds) {
          const ref = doc(db, "feeds", f.id);
          await updateDoc(ref, { views: firestoreIncrement(1) });
        }

        setFeeds(prev => prev.map(p => ({ ...p, views: (p.views || 0) + 1 })));
      } catch (err) {
        console.warn("views increment failed", err);
      }
    };

    if (feeds.length) incrementViews();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Andika post mbere.");
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

      const clientFeed = {
        id: docRef.id,
        ...newFeed,
        createdAt: new Date().toISOString(),
      };

      setFeeds(prev => [clientFeed, ...prev]);
      setText("");
      alert("Post ibitswe!");
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa.");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleLike = async (feedId) => {
    try {
      const ref = doc(db, "feeds", feedId);
      await updateDoc(ref, { likes: firestoreIncrement(1) });

      setFeeds(prev =>
        prev.map(f => f.id === feedId ? { ...f, likes: (f.likes || 0) + 1 } : f)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (feed) => {
    try {
      const summary = feed.text.slice(0, 90);
      await navigator.clipboard.writeText(summary);

      const ref = doc(db, "feeds", feed.id);
      await updateDoc(ref, { shares: firestoreIncrement(1) });

      setFeeds(prev =>
        prev.map(f => f.id === feed.id ? { ...f, shares: (f.shares || 0) + 1 } : f)
      );

      alert("Summary copied!");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    }
  };

  const toggleComments = (fid) => {
    setCommentInputsOpen(prev => ({ ...prev, [fid]: !prev[fid] }));
  };

  const submitComment = async (fid) => {
    const c = (commentText[fid] || "").trim();
    if (!c) return;
    if (c.length > 500) return alert("Comment max 500 chars");

    try {
      await addDoc(collection(db, `feeds/${fid}/comments`), {
        username,
        text: c,
        createdAt: serverTimestamp(),
      });

      const ref = doc(db, "feeds", fid);
      await updateDoc(ref, { commentsCount: firestoreIncrement(1) });

      setFeeds(prev =>
        prev.map(f => f.id === fid ? { ...f, commentsCount: (f.commentsCount || 0) + 1 } : f)
      );

      setCommentText(prev => ({ ...prev, [fid]: "" }));
      alert("Comment saved!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head><title>Daily Feed</title></Head>

      <div className={styles.pageWrap}>
        <Header />

        <main className={styles.container}>
          <section className={styles.postBox}>
            <h2>Andika Post</h2>

            <textarea
              className={styles.textarea}
              placeholder="Andika hano..."
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
                <label>Username:</label>
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
          </section>

          <section className={styles.feedsList}>
            {feeds.map(feed => (
              <article key={feed.id} className={styles.feedCard} style={{ background: feed.bg }}>
                <div className={styles.feedHeader}>
                  <div>
                    <strong>{feed.username}</strong>
                    <div className={styles.meta}>{new Date(feed.createdAt).toLocaleString()}</div>
                  </div>
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
                    <textarea
                      placeholder="Andika comment..."
                      value={commentText[feed.id] || ""}
                      maxLength={500}
                      className={styles.commentInput}
                      onChange={(e) =>
                        setCommentText(prev => ({ ...prev, [feed.id]: e.target.value }))
                      }
                    />
                    <button className={styles.commentBtn} onClick={() => submitComment(feed.id)}>
                      Send
                    </button>
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
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      };
    });

    return { props: { initialFeeds: feeds } };
  } catch (err) {
    console.error("SSR error", err);
    return { props: { initialFeeds: [] } };
  }
}
