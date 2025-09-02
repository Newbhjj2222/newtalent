'use client';

import React, { useEffect, useRef, useState } from 'react';

const UniversalVideoPlayer = ({ videoUrl, onVideoEnd }) => {
  const [playerType, setPlayerType] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const iframeRef = useRef(null);
  const youtubePlayerRef = useRef(null);

  // 🔹 Detect video type and normalize URL
  useEffect(() => {
    if (!videoUrl) return;

    let url = videoUrl.trim();

    try {
      // YouTube link
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        const playlistMatch = url.match(/[?&]list=([^&]+)/);
        if (playlistMatch) {
          const listId = playlistMatch[1];
          url = `https://www.youtube.com/embed/videoseries?list=${listId}&enablejsapi=1`;
        } else {
          if (url.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
          } else {
            videoId = new URL(url).searchParams.get('v');
          }
          url = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        }
        setPlayerType('youtube');
        setNormalizedUrl(url);
        return;
      }

      // Direct mp4
      if (url.endsWith('.mp4')) {
        setPlayerType('video');
        setNormalizedUrl(url);
        return;
      }

      // Fallback
      setPlayerType('iframe');
      setNormalizedUrl(url);
    } catch (err) {
      console.error('Error parsing video URL:', err);
      setPlayerType('iframe');
      setNormalizedUrl(url);
    }
  }, [videoUrl]);

  // 🔹 YouTube IFrame API
  useEffect(() => {
    if (playerType !== 'youtube' || !window.YT) return;

    // Clear previous player if exists
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy();
      youtubePlayerRef.current = null;
    }

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        if (onVideoEnd) onVideoEnd();
      }
    };

    youtubePlayerRef.current = new window.YT.Player(iframeRef.current, {
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  }, [playerType, normalizedUrl, onVideoEnd]);

  // 🔹 Load YouTube IFrame API if not loaded
  useEffect(() => {
    if (playerType === 'youtube' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, [playerType]);

  // 🔹 MP4 ended handler
  const handleVideoEnded = () => {
    setTimeout(() => {
      if (onVideoEnd) onVideoEnd();
    }, 500);
  };

  if (!videoUrl) return <p>Video link ntabwo yabonetse</p>;

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      {playerType === 'video' ? (
        <video
  src={normalizedUrl}
  controls
  autoPlay
  preload="auto"
  onEnded={handleVideoEnded}
/>
      ) : playerType === 'youtube' ? (
        <div>
          <div
            ref={iframeRef}
            id={`youtube-player-${Math.random()}`}
            style={{ width: '100%', height: '450px' }}
          />
        </div>
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
