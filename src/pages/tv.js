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

  // 🔹 Next video logic (circular playlist)
  const handleNextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  if (loading) return <p className={styles.videoPlayer}>Loading videos...</p>;
  if (!videos.length) return <p className={styles.videoPlayer}>No videos available. Add one!</p>;

  const currentVideo = videos[currentIndex];
  const nextVideo = videos[(currentIndex + 1) % videos.length];

  return (
    <div className={styles.videoContainer}>
      {/* 🔹 Input ya videoUrl na content */}
      <div className={styles.videoInput}>
        <input
          type="text"
          placeholder="Shyiramo link ya video..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.inputField}
        />
        <textarea
          placeholder="Shyiramo content ya video..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textareaField}
        />
        <button onClick={saveVideo} className={styles.saveButton}>
          Save Video
        </button>
      </div>

      {/* 🔹 Player ya current video */}
      {currentVideo && (
        <div className={styles.videoPlayer}>
          <div className={styles.contentBox}>{currentVideo.content}</div>
          <UniversalVideoPlayer
            videoUrl={currentVideo.videoUrl}
            key={currentVideo.id} // ensures re-render on change
          />
          <div className={styles.controls}>
            <button onClick={handleNextVideo} className={styles.nextButton}>
              ▶️ Next Video: {nextVideo?.content || 'None'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTalentsGTV;
