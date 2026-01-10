'use client';
import Head from "next/head";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../components/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import styles from "@/styles/index.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Server-side data fetching
export async function getServerSideProps() {
  try {
    // Fetch all stories from 'free' collection
    const snapshot = await getDocs(
      query(collection(db, "free"), orderBy("createdAt", "desc"))
    );

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const summary = data.story
        ? data.story.replace(/<[^>]+>/g, "").split(" ").slice(0, 20).join(" ") + "..."
        : "";
      return {
        id: doc.id,
        image: data.imageUrl || "",
        title: data.head || "Untitled",
        summary,
        author: data.author || "Unknown",
        season: data.season || "nono",
        episodeNumber: data.episodeNumber || "nono",
      };
    });

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        posts: [],
      },
    };
  }
}

// React Component
export default function Home({ posts }) {
  const router = useRouter();
  const POSTS_PER_PAGE = 10;

  // State to track number of visible posts
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const handlePostClick = (id) => {
    router.push(`/free/${id}`);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>Free Stories</title>
        <meta name="description" content="Soma inkuru zitandukanye kubuntu" />
      </Head>
<Header />
      <div className={styles.page}>
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>All Stories</h1>

          {posts.length === 0 && (
            <p className={styles.noPosts}>No posts available.</p>
          )}

          <div className={styles.postsGrid}>
            {visiblePosts.map((post) => (
              <div
                key={post.id}
                className={styles.postCard}
                onClick={() => handlePostClick(post.id)}
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className={styles.postImage}
                  />
                )}
                <div className={styles.postContent}>
                  <h3 className={styles.postTitle}>
                    {post.title}{" "}
                    {post.season !== "nono" && post.episodeNumber !== "nono"
                      ? `(${post.season} Ep ${post.episodeNumber})`
                      : ""}
                  </h3>
                  <p className={styles.postSummary}>{post.summary}</p>
                  <small className={styles.authorText}>
                    By {post.author}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < posts.length && (
            <div className={styles.loadMoreWrapper}>
              <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
          <Footer />
    </>
  );
}
