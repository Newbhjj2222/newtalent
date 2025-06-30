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
  const actualUserId = userId || "NewtalentsG";
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const countdownRef = useRef(null);

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

      // Countdown logic
      const duration = 15; // seconds before playing next video automatically
      let time = duration;
      setTimeLeft(time);

      countdownRef.current && clearInterval(countdownRef.current);

      countdownRef.current = setInterval(() => {
        time -= 1;
        setTimeLeft(time);
        if (time <= 0) {
          clearInterval(countdownRef.current);
          handleVideoEnd();
        }
      }, 1000);
    }

    return () => {
      clearInterval(countdownRef.current);
    };
  }, [currentIndex]);

  if (loading) return <div className="video-player">Loading videos...</div>;

  const currentVideo = videos[currentIndex];
  const nextVideo = videos[(currentIndex + 1) % videos.length];

  return (
    <div className="video-player">
      <h2>{currentVideo.title}</h2>

      <div className="player-wrapper">
        <ReactPlayer
          url={currentVideo.videoUrl}
          playing
          controls
          width="100%"
          height="100%"
          className="react-player"
        />
      </div>

      <div className="controls">
        <button onClick={handleFollow}>Follow</button>
        <p>
          Next video in: <strong>{timeLeft}s</strong> – <em>{nextVideo.title}</em>
        </p>
      </div>
    </div>
  );
};

export default NewtalentsGTv;
