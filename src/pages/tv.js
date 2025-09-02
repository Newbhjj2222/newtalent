// pages/newtalentsgtv.js
'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import styles from '../components/NewtalentsG.module.css';
import UniversalVideoPlayer from '../components/UniversalVideoPlayer';

const NewTalentsGTV = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
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
        ...doc.data(),
      }));
      setVideos(fetchedVideos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 🔹 Save new video URL and content to Firestore (hidden inputs)
  const saveVideo = async () => {
    if (!url || !content) return;
    try {
      await addDoc(collection(db, 'shows'), {
        videoUrl: url,
        content: content,
        createdAt: new Date(),
      });
      setUrl('');
      setContent('');
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  // 🔹 Move to next video (circular playlist)
  const handleNextVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };

  if (loading) return <p className={styles.videoPlayer}>Loading videos...</p>;
  if (!videos.length) return <p className={styles.videoPlayer}>No videos available.</p>;

  const currentVideo = videos[currentIndex];

  return (
    <div className={styles.videoContainer}>
      {/* 🔹 Hidden inputs for admin use */}
      <div style={{ display: 'none' }}>
        <input
          type="text"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={saveVideo}>Add Video</button>
      </div>

      {/* 🔹 Display current video and content */}
      {currentVideo && (
        <div className={styles.videoPlayer}>
          <h1 className={styles.contentBox}>{currentVideo.content}</h1>
          <UniversalVideoPlayer
            videoUrl={currentVideo.videoUrl}
            key={currentVideo.id}
            onEnded={handleNextVideo} // 🔹 Automatic next
          />
        </div>
      )}
    </div>
  );
};

export default NewTalentsGTV;
