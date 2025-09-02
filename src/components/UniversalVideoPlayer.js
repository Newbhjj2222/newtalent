// components/UniversalVideoPlayer.js
'use client';

import React, { useEffect, useState } from 'react';

const UniversalVideoPlayer = ({ videoUrl }) => {
  const [playerType, setPlayerType] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState('');

  useEffect(() => {
    if (!videoUrl) return;

    let url = videoUrl;

    // 🔹 Detect YouTube links
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Normalize youtu.be short links
      if (url.includes('youtu.be')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      } else if (url.includes('watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      setPlayerType('iframe');
      setNormalizedUrl(url);
      return;
    }

    // 🔹 Detect Mediafire / Other direct mp4 links
    if (url.endsWith('.mp4')) {
      setPlayerType('video');
      setNormalizedUrl(url);
      return;
    }

    // 🔹 Fallback: treat as iframe
    setPlayerType('iframe');
    setNormalizedUrl(url);
  }, [videoUrl]);

  if (!videoUrl) return <p>No video URL provided</p>;

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      {playerType === 'video' ? (
        <video
          src={normalizedUrl}
          controls
          autoPlay
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <iframe
          src={normalizedUrl}
          width="100%"
          height="450"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default UniversalVideoPlayer;
