'use client';
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { db } from '../components/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from '../components/NewtalentsG.module.css';

const FirestoreVLCPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  // 🔹 Fetch playlist from Firestore
  const fetchPlaylist = async () => {
    try {
      const q = query(collection(db, 'shows'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs
        .map(doc => doc.data().videoUrl)
        .filter(url => url); // ensure URL exists
      setPlaylist(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  if (loading) return <p className={styles.videoPlayer}>Loading playlist...</p>;
  if (!playlist.length) return <p className={styles.videoPlayer}>No media available.</p>;

  const currentMedia = playlist[currentIndex];

  // 🔹 Convert YouTube share links to full playable URL
  const getPlayableUrl = (url) => {
    try {
      if (url.includes('youtu.be')) {
        // youtu.be short link
        const id = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/watch?v=${id}`;
      } else if (url.includes('youtube.com')) {
        // normal youtube link (remove unnecessary query params)
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
      return url; // direct mp4/audio or Vimeo
    } catch {
      return url;
    }
  };

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % playlist.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', fontFamily: 'sans-serif' }}>
      {/* 🔹 Player */}
      <ReactPlayer
        ref={playerRef}
        url={getPlayableUrl(currentMedia)}
        playing={playing}
        volume={volume}
        controls={false}
        width="100%"
        height="450px"
        onEnded={handleNext}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={(dur) => setDuration(dur)}
      />

      {/* 🔹 VLC-style controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        <button onClick={handlePrev}>⏮️ Prev</button>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={handleNext}>⏭️ Next</button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>

      {/* 🔹 Seek bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <span>{formatTime(played * duration)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={played}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            playerRef.current.seekTo(val);
            setPlayed(val);
          }}
          style={{ flexGrow: 1, margin: '0 10px' }}
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* 🔹 Now playing */}
      <p style={{ textAlign: 'center', marginTop: '5px', wordBreak: 'break-word' }}>
        Now playing: {currentMedia}
      </p>
    </div>
  );
};

export default FirestoreVLCPlayer;
