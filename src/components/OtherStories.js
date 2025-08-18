import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useTheme } from './Theme'; // ✅ Import theme
import './OtherStories.css';
import Team from "./components/Team";
// Shuffle helper function
const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const OtherStories = () => {
  const [posts, setPosts] = useState([]);
  const { darkMode, fontSize, fontStyle } = useTheme(); // ✅ Theme values

  useEffect(() => {
    const postsRef = collection(db, 'posts');

    const unsubscribe = onSnapshot(
      postsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const postsData = snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().head || 'Untitled',
            author: doc.data().author || 'Unknown',
            image: doc.data().imageUrl || 'https://source.unsplash.com/80x80/?story',
          }));

          const shuffled = shuffleArray(postsData).slice(0, 5);
          setPosts(shuffled);
          localStorage.setItem('cachedPosts', JSON.stringify(shuffled));
        }
      },
      (error) => {
        console.error("Error fetching stories:", error);
        const cached = localStorage.getItem('cachedPosts');
        if (cached) {
          setPosts(JSON.parse(cached));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div
       <Team />
      className="other-stories"
      style={{
        fontSize,
        fontFamily: fontStyle,
        transition: "all 0.3s ease",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: darkMode ? "#1f2937" : "#f7f9fc", // ✅ Background based on theme
        color: darkMode ? "#f9fafb" : "#222", // ✅ Text color based on theme
      }}
    >
      <h2
        style={{
          color: darkMode ? "#38bdf8" : "#007bff", // ✅ Head color based on theme
          borderBottom: `2px solid ${darkMode ? "#38bdf8" : "#007bff"}`,
          paddingBottom: "6px",
        }}
      >
        INKURU ZIKUNZWE
      </h2>

      {posts.length === 0 ? (
        <p>Loading stories...</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="story-card"
            style={{
              border: darkMode ? "1px solid #444" : "1px solid #ddd",
              backgroundColor: darkMode ? "#374151" : "#fff", // ✅ Card background
              transition: "all 0.3s ease"
            }}
          >
            <img src={post.image} alt={post.title} className="story-image" />
            <div className="story-content">
              <h4 style={{ color: darkMode ? "#f3f4f6" : "#222" }}>{post.title}</h4>
              <p style={{ color: darkMode ? "#d1d5db" : "#555" }}>By: {post.author}</p>

              <Link
                to={`/posts/${post.id}`}
                className="read-btn"
                style={{
                  backgroundColor: darkMode ? "#38bdf8" : "#28a745", // ✅ Button background
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "none",
                  fontSize: "13px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? "#0ea5e9" : "#1e7e34";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = darkMode ? "#38bdf8" : "#28a745";
                }}
              >
                <FaArrowRight /> Read More
              </Link>
            </div>
          </div>
        ))
      )}
      
    </div>
  );
};

export default OtherStories;
