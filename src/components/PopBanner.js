import React, { useEffect, useState } from 'react';
import './PopBanner.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PopBanner = ({ onClose }) => {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // added
  const [error, setError] = useState(null);     // added

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pop'));
        const popData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(popData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return null; // or a spinner
  if (error || !posts.length) return null;

  const post = posts[currentIndex];

  return (
    <div className="popbanner-overlay">
      <div className="popbanner-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="popbanner-body">
          <img
            src={post.imageBase64 || post.image}
            alt={post.title}
            className="popbanner-image"
          />
          <div className="popbanner-text">
            <h2 className="popbanner-title">{post.title}</h2>
            <p className="popbanner-description">{post.description}</p>
          </div>
        </div>
        {posts.length > 1 && (
          <div className="nav-buttons">
            <button onClick={() => setCurrentIndex((currentIndex - 1 + posts.length) % posts.length)}>
              ‹ Prev
            </button>
            <button onClick={() => setCurrentIndex((currentIndex + 1) % posts.length)}>
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopBanner;
