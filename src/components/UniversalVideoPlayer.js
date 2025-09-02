'use client';

import React, { useEffect, useState, useRef } from 'react';

const UniversalVideoPlayer = ({ videoUrl, onVideoEnd }) => {
  const [playerType, setPlayerType] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!videoUrl) return;

    let url = videoUrl.trim();

    try {
      // 🔹 YouTube link
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Playlist
        const playlistMatch = url.match(/[?&]list=([^&]+)/);
        if (playlistMatch) {
          const listId = playlistMatch[1];
          url = `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1&rel=0&enablejsapi=1`;
        } else {
          // Single video
          let videoId = '';
          if (url.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
          } else {
            videoId = new URL(url).searchParams.get('v');
          }
          url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
        }
        setPlayerType('youtube');
        setNormalizedUrl(url);
        return;
      }

      // 🔹 Direct mp4
      if (url.endsWith('.mp4')) {
        setPlayerType('video');
        setNormalizedUrl(url);
        return;
      }

      // 🔹 Fallback
      setPlayerType('iframe');
      setNormalizedUrl(url);
    } catch (err) {
      console.error('Error parsing video URL:', err);
      setPlayerType('iframe');
      setNormalizedUrl(url);
    }
  }, [videoUrl]);

  // 🔹 Automatic next after MP4 ends
  const handleVideoEnded = () => {
    setTimeout(() => {
      if (onVideoEnd) onVideoEnd();
    }, 1000); // 1 second delay
  };

  if (!videoUrl) return <p>Video link ntabwo yabonetse</p>;

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      {playerType === 'video' ? (
        <video
          src={normalizedUrl}
          controls
          autoPlay
          onEnded={handleVideoEnded}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <iframe
          ref={iframeRef}
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
