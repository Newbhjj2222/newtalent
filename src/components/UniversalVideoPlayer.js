'use client';
import React, { useEffect, useRef, useState } from 'react';

const VLCStyleMediaPlayer = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = playlist[currentIndex];
  const iframeRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const [playerType, setPlayerType] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const [volume, setVolume] = useState(1); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(true);

  const isFirst = currentIndex === 0;

  // 🔹 Detect media type
  useEffect(() => {
    if (!currentMedia) return;
    let url = currentMedia.trim();

    if (url.match(/\.(mp4|webm|mov)$/i)) setPlayerType('video');
    else if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) setPlayerType('audio');
    else if (url.includes('youtube.com') || url.includes('youtu.be')) setPlayerType('youtube');
    else setPlayerType('iframe');

    setNormalizedUrl(url);
  }, [currentMedia]);

  // 🔹 YouTube API
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
      if (youtubePlayerRef.current) youtubePlayerRef.current.destroy();
      const videoId = extractVideoId(normalizedUrl);
      youtubePlayerRef.current = new window.YT.Player(iframeRef.current, {
        height: '450',
        width: '100%',
        videoId: videoId,
        playerVars: { autoplay: 1, mute: 0, rel: 0 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) handleNext();
          },
        },
      });
    };

    const extractVideoId = (url) => {
      if (url.includes('youtu.be')) return url.split('youtu.be/')[1].split('?')[0];
      return new URL(url).searchParams.get('v');
    };

    loadYouTubeAPI();
  }, [playerType, normalizedUrl]);

  const handleNext = () => {
    if (currentIndex + 1 < playlist.length) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <div style={{ width: '100%', height: '450px', borderRadius: '8px', marginBottom: '10px' }}>
        {playerType === 'video' ? (
          <video
            src={normalizedUrl}
            controls
            autoPlay={isPlaying}
            muted={false}
            volume={volume}
            onEnded={handleNext}
            style={{ width: '100%', height: '100%' }}
          />
        ) : playerType === 'audio' ? (
          <audio
            src={normalizedUrl}
            controls
            autoPlay={isPlaying}
            volume={volume}
            onEnded={handleNext}
            style={{ width: '100%' }}
          />
        ) : playerType === 'youtube' ? (
          <div ref={iframeRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <iframe
            src={normalizedUrl}
            width="100%"
            height="450"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      {/* VLC-style controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          ⏮️ Prev
        </button>
        <button onClick={togglePlay}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
        <button onClick={handleNext} disabled={currentIndex === playlist.length - 1}>
          ⏭️ Next
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <strong>Now playing:</strong> {currentMedia}
      </div>
    </div>
  );
};

export default VLCStyleMediaPlayer;
