"use client";
import { useEffect, useState } from "react";
import { db } from "./firebase"; // Firebase configuration
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import styles from "./Pop.module.css";

export default function Pop() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          orderBy("views", "desc"), // sort descending by views
          limit(5) // ushobora guhindura umubare ushaka
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetched);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading popular posts...</div>;
  }

  if (posts.length === 0) {
    return <div className={styles.loading}>Nta nkuru zikunzwe zibonetse.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🔥 Inkuru Zasomwe cyane</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} className={styles.image} />
            ) : (
              <div className={styles.image}>No Image</div>
            )}
            <div className={styles.content}>
              <h3 className={styles.postTitle}>{post.head || "Untitled"}</h3>
              <p className={styles.views}>👁 {post.views ?? 0} views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
