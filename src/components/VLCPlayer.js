'use client';
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

// Clean YouTube links
const getPlayableUrl = (url) => {
  try {
    if (url.includes('youtu.be')) {
      const clean = url.split('?')[0];
      const id = clean.split('youtu.be/')[1];
      return `https://www.youtube.com/watch?v=${id}`;
    } else if (url.includes('youtube.com/watch')) {
      const clean = url.split('?v=')[1].split('&')[0];
      return `https://www.youtube.com/watch?v=${clean}`;
    }
    return url;
  } catch {
    return url;
  }
};

const VLCPlayer = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  const currentMedia = getPlayableUrl(playlist[currentIndex].url);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % playlist.length);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', textAlign: 'center' }}>
      {/* Player */}
      <ReactPlayer
        ref={playerRef}
        url={currentMedia}
        playing={playing}
        volume={volume}
        controls={false}
        width="100%"
        height="450px"
        onEnded={handleNext}
        onProgress={({ played }) => setPlayed(played)}
      />

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
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

      {/* Seek bar */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={played}
        onChange={(e) => {
          playerRef.current.seekTo(parseFloat(e.target.value));
          setPlayed(parseFloat(e.target.value));
        }}
        style={{ width: '100%', marginTop: '10px' }}
      />

      {/* Show title instead of link */}
      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
        ▶️ Now Playing: {playlist[currentIndex].title}
      </p>
    </div>
  );
};

export default VLCPlayer;
