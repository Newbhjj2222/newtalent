'use client';
import React, { useState } from 'react';
import VideoJSPlayer from './VideoJSPlayer';

const VLCPlayer = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const current = playlist[currentIndex];

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', textAlign: 'center' }}>
      <VideoJSPlayer src={current.url} type="video/mp4" />

      <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>
        ▶️ Now Playing: {current.title}
      </p>

      <button
        onClick={handleNext}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Next ▶️
      </button>
    </div>
  );
};

export default VLCPlayer;
