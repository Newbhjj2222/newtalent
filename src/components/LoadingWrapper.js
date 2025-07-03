// components/LoadingWrapper.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Hindura niba firebase iri ahandi

const LoadingScreen = ({ progress }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fff',
    zIndex: 9999
  }}>
    <div style={{
      width: '80%',
      height: '20px',
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '15px'
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        backgroundColor: '#3498db',
        transition: 'width 0.4s ease-in-out'
      }} />
    </div>
    <p>Loading... {progress}%</p>
  </div>
);

const LoadingWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'posts'));
        const total = snapshot.size;
        let loaded = 0;

        snapshot.forEach(() => {
          loaded++;
          setProgress(Math.round((loaded / total) * 100));
        });

        // Teguza gato loading mbere yo guhagarara
        setTimeout(() => setLoading(false), 500);
      } catch (err) {
        console.error('Error loading initial data', err);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (loading) return <LoadingScreen progress={progress} />;

  return <>{children}</>;
};

export default LoadingWrapper;
