'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from '../components/NewtalentsG.module.css';
import UniversalVideoPlayer from '../components/UniversalVideoPlayer';

const NewTalentsGTV = () => {
  const [videos, setVideos] = useState([]); // array y'objects {id, videoUrl, content}
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch videos from Firestore
  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'shows'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedVideos = snapshot.docs
        .map(doc => ({
          id: doc.id,
          videoUrl: doc.data().videoUrl,
          content: doc.data().content || '',
        }))
        .filter(video => video.videoUrl); // ensure videoUrl exists

      console.log('Fetched videos:', fetchedVideos);

      setVideos(fetchedVideos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 🔹 Automatic next video (circular)
  const handleNextVideo = () => {
    setCurrentIndex(prev => (videos.length ? (prev + 1) % videos.length : 0));
  };

  if (loading) return <p className={styles.videoPlayer}>Loading videos...</p>;
  if (!videos.length) return <p className={styles.videoPlayer}>No videos available.</p>;

  const currentVideo = videos[currentIndex];

  return (
    <div className={styles.videoContainer}>
      {currentVideo && (
        <div className={styles.videoPlayer}>
          {currentVideo.content && (
            <div className={styles.contentBox}>{currentVideo.content}</div>
          )}

          {/* 🔹 UniversalVideoPlayer ikina automatic auto-play */}
          <UniversalVideoPlayer
            videoUrl={currentVideo.videoUrl}
            key={currentVideo.id + '-' + currentIndex} // guarantee re-render
            onVideoEnd={handleNextVideo} // automatic next
          />

          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Video {currentIndex + 1} of {videos.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewTalentsGTV;
