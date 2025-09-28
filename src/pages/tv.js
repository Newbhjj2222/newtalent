'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import VLCPlayer from '../components/VLCPlayer';
import styles from '../components/NewtalentsG.module.css';

const NewTalentsGTV = () => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'shows'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedVideos = snapshot.docs
        .map(doc => ({
          id: doc.id,
          videoUrl: doc.data().videoUrl,
          title: doc.data().content || `Video ${doc.id}`,
        }))
        .filter(video => video.videoUrl); // Ensure videoUrl exists

      // Playlist izaba array ya objects { url, title }
      setPlaylist(fetchedVideos.map(v => ({ url: v.videoUrl, title: v.title })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <p className={styles.videoPlayer}>Loading videos...</p>;
  if (!playlist.length) return <p className={styles.videoPlayer}>No videos available.</p>;

  return (
    <div className={styles.videoContainer}>
      <VLCPlayer playlist={playlist} />
    </div>
  );
};

export default NewTalentsGTV;
