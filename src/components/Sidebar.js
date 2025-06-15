import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const Sidebar = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const foldersRef = collection(db, 'folders');

    // Fungura realtime listener
    const unsubscribe = onSnapshot(foldersRef, (snapshot) => {
      const cleanedTitles = snapshot.docs.map((doc) => {
        const rawTitle = doc.data().title || 'Untitled';

        // Gukuramo ibice nk'ibi: S01E03, Ep01, Episode 2
        const cleaned = rawTitle
          .replace(/S\d{1,2}E\d{1,2}/gi, '')
          .replace(/Ep\s?\d+/gi, '')
          .replace(/Episode\s?\d+/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        return cleaned;
      });

      // Gukuramo duplicates
      const uniqueTitles = [...new Set(cleanedTitles)];

      // Tegura array yifashishwa
      const formattedPosts = uniqueTitles.map((title, index) => ({
        id: index,
        title,
      }));

      setPosts(formattedPosts);
      localStorage.setItem('sidebarPosts', JSON.stringify(formattedPosts));
    });

    // Garura amakuru ari muri localStorage mbere y’uko internet itanga ibisubizo
    const savedPosts = localStorage.getItem('sidebarPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    // Gusiba listener igihe component ivuyeho
    return () => unsubscribe();
  }, []);

  return (
    <div className="sidebar">
      <h3>Our Available Stories</h3>
      <ul className="sidebar-list">
        {posts.map((post) => (
          <li key={post.id} onClick={() => onSelectPost(post.title)}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
