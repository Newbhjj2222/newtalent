import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Sidebar = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const db = getFirestore();
      const foldersRef = collection(db, 'folders');
      const snapshot = await getDocs(foldersRef);

      const cleanedTitles = snapshot.docs.map(doc => {
        const rawTitle = doc.data().title || 'Untitled';

        // ✅ Gukuramo ibice nk'ibi: S01E03, Ep01, Episode 2
        const cleaned = rawTitle
          .replace(/S\d{1,2}E\d{1,2}/gi, '')     // S01E03, S1E1
          .replace(/Ep\s?\d+/gi, '')             // Ep01
          .replace(/Episode\s?\d+/gi, '')        // Episode 2
          .replace(/\s{2,}/g, ' ')               // Kuraho spaces nyinshi
          .trim();                               // Kuraho whitespace ku ntangiriro/iherezo

        return cleaned;
      });

      // ✅ Gukuramo duplicates
      const uniqueTitles = [...new Set(cleanedTitles)];

      // Tubyohereza mu format yakirwa na .map()
      const formattedPosts = uniqueTitles.map((title, index) => ({
        id: index,
        title,
      }));

      setPosts(formattedPosts);
    };

    fetchFolders();
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
