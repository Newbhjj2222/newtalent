// pages/newtalentsgtv.js
'use client'; // 🔹 Only client-side

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import ReactPlayer from 'react-player';
import styles from "../components/NewtalentsG.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewtalentsGTv = ({ userId }) => {
  const actualUserId = userId || 'NewtalentsG';
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const countdownRef = useRef(null);
  const playerRef = useRef(null);

  /** 🔹 Helper: normalizes YouTube links */
  const normalizeYoutubeUrl = (url) => {
    if (!url) return '';
    // youtu.be short links → youtube.com/watch?v=
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return url;
  };

  /** 🔹 Fetch videos from Firestore */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'shows'));
        const shows = [];
        querySnapshot.forEach((docSnap) => {
          shows.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Sort by createdAt if available
        const sorted = shows.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setVideos(sorted);
        setLoading(false);
        console.log("Fetched videos:", sorted);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []);

  /** 🔹 Move to next video */
  const handleVideoEnd = () => {
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(nextIndex);
  };

  /** 🔹 Follow current video */
  const handleFollow = async () => {
    const video = videos[currentIndex];
    if (!video) return;

    const docRef = doc(db, 'Newtalentsg', `${actualUserId}_${video.id}`);
    await setDoc(docRef, {
      userId: actualUserId,
      videoId: video.id,
      followedAt: new Date(),
    });
    alert('Wakurikiranwe!');
  };

  /** 🔹 Record view count */
  const recordView = useCallback(async () => {
    const video = videos[currentIndex];
    if (!video) return;

    const viewRef = doc(db, 'views', `${actualUserId}_${video.id}`);
    await setDoc(viewRef, {
      userId: actualUserId,
      videoId: video.id,
      viewedAt: new Date(),
    });

    const countRef = doc(db, 'shows', video.id);
    await updateDoc(countRef, { views: increment(1) });
  }, [currentIndex, videos, actualUserId]);

  /** 🔹 Trigger view record when current video changes */
  useEffect(() => {
    if (videos.length > 0) recordView();
  }, [currentIndex, videos.length, recordView]);

  /** 🔹 Countdown for video time left */
  useEffect(() => {
    if (!playerRef.current) return;
    countdownRef.current = setInterval(() => {
      const played = playerRef.current.getCurrentTime?.() || 0;
      const duration = playerRef.current.getDuration?.() || 0;
      const remaining = Math.max(duration - played, 0);
      setTimeLeft(Math.floor(remaining));
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [videoDuration, currentIndex]);

  /** 🔹 Format seconds to mm:ss */
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  /** 🔹 Determine player URL and config (for YouTube playlists) */
  const getPlayerUrlAndConfig = (url) => {
    const cleanUrl = normalizeYoutubeUrl(url);
    if (!cleanUrl) return { url: '', config: {} };

    if (cleanUrl.includes('list=')) {
      const listId = cleanUrl.split('list=')[1]?.split('&')[0];
      return {
        url: cleanUrl,
        config: { youtube: { playerVars: { listType: 'playlist', list: listId } } },
      };
    }
    return { url: cleanUrl, config: {} };
  };

  if (loading) return <div className={styles.videoPlayer}>Loading videos...</div>;
  if (!videos.length) return <div className={styles.videoPlayer}>No videos available</div>;

  const currentVideo = videos[currentIndex];
  const nextVideo = videos[(currentIndex + 1) % videos.length];
  const { url, config } = getPlayerUrlAndConfig(currentVideo.videoUrl);

  return (
    <>
      <Header />
      <div className={styles.videoPlayer}>
        <h2>{currentVideo.title}</h2>

        <div className={styles.playerWrapper}>
          <ReactPlayer
            ref={playerRef}
            url={url}
            config={config}
            playing
            controls
            width="100%"
            height="100%"
            className="react-player"
            onEnded={handleVideoEnd}
            onDuration={setVideoDuration}
          />
        </div>

        <div className={styles.controls}>
          <button onClick={handleFollow}>Follow</button>
          <p>⏳ Time left: <strong>{formatTime(timeLeft)}</strong></p>
          <p>▶️ Next video: <strong>{nextVideo?.title || 'None'}</strong></p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewtalentsGTv;
