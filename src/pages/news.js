import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { db } from "@/components/firebase";
import Header from "@/components/Header";
import Channel from "@/components/Channel";
import Footer from "@/components/Footer";
import styles from "@/styles/news.module.css";

import { collection, getDocs, updateDoc, doc, increment } from "firebase/firestore";
import { FiHeart, FiBookOpen } from "react-icons/fi";

const cleanText = html =>
  html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";

export default function NewsList({ initialNews }) {
  const [news, setNews] = useState(initialNews);

  const likePost = async id => {
    await updateDoc(doc(db, "news", id), { likes: increment(1) });
    setNews(prev =>
      prev.map(n => (n.id === id ? { ...n, likes: (n.likes || 0) + 1 } : n))
    );
  };

  return (
    <>
      <Head>
        <title>News | New Talents</title>
        <meta
          name="description"
          content="Soma inkuru nshya, amakuru agezweho n'ibitekerezo bifite ireme kuri New Talents."
        />

        {/* Open Graph */}
        <meta property="og:title" content="New Talents News" />
        <meta
          property="og:description"
          content="Inkuru nshya, ibitekerezo n'amakuru agezweho."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.newtalentsg.co.rw/news" />
        <meta
          property="og:image"
          content="https://www.newtalentsg.co.rw/og-news.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header />
      <Channel />

      <div className={styles.container}>
        {news.map(n => {
          const summary = cleanText(n.content).slice(0, 220);

          return (
            <div key={n.id} className={styles.card}>
              {n.imageUrl && (
                <img
                  src={n.imageUrl}
                  alt={n.title}
                  className={styles.image}
                />
              )}

              <h2 className={styles.title}>{n.title}</h2>

              <p className={styles.summary}>
                {summary}{summary.length >= 220 && "..."}
              </p>

              <div className={styles.actions}>
                <button onClick={() => likePost(n.id)}>
                  <FiHeart /> {n.likes || 0}
                </button>

                <Link href={`/news/${n.id}`} className={styles.readMoreBtn}>
                  <FiBookOpen /> Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "news"));
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { props: { initialNews: data } };
}
