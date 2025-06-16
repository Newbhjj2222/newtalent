import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './OtherStories.css';

// Shuffle helper function
const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const OtherStories = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = collection(db, 'posts');

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      if (!snapshot.empty) {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().head || 'Untitled',
          author: doc.data().author || 'Unknown',
          image: doc.data().imageUrl || 'https://source.unsplash.com/80x80/?story',
        }));

        // Shuffle and take 5
        const shuffled = shuffleArray(postsData).slice(0, 5);
        setPosts(shuffled);

        // Save to localStorage
        localStorage.setItem('cachedPosts', JSON.stringify(shuffled));
      }
    }, (error) => {
      console.error("Error fetching stories:", error);

      // Fallback: load from localStorage if available
      const cached = localStorage.getItem('cachedPosts');
      if (cached) {
        setPosts(JSON.parse(cached));
      }
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return (
    <div className="other-stories">
      <h2>INKURU ZIKUNZWE</h2>
      {posts.length === 0 ? (
        <p>Loading stories...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="story-card">
            <img src={post.image} alt={post.title} className="story-image" />
            <div className="story-content">
              <h4>{post.title}</h4>
              <p>By: {post.author}</p>
              <Link to={`/posts/${post.id}`} className="read-btn">
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
