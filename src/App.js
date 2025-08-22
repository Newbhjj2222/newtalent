// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Home from './pages/Home';
import PostDetails from './components/PostDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tv from './pages/Tv';
import Balance from './pages/Balance';
import Slider from './components/Slider';
import Banner from './components/Banner';

import { MdAccountBalance } from 'react-icons/md';
import './App.css';

import { UserProvider } from './contexts/UserContext';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/Theme';

import { auth, db, requestNotificationPermission } from './firebase';
import { doc, setDoc } from "firebase/firestore";

const App = () => {
  const [token, setToken] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const initNotifications = async () => {
      if (permissionGranted) {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
          setToken(fcmToken);
          console.log("✅ FCM Token siap:", fcmToken);

          if (auth.currentUser) {
            await setDoc(
              doc(db, "Users", auth.currentUser.uid),
              { fcmToken },
              { merge: true }
            );
            console.log("📌 FCM token saved in Firestore for user:", auth.currentUser.uid);
          }
        }
      }
    };
    initNotifications();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && token) {
        setDoc(
          doc(db, "Users", user.uid),
          { fcmToken: token },
          { merge: true }
        ).then(() => console.log("📌 FCM token saved after login"));
      }
    });
    return () => unsubscribe();
  }, [token, permissionGranted]);

  const handleEnableNotifications = () => {
    setPermissionGranted(true);
  };

  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <Header />
            <ScrollToTop />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/post/:id" element={<PostDetails />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tv" element={<Tv />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/balance" element={<Balance />} />
            </Routes>

            <Footer />

            {/* Floating button yo gusaba notification */}
            {!permissionGranted && (
              <button 
                className="enable-notif-btn" 
                onClick={handleEnableNotifications}
              >
                Enable Notifications
              </button>
            )}

            <Link to="/balance" className="floating-btn">
              <MdAccountBalance size={24} />
            </Link>
          </div>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
