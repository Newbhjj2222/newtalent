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
      // 🔹 YouTube link
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        const playlistMatch = url.match(/[?&]list=([^&]+)/);
        if (playlistMatch) {
          const listId = playlistMatch[1];
          url = `https://www.youtube.com/embed/videoseries?list=${listId}&enablejsapi=1&autoplay=1&rel=0`;
        } else {
          if (url.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
          } else {
            videoId = new URL(url).searchParams.get('v');
          }
          url = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&rel=0`;
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

  // 🔹 YouTube IFrame API
  useEffect(() => {
    if (playerType !== 'youtube') return;

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = createPlayer;
      }
    };

    const createPlayer = () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
      youtubePlayerRef.current = new window.YT.Player(iframeRef.current, {
        height: '450',
        width: '100%',
        videoId: extractVideoId(videoUrl),
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (onVideoEnd) onVideoEnd();
            }
          },
        },
      });
    };

    const extractVideoId = (url) => {
      if (url.includes('youtu.be')) return url.split('youtu.be/')[1].split('?')[0];
      return new URL(url).searchParams.get('v');
    };

    loadYouTubeAPI();
  }, [playerType, videoUrl, onVideoEnd]);

  // 🔹 MP4 ended handler
  const handleVideoEnded = () => {
    if (onVideoEnd) onVideoEnd(); // nta delay
  };

  if (!videoUrl) return <p>Video link ntabwo yabonetse</p>;

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: 'auto' }}>
      {playerType === 'video' ? (
        <video
          src={normalizedUrl}
          controls
          autoPlay
          preload="auto"
          muted
          onEnded={handleVideoEnded}
          style={{ width: '100%', height: '450px', borderRadius: '8px' }}
        />
      ) : playerType === 'youtube' ? (
        <div
          ref={iframeRef}
          id={`youtube-player-${Math.random()}`}
          style={{ width: '100%', height: '450px' }}
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
