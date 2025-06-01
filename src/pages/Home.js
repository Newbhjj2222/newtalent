// src/pages/Home.js
import React, { useState } from 'react';
import Banner from '../components/Banner';
import Slider from '../components/Slider';
import SearchBar from '../components/SearchBar';
import PostsSection from '../components/PostsSection';
import Sidebar from '../components/Sidebar';
import OtherStories from '../components/OtherStories';
import PopBanner from '../components/PopBanner';

const Home = () => {
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showPopBanner, setShowPopBanner] = useState(false);
  const [popularPost, setPopularPost] = useState(null);

  const handleSelectPost = (title) => {
    setSelectedTitle(title);
  };

  return (
    <>
      <Banner />
      {/* PopBanner only if showPopBanner is true */}
      {showPopBanner && (
        <PopBanner post={popularPost} onClose={() => setShowPopBanner(false)} />
      )}
      <SearchBar />
      <div className="main-content flex">
        <div className="main-section w-3/4">
          <Slider />
          <PostsSection selectedTitle={selectedTitle} />
          <OtherStories />
        </div>
        <Sidebar onSelectPost={handleSelectPost} />
      </div>
    </>
  );
};

export default Home;
