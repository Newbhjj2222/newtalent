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
  // State yo kubika post yahiswemo
  const [selectedTitle, setSelectedTitle] = useState(null);

  // State igenzura niba PopBanner igaragazwa
  const [showPopBanner, setShowPopBanner] = useState(false);

  // State ibika post ikunzwe cyane
  const [popularPost, setPopularPost] = useState(null);

  // Iyi function yakirwa na Sidebar kugira ngo uhitemo post
  const handleSelectPost = (title) => {
    setSelectedTitle(title);
  };

  // Urugero: igihe ushaka kwerekana PopBanner na post ikunzwe
  const handleShowPopular = (post) => {
    setPopularPost(post);
    setShowPopBanner(true);
  };

  return (
    <>
      <Banner />

      {/* PopBanner igaragara gusa igihe showPopBanner ari true */}
      {showPopBanner && popularPost && (
        <PopBanner post={popularPost} onClose={() => setShowPopBanner(false)} />
      )}

      <SearchBar />

      <div className="main-content flex">
        <div className="main-section w-3/4">
          <Slider />
          <PostsSection selectedTitle={selectedTitle} />
          <OtherStories onShowPopular={handleShowPopular} />
        </div>
        
        <Sidebar onSelectPost={handleSelectPost} />
      </div>
    </>
  );
};

export default Home;
