'use client';
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

// Function yo guhindura link ziba embed-ready
const getPlayableEmbed = (url) => {
  try {
    if (url.includes('youtu.be')) {
      const clean = url.split('?')[0];
      const id = clean.split('youtu.be/')[1];
      return { type: 'youtube', embed: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1` };
    } else if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return { type: 'youtube', embed: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1` };
    } else if (url.includes('vimeo.com')) {
      const id = url.split('vimeo.com/')[1];
      return { type: 'vimeo', embed: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1` };
    }
    // default: return original link (mp4, mp3, etc.)
    return { type: 'file', embed: url };
  } catch {
    return { type: 'file', embed: url };
  }
};

const VLCPlayer = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef(null);

  const rawUrl = playlist[currentIndex].url;
  const currentMedia = getPlayableEmbed(rawUrl);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % playlist.length);

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', textAlign: 'center' }}>
      {/* Player */}
      {currentMedia.type === 'youtube' || currentMedia.type === 'vimeo' ? (
        <iframe
          src={currentMedia.embed}
          width="100%"
          height="450px"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          onEnded={handleNext} // NB: iframe ntishyigikira onEnded
        ></iframe>
      ) : ReactPlayer.canPlay(currentMedia.embed) ? (
        <ReactPlayer
          ref={playerRef}
          url={currentMedia.embed}
          playing={true}
          muted={true} // 🚀 mute kugirango autoplay ikore neza
          controls={false}
          width="100%"
          height="450px"
          onEnded={handleNext}
        />
      ) : (
        <p style={{ color: 'red' }}>❌ Cannot play this media: {rawUrl}</p>
      )}

      {/* Title */}
      <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>
        ▶️ Now Playing: {playlist[currentIndex].title}
      </p>
    </div>
  );
};

export default VLCPlayer;
