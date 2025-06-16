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
  const [showPopBanner, setShowPopBanner] = useState(true);

  const handleSelectPost = (title) => {
    setSelectedTitle(title);
  };

  const popularPost = {
    title: "Uko wakoresha amahirwe yawe neza",
    description: "Menya uko wakwiteza imbere ukoresheje amahirwe aboneka muri sosiyete yacu...",
    image: "https://source.unsplash.com/800x600/?opportunity,success"
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Banner />

      {/* PopBanner igaragara gusa igihe showPopBanner ari true */}
      {showPopBanner && (
        <div className="px-4">
          <PopBanner post={popularPost} onClose={() => setShowPopBanner(false)} />
        </div>
      )}

      <div className="px-4 mt-4">
        <SearchBar />
      </div>

      <div className="main-content flex flex-col lg:flex-row gap-4 px-4 py-6">
        {/* MAIN SECTION */}
        <div className="main-section w-full lg:w-3/4 space-y-6">
          <Slider />
          <PostsSection selectedTitle={selectedTitle} />
          <OtherStories />
        </div>

        {/* SIDEBAR */}
        <div className="sidebar w-full lg:w-1/4 mt-6 lg:mt-0">
          <Sidebar onSelectPost={handleSelectPost} />
        </div>
      </div>
    </div>
  );
};

export default Home;
