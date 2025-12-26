import Head from "next/head";
import { useState, useEffect } from "react";
import { db } from "@/components/firebase";
import Header from "@/components/Header";
import Channel from "@/components/Channel";
import Footer from "@/components/Footer";
import styles from "@/styles/news.module.css";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { FiHeart, FiShare2, FiMessageCircle } from "react-icons/fi";

const cleanText = html =>
  html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";

export default function SingleNews({ news }) {
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    let u = localStorage.getItem("username");
    if (!u) {
      u = prompt("Andika izina ryawe") || "Anonymous";
      localStorage.setItem("username", u);
    }
    setUsername(u);
  }, []);

  const likePost = async () => {
    await updateDoc(doc(db, "news", news.id), { likes: increment(1) });
  };

  const sharePost = () => {
    const summary = cleanText(news.content).slice(0, 300);
    const text = `${news.title}\n\n${summary}...\n${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert("Inkuru yakopiwe 📋");
  };

  const sendComment = async () => {
    if (!comment.trim()) return;

    await setDoc(doc(collection(db, "news", news.id, "comments")), {
      author: username,
      text: comment,
      timestamp: serverTimestamp()
    });

    await updateDoc(doc(db, "news", news.id), {
      commentsCount: increment(1)
    });

    setComment("");
  };

  const description = cleanText(news.content).slice(0, 160);

  return (
    <>
      <Head>
        <title>{news.title} | New Talents</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://www.newtalentsg.co.rw/news/${news.id}`}
        />
        <meta property="og:image" content={news.imageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={news.imageUrl} />
      </Head>

      <Header />
      <Channel />

      <div className={styles.singleContainer}>
        <h1>{news.title}</h1>

        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className={styles.image}
          />
        )}

        <div
          className="fbText"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <div className={styles.actions}>
          <button onClick={likePost}>
            <FiHeart /> {news.likes || 0}
          </button>

          <button onClick={sharePost}>
            <FiShare2 /> Share
          </button>

          <span>
            <FiMessageCircle /> {news.commentsCount || 0}
          </span>
        </div>

        <div className={styles.commentBox}>
          <input
            placeholder="Andika comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendComment()}
          />
          <button onClick={sendComment}>Send</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const ref = doc(db, "news", params.id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { notFound: true };

  return {
    props: {
      news: { id: snap.id, ...snap.data() }
    }
  };
}
