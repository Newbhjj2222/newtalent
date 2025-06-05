import React, { useRef, useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Slider.css';

const Slider = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const trackRef = useRef(null);
  const scrollAmount = 320;
  const navigate = useNavigate();

  useEffect(() => {
    const db = getFirestore();
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(100));

    // Soma amakuru abitswe muri localStorage niba ahari
    const localData = localStorage.getItem('trendingPosts');
    if (localData) {
      setTrendingPosts(JSON.parse(localData));
    }

    // Fungura real-time listener kuri Firebase
    const unsubscribe = onSnapshot(q, snapshot => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const stripHtml = (html) => {
          const docParser = new DOMParser().parseFromString(html, 'text/html');
          return docParser.body.textContent || '';
        };
        const storyWords = data.story ? stripHtml(data.story).split(' ').slice(0, 12).join(' ') + '...' : '';
        return {
          id: doc.id,
          image: data.imageUrl || '',
          title: data.head || '',
          summary: storyWords,
          author: data.author || 'Unknown'
        };
      });

      // Bika amakuru mashya muri state na localStorage
      setTrendingPosts(postsData);
      localStorage.setItem('trendingPosts', JSON.stringify(postsData));
    });

    return () => unsubscribe(); // Siba listener igihe component isibwe
  }, []);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (trackRef.current) {
        const maxScroll = trackRef.current.scrollWidth - trackRef.current.clientWidth;
        const currentScroll = trackRef.current.scrollLeft;

        if (currentScroll + scrollAmount >= maxScroll) {
          trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const openPostDetails = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="slider">
      <h2>Trending Stories</h2>
      <div className="slider-container">
        <button className="nav-button prev" onClick={scrollLeft}>‹</button>
        <div className="slider-wrapper" ref={trackRef}>
          <div className="slider-track">
            {trendingPosts.map((post) => (
              <div
                key={post.id}
                className="post"
                onClick={() => openPostDetails(post.id)}
                style={{ cursor: 'pointer' }}
              >
                {!loadedImages[post.id] && (
                  <div className="image-placeholder">Loading image...</div>
                )}
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ display: loadedImages[post.id] ? 'block' : 'none' }}
                  onLoad={() => handleImageLoad(post.id)}
                />
                <div>
                  <h4>{post.title}</h4>
                  <p>{post.summary}</p>
                  <small>By: {post.author}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="nav-button next" onClick={scrollRight}>›</button>
      </div>
    </div>
  );
};

export default Slider;
