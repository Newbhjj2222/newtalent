// src/components/OtherStories.js
import React from "react";
import Link from "next/link";
import Team from "./Team";
import styles from "./OtherStories.module.css";

const OtherStories = ({ posts }) => {
  return (
    <div className={styles.otherStories}>
      <h2>INKURU ZIKUNZWE</h2>

      {posts.length === 0 ? (
        <p>Loading stories...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className={styles.storyCard}>
            <img
              src={post.image || "https://source.unsplash.com/80x80/?story"}
              alt={post.title}
              className={styles.storyImage}
            />
            <div className={styles.storyContent}>
              <h4>{post.title}</h4>
              <p>By: {post.author}</p>

              {/* ✅ Dynamic route */}
              <Link href={`/post/${post.id}`} className={styles.readBtn}>
                Read More
              </Link>
            </div>
          </div>
        ))
      )}

      <Team />
    </div>
  );
};

export default OtherStories;
