"use client";
import { useEffect, useState } from "react";
import { db } from "./firebase"; // Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import styles from "./Pop.module.css";

export default function Pop() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAggregatePosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "posts"));
        const allPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const aggregated = {};

        allPosts.forEach((post) => {
          if (!post.head) return;

          // ✅ Sukura head mu buryo bwagutse — ifate FINAL / FINALLY / EPISODE / EP mu buryo bwose
          let baseHead = post.head
            .replace(/[\/\-_:.]+/g, " ") // Kuraho amakarita n'utundi tumenyetso
            .replace(/\s+/g, " ") // Kuraho espaces nyinshi
            .replace(
              /\b(SEASON\s*\d+|S\s*\d+|EPISODE\s*\d+|EP\s*\d+|E\s*\d+|FINAL(LY)?|EPISODE\s*FINAL(LY)?|FINAL(LY)?\s*EPISODE|EP\s*FINAL(LY)?|FINAL(LY)?\s*EP|THE\s*END|LAST\s*EPISODE)\b/gi,
              ""
            )
            .trim();

          if (!baseHead) baseHead = "Untitled";

          if (!aggregated[baseHead]) {
            aggregated[baseHead] = {
              head: baseHead,
              totalViews: 0,
              imageUrl: post.imageUrl || null,
              episodeCount: 0,
            };
          }

          // Iteranya views zose
          aggregated[baseHead].totalViews += post.views ?? 0;

          // Fata image ya mbere iboneka
          if (!aggregated[baseHead].imageUrl && post.imageUrl) {
            aggregated[baseHead].imageUrl = post.imageUrl;
          }

          // Bika umubare w’episodes
          aggregated[baseHead].episodeCount += 1;
        });

        // Hindura object ibe array hanyuma utunganye hakurikije views
        const aggregatedArray = Object.values(aggregated)
          .sort((a, b) => b.totalViews - a.totalViews)
          .slice(0, 5); // Only show top 5

        setPosts(aggregatedArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAggregatePosts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading popular posts...</div>;
  }

  if (posts.length === 0) {
    return <div className={styles.loading}>Nta nkuru zikunzwe zibonetse.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🔥 Inkuru Ziri gusomwa cyane</h2>
      <div className={styles.grid}>
        {posts.map((post, idx) => (
          <div key={idx} className={styles.post}>
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.head} className={styles.image} />
            ) : (
              <div className={styles.image}>No Image</div>
            )}
            <div className={styles.content}>
              <h3 className={styles.postTitle}>{post.head}</h3>
              <p className={styles.views}>
                👁 {post.totalViews} views{" "}
                {post.episodeCount > 1 ? `– ${post.episodeCount} episodes` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
