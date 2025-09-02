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

  // 🔹 Save new video URL and content to Firestore
  const saveVideo = async () => {
    if (!url) return alert('Shyiramo URL ya video!');
    if (!content) return alert('Shyiramo content ya video!');

    try {
      await addDoc(collection(db, 'shows'), {
        videoUrl: url,
        content: content,
        createdAt: new Date(),
      });
      alert('Video yashyizwe muri Firestore!');
      setUrl('');
      setContent('');
      fetchVideos(); // refresh list
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Habaye ikosa mu kubika video!');
    }
  };

  // 🔹 Move to next video (circular playlist)
  const handleNextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  if (loading) return <p className={styles.videoPlayer}>Loading videos...</p>;
  if (!videos.length) return <p className={styles.videoPlayer}>No videos available. Add one!</p>;

  const currentVideo = videos[currentIndex];

  return (
    <div className={styles.videoContainer}>
      {/* 🔹 Input ya videoUrl na content */}
      

      {/* 🔹 Player ya current video */}
      {currentVideo && (
        <div className={styles.videoPlayer}>
          <div className={styles.contentBox}>{currentVideo.content}</div>
          <UniversalVideoPlayer
            videoUrl={currentVideo.videoUrl}
            key={currentVideo.id} // ensures re-render on change
            onEnded={handleNextVideo} // 🔹 Automatic next
          />
        </div>
      )}
    </div>
  );
};

export default NewTalentsGTV;
