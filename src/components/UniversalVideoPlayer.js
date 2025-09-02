// components/UniversalVideoPlayer.js
'use client';

import React, { useEffect, useState, useRef } from 'react';

const UniversalVideoPlayer = ({ videoUrl, onEnded }) => {
  const [playerType, setPlayerType] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const videoRef = useRef(null);

  // 🔹 Detect link type
  useEffect(() => {
    if (!videoUrl) return;

    let url = videoUrl.trim();

    // 🔹 YouTube detection
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      if (url.includes('youtu.be')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
      } else if (url.includes('watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
      }
      setPlayerType('iframe');
      setNormalizedUrl(url);
      return;
    }

    // 🔹 Direct MP4 link (Mediafire / other)
    if (url.endsWith('.mp4')) {
      setPlayerType('video');
      setNormalizedUrl(url);
      return;
    }

    // 🔹 Fallback: iframe
    setPlayerType('iframe');
    setNormalizedUrl(url);
  }, [videoUrl]);

  // 🔹 Handle MP4 ended
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || playerType !== 'video') return;

    const handleEnded = () => {
      if (onEnded) onEnded();
    };

    videoEl.addEventListener('ended', handleEnded);
    return () => videoEl.removeEventListener('ended', handleEnded);
  }, [playerType, onEnded]);

  if (!videoUrl) return <p>No video URL provided</p>;

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      {playerType === 'video' ? (
        <video
          ref={videoRef}
          src={normalizedUrl}
          controls
          autoPlay
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <iframe
          key={normalizedUrl} // 🔹 ensures re-render on URL change
          src={normalizedUrl}
          width="100%"
          height="450"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video Player"
        ></iframe>
      )}
    </div>
  );
};

export default UniversalVideoPlayer;
