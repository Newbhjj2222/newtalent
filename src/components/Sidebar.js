import React from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ posts, onSelectPost }) {
  return (
    <div className={styles.sidebar}>
      <h3>Our Available Stories</h3>
      <ul className={styles.sidebarList}>
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={() => onSelectPost(post.title)}
            style={{ cursor: "pointer" }}
          >
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
