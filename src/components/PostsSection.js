import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useLocation, Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Posts.css';
import { db } from '../firebase';

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const PostsSection = ({ selectedTitle }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  // Save to localStorage
  const saveToLocal = (posts) => {
    localStorage.setItem('cachedPosts', JSON.stringify(posts));
  };

  // Load from localStorage
  const loadFromLocal = () => {
    const data = localStorage.getItem('cachedPosts');
    return data ? JSON.parse(data) : [];
  };

  useEffect(() => {
    // Tangira ushyira localStorage mu state
    const cached = loadFromLocal();
    if (cached.length > 0) {
      setAllPosts(cached);
      setLoading(false); // Show cached data immediately
    }

    // Hanyuma utegereje Firebase updates
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const summary = data.story
          ? stripHtml(data.story).split(' ').slice(0, 20).join(' ') + '...'
          : '';
        return {
          id: doc.id,
          image: data.imageUrl || '',
          title: data.head || 'Untitled',
          summary: summary,
          author: data.author || 'Unknown',
          category: data.category || 'General'
        };
      });

      setAllPosts(postsData);
      saveToLocal(postsData); // Refresh cache
      setLoading(false);
    }, (error) => {
      console.error("Error fetching live data: ", error);
      setLoading(false); // Error fallback — ariko cache twarayerekanye hejuru
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = allPosts;

    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTitle) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(selectedTitle.toLowerCase())
      );
    }

    setDisplayedPosts(filtered.slice(0, 50));

    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allPosts, selectedCategory, selectedTitle]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    const baseFilter = allPosts.filter(post => {
      const matchCategory = selectedCategory
        ? post.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchTitle = selectedTitle
        ? post.title.toLowerCase().includes(selectedTitle.toLowerCase())
        : true;
      return matchCategory && matchTitle;
    });

    if (value.trim() === '') {
      setDisplayedPosts(baseFilter.slice(0, 50));
    } else {
      const filtered = baseFilter.filter(post =>
        post.title.toLowerCase().includes(value) ||
        post.author.toLowerCase().includes(value)
      );
      setDisplayedPosts(filtered);
    }
  };

  return (
    <div className="posts-section" ref={sectionRef}>
      <h2>
        {selectedCategory
          ? selectedCategory + ' Stories'
          : selectedTitle
          ? selectedTitle + ' Stories'
          : 'All Posts'}
      </h2>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {loading ? (
        <div>Turategereza inkuru...</div>
      ) : displayedPosts.length > 0 ? (
        displayedPosts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt={post.title} className="post-img" />
            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <small>Written By: {post.author}</small>
              <div className="post-actions">
                <Link to={`/posts/${post.id}`} className="action-btn">
                  <FaArrowRight /> Read More
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Buretse gato tuzane inkuru...</p>
      )}
    </div>
  );
};

export default PostsSection;
