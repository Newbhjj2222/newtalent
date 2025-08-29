'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import styles from "./Posts.module.css";

export default function PostsSection({ initialPosts }) {
  const POSTS_PER_PAGE = 25; // umubare w'inkuru buri gihe igaragazwa
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef(null);

  useEffect(() => {
    // Scroll to section on mount
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    setVisibleCount(POSTS_PER_PAGE); // Reset visible count on search
  };

  const filteredPosts = initialPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className={styles.postsSection} ref={sectionRef}>
      <h2>All Posts</h2>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchQuery}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      {filteredPosts.length > 0 ? (
        <>
          {filteredPosts.slice(0, visibleCount).map((post) => (
            <div key={post.id} className={styles.postCard}>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className={styles.postImg}
                  loading="lazy"
                />
              )}
              <div className={styles.postContent}>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <small className={styles.authorText}>Written By: {post.author}</small>
                <div className={styles.postActions}>
                  <Link href={`/post/${post.id}`} className={styles.actionBtn}>
                    <FaArrowRight /> Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {visibleCount < filteredPosts.length && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <button
                onClick={handleLoadMore}
                className={styles.loadMoreBtn}
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
