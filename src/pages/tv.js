// pages/newtalentsgtv.js
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '../components/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import styles from "../components/NewtalentsG.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewtalentsGTv = ({ userId }) => {
  const actualUserId = userId || 'NewtalentsG';
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  /** 🔹 Normalize YouTube URLs */
  const normalizeYoutubeUrl = (url) => {
    if (!url) return '';
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

        const sorted = shows.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setVideos(sorted);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []);

  /** 🔹 Load YouTube IFrame API once */
  useEffect(() => {
    if (document.getElementById("youtube-iframe-api")) return;
    const tag = document.createElement("script");
    tag.id = "youtube-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  /** 🔹 Initialize YouTube Player */
  useEffect(() => {
    if (!videos.length) return;

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        height: "390",
        width: "640",
        videoId: extractVideoId(videos[currentIndex].videoUrl),
        playerVars: { autoplay: 1, controls: 1, rel: 0 },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: handleStateChange,
        },
      });
    };
  }, [videos]);

  /** 🔹 Extract Video ID */
  const extractVideoId = (url) => {
    const cleanUrl = normalizeYoutubeUrl(url);
    const regex = /[?&]v=([^&#]+)/;
    const match = cleanUrl.match(regex);
    if (match && match[1]) return match[1];
    const short = cleanUrl.split('/').pop();
    return short;
  };

  /** 🔹 Handle state change */
  const handleStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      const nextIndex = (currentIndex + 1) % videos.length;
      setCurrentIndex(nextIndex);
      playerRef.current.loadVideoById(extractVideoId(videos[nextIndex].videoUrl));
      recordView();
    }
  };

  /** 🔹 Follow */
  const handleFollow = async () => {
    const video = videos[currentIndex];
    if (!video) return;
    const docRef = doc(db, 'Newtalentsg', `${actualUserId}_${video.id}`);
    await setDoc(docRef, {
      userId: actualUserId,
      videoId: video.id,
      followedAt: new Date(),
    });
    alert('Wamaze gukurikira!');
  };

  /** 🔹 Record View */
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

  /** 🔹 Record when video changes */
  useEffect(() => {
    if (videos.length > 0) recordView();
  }, [currentIndex, videos.length, recordView]);

  /** 🔹 Timer update */
  useEffect(() => {
    if (!playerRef.current) return;
    intervalRef.current = setInterval(() => {
      const duration = playerRef.current.getDuration?.() || 0;
      const current = playerRef.current.getCurrentTime?.() || 0;
      setTimeLeft(Math.max(Math.floor(duration - current), 0));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className={styles.videoPlayer}>Loading videos...</div>;
  if (!videos.length) return <div className={styles.videoPlayer}>No videos available</div>;

  const currentVideo = videos[currentIndex];
  const nextVideo = videos[(currentIndex + 1) % videos.length];

  return (
    <>
      <Header />
      <div className={styles.videoPlayer}>
        <h2>{currentVideo.title}</h2>

        <div className={styles.playerWrapper}>
          <div id="yt-player"></div>
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
