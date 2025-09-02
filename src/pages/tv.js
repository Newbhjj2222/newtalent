'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import styles from '../components/NewtalentsG.module.css';
import UniversalVideoPlayer from '../components/UniversalVideoPlayer';

const NewTalentsGTV = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch videos from Firestore
  const fetchVideos = async () => {
  try {
    const q = query(collection(db, 'shows'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const fetchedVideos = snapshot.docs.map((doc) => ({
      id: doc.id,
      videoUrl: doc.data().videoUrl, // Fata videoUrl gusa
    }));

    // Fata videoUrls zose
    const videoUrls = fetchedVideos.map(video => video.videoUrl).filter(Boolean); // Filter kugirango umenye ko videoUrl itari null cyangwa undefined
    setVideos(videoUrls);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

  useEffect(() => {
    fetchVideos();
  }, []);

  // 🔹 Move to next video (circular playlist)
  const handleNextVideo = () => {
    setCurrentIndex((prev) => (videos.length ? (prev + 1) % videos.length : 0));
  };

  if (loading) return <p className={styles.videoPlayer}>Loading videos...</p>;
  if (!videos.length) return <p className={styles.videoPlayer}>No videos available.</p>;

  const currentVideo = videos[currentIndex];

  return (
    <div className={styles.videoContainer}>
      {currentVideo && (
        <div className={styles.videoPlayer}>
          <div className={styles.contentBox}>{currentVideo.content}</div>
          <UniversalVideoPlayer
            videoUrl={currentVideo.videoUrl}
            key={currentVideo.id}
            onVideoEnd={handleNextVideo} // automatic next
          />
        </div>
      )}
    </div>
  );
};

export default NewTalentsGTV;
