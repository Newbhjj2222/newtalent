import React, { useEffect, useState } from 'react';
import './PopBanner.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Configuration ya Firebase

const PopBanner = ({ onClose }) => {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pop'));
        const popData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(popData);
      } catch (error) {
        console.error('Ikosa mu gufata posts:', error);
        setError('Gufata posts byanze. Nyamuneka ongera ugerageze nyuma.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Birategereje...</div>;
  if (error) return <div>{error}</div>;
  if (!posts.length) return null;

  const post = posts[currentIndex];

  return (
    <div className="popbanner-overlay">
      <div className="popbanner-content">
        <button className="close-button" onClick={onClose} aria-label="Funga">
          &times;
        </button>

        <div className="popbanner-body">
          <img
            src={post.imageBase64 || post.image || 'placeholder-image-url.jpg'} // Ishusho y'ikigereranyo
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
              aria-label="Post ya mbere"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % posts.length)}
              aria-label="Post ikurikira"
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
