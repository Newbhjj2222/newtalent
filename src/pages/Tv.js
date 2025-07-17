import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import ReactPlayer from 'react-player';
import './NewtalentsG.css';

const NewtalentsGTv = ({ userId }) => {
  const actualUserId = userId || 'NewtalentsG';
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const countdownRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, 'shows'));
      const shows = [];
      querySnapshot.forEach((docSnap) => {
        shows.push({ id: docSnap.id, ...docSnap.data() });
      });

      const sorted = shows.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setVideos(sorted);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const handleVideoEnd = () => {
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(nextIndex);
  };

  const handleFollow = async () => {
    const video = videos[currentIndex];
    const docRef = doc(db, 'Newtalentsg', `${actualUserId}_${video.id}`);
    await setDoc(docRef, {
      userId: actualUserId,
      videoId: video.id,
      followedAt: new Date(),
    });
    alert('Wakurikiranwe!');
  };

  const recordView = async () => {
    const video = videos[currentIndex];
    const viewRef = doc(db, 'views', `${actualUserId}_${video.id}`);

    await setDoc(viewRef, {
      userId: actualUserId,
      videoId: video.id,
      viewedAt: new Date(),
    });

    const countRef = doc(db, 'shows', video.id);
    await updateDoc(countRef, {
      views: increment(1),
    });
  };

  useEffect(() => {
    if (videos.length > 0) {
      recordView();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!playerRef.current) return;

    countdownRef.current = setInterval(() => {
      const played = playerRef.current.getCurrentTime?.() || 0;
      const duration = playerRef.current.getDuration?.() || 0;
      const remaining = Math.max(duration - played, 0);
      setTimeLeft(Math.floor(remaining));
    }, 1000);

    return () => {
      clearInterval(countdownRef.current);
    };
  }, [videoDuration, currentIndex]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  const getPlayerUrlAndConfig = (url) => {
    if (url.includes('youtube.com/playlist') || url.includes('list=')) {
      const listId = url.split('list=')[1]?.split('&')[0];
      return {
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // placeholder
        config: {
          youtube: {
            playerVars: {
              listType: 'playlist',
              list: listId,
            },
          },
        },
      };
    }
    return { url, config: {} };
  };

  if (loading) return <div className="video-player">Loading videos...</div>;

  const currentVideo = videos[currentIndex];
  const nextVideo = videos[(currentIndex + 1) % videos.length];
  const { url, config } = getPlayerUrlAndConfig(currentVideo.videoUrl);

  return (
    <div className="video-player">
      <h2>{currentVideo.title}</h2>

      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={url}
          config={config}
          playing={true}
          controls={true}
          width="100%"
          height="100%"
          className="react-player"
          onEnded={handleVideoEnd}
          onDuration={(duration) => setVideoDuration(duration)}
        />
      </div>

      <div className="controls">
        <button onClick={handleFollow}>Follow</button>
        <p>
          ⏳ Time left on this video: <strong>{formatTime(timeLeft)}</strong>
        </p>
        <p>
          ⌚ Current time: <strong>{getCurrentTimeString()}</strong>
        </p>
        <p>
          ▶️ Next video: <strong>{nextVideo?.title || 'None'}</strong>
        </p>
      </div>
    </div>
  );
};

export default NewtalentsGTv;
