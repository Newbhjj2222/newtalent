'use client';
import React, { useEffect, useState } from 'react';

const UniversalVideoPlayer = ({ videoUrl, onEnded }) => {
  const [playerType, setPlayerType] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState('');

  useEffect(() => {
    if (!videoUrl) return;

    let url = videoUrl;

    // 🔹 Detect YouTube links
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      if (url.includes('youtu.be')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      } else if (url.includes('watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        const listId = new URL(url).searchParams.get('list');
        url = listId
          ? `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1&rel=0`
          : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      setPlayerType('iframe');
      setNormalizedUrl(url);
      return;
    }

    // 🔹 Detect MP4 / Mediafire
    if (url.endsWith('.mp4')) {
      setPlayerType('video');
      setNormalizedUrl(url);
      return;
    }

    // 🔹 Fallback to iframe
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
          onEnded={onEnded}
        />
      ) : (
        <iframe
          src={normalizedUrl}
          width="100%"
          height="450"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => {
            // YouTube playlist autoplay handled internally
            if (playerType === 'iframe' && normalizedUrl.includes('list=')) {
              console.log('YouTube playlist, autoplay handled by YouTube.');
            }
          }}
        ></iframe>
      )}
    </div>
  );
};

export default UniversalVideoPlayer;
