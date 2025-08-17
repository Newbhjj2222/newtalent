// App.js
import React from 'react';
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
import Bible from './components/Bible';

import { MdAccountBalance } from 'react-icons/md';
import './App.css';

import { UserProvider } from './contexts/UserContext';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/Theme'; // ✅ Kongeraho ThemeProvider

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider> {/* ✅ Gufunika App yose muri ThemeProvider */}
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
              <Route path="/bible" element={<Bible />} />
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
