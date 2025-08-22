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

  useEffect(() => {
    const initNotifications = async () => {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);
        console.log("✅ FCM Token siap:", fcmToken);

        // ✅ Bika token muri Firestore niba user ari logged in
        if (auth.currentUser) {
          await setDoc(
            doc(db, "Users", auth.currentUser.uid),
            { fcmToken },
            { merge: true } // ntibisiba ibindi bisanzwe muri document
          );
          console.log("📌 FCM token saved in Firestore for user:", auth.currentUser.uid);
        }
      }
    };

    initNotifications();

    // Handle foreground notifications
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && token) {
        // If user login nyuma yo kubona token
        setDoc(
          doc(db, "Users", user.uid),
          { fcmToken: token },
          { merge: true }
        ).then(() => console.log("📌 FCM token saved after login"));
      }
    });

    return () => unsubscribe();
  }, [token]);

  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <Header />
            <Banner />
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
