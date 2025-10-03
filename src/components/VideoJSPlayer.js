'use client';
import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Plugins for YouTube & Vimeo
import 'videojs-youtube';
import 'videojs-vimeo';

const VideoJSPlayer = ({ url, title }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Function yo guhitamo type bitewe na URL
  const getType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('.m3u8')) return 'application/x-mpegURL'; // HLS
    if (url.includes('.mpd')) return 'application/dash+xml'; // DASH
    return 'video/mp4'; // fallback
  };

  useEffect(() => {
    if (videoRef.current) {
      const type = getType(url);

      if (!playerRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: 'auto',
          fluid: true,
          sources: [{ src: url, type }],
        });
      } else {
        playerRef.current.src({ src: url, type });
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [url]);

  return (
    <div style={{ marginBottom: '30px' }}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
      {title && (
        <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#333' }}>
          ▶️ {title}
        </p>
      )}
    </div>
  );
};

export default VideoJSPlayer;
