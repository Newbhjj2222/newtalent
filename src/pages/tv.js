// pages/newtalentsgtv.js
'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import UniversalVideoPlayer from '../components/UniversalVideoPlayer';

const NewTalentsGTV = () => {
  const [url, setUrl] = useState('');
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

  // 🔹 Save new video URL to Firestore
  const saveVideo = async () => {
    if (!url) return alert('Shyiramo URL ya video!');

    try {
      await addDoc(collection(db, 'shows'), {
        videoUrl: url,
        title: 'Video nshya', // ushobora kongeraho input ya title
        createdAt: new Date(),
      });
      alert('Video yashyizwe muri Firestore!');
      setUrl('');
      fetchVideos(); // refresh list
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Habaye ikosa mu kubika video!');
    }
  };

  const currentVideo = videos[currentIndex];
  const nextVideo = videos[(currentIndex + 1) % videos.length];

  const handleNextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  if (loading) return <p>Loading videos...</p>;
  if (!videos.length) return <p>No videos available. Add one!</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>NewTalentsG TV</h1>

      {/* 🔹 Input ya video URL */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Shyiramo link ya video..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '60%', padding: '10px', marginRight: '10px' }}
        />
        <button onClick={saveVideo} style={{ padding: '10px 20px' }}>
          Save Video
        </button>
      </div>

      {/* 🔹 Player ya current video */}
      {currentVideo && (
        <>
          <h2>{currentVideo.title || 'Video without title'}</h2>
          <UniversalVideoPlayer videoUrl={currentVideo.videoUrl} />

          <div style={{ marginTop: '10px' }}>
            <button onClick={handleNextVideo} style={{ padding: '5px 10px' }}>
              ▶️ Next Video: {nextVideo?.title || 'None'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewTalentsGTV;
