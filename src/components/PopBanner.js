import React, { useEffect, useState } from 'react';
import './PopBanner.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PopBanner = ({ onClose }) => {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fungura localStorage backup niba internet yabaye nkeya
  useEffect(() => {
    const savedPosts = localStorage.getItem('popPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Fata amakuru ya Firebase no kubika muri localStorage
  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pop'));
      const popData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Reba niba hari impinduka mbere yo kubika no gushyira mu state
      const previous = localStorage.getItem('popPosts');
      const prevData = previous ? JSON.parse(previous) : [];

      const isDifferent = JSON.stringify(popData) !== JSON.stringify(prevData);
      if (isDifferent) {
        localStorage.setItem('popPosts', JSON.stringify(popData));
        setPosts(popData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Hitamo amakuru bwa mbere

    // Hanyuma ugenzure buri minota 1 niba hari ibishya
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  if (!posts.length) return null;

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
            <button
              onClick={() => setCurrentIndex((currentIndex - 1 + posts.length) % posts.length)}
            >
              ‹ Prev
            </button>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % posts.length)}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopBanner;
