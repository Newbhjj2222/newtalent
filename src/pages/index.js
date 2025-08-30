'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Header from "../components/Header";
import Banner from "../components/Banner";
import Slider from "../components/Slider";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import OtherStories from "../components/OtherStories";
import stylesHome from "../components/HomePage.module.css";
import AdBanner from "../components/AdBanner";
import { db } from "../components/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const foldersSnapshot = await getDocs(collection(db, "folders"));

    const cleanedTitles = foldersSnapshot.docs.map((doc) => {
      const rawTitle = doc.data().title || "Untitled";
      return rawTitle
        .replace(/S\d{1,2}E\d{1,2}/gi, "")
        .replace(/Ep\s?\d+/gi, "")
        .replace(/Episode\s?\d+/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    });

    const uniqueTitles = [...new Set(cleanedTitles)];
    const sidebarPosts = uniqueTitles.map((title, index) => ({ id: index, title }));

    const trendingSnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"))
    );

    const trendingPosts = trendingSnapshot.docs.map((doc) => {
      const data = doc.data();
      const summary = data.story
        ? data.story.replace(/<[^>]+>/g, "").split(" ").slice(0, 20).join(" ") + "..."
        : "";
      return {
        id: doc.id,
        image: data.imageUrl || "",
        title: data.head || "Untitled",
        summary,
        author: data.author || "Unknown",
        categories: data.categories || ["General"], // 👈 categories array
      };
    });

    const otherPosts = [...trendingPosts].sort(() => Math.random() - 0.5).slice(0, 5);

    const screensSnapshot = await getDocs(collection(db, "screens"));
    const screenTexts = screensSnapshot.docs.map((doc) => doc.data().content || "");

    return {
      props: {
        trendingPosts,
        otherPosts,
        screenTexts,
        sidebarPosts
      }
    };

  } catch (error) {
    console.error(error);
    return {
      props: {
        trendingPosts: [],
        otherPosts: [],
        screenTexts: [],
        sidebarPosts: []
      }
    };
  }
}

// React Component
export default function Home({ trendingPosts, otherPosts, screenTexts, sidebarPosts }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarSelected, setIsSidebarSelected] = useState(false); // 👈 check if sidebar filled search
  const POSTS_PER_PAGE = 25;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const searchRef = useRef(null);

  const handlePostClick = (id) => {
    router.push(`/post/${id}`);
  };

  const handleSelectPost = (title) => {
    setSearchQuery(title);
    setIsSidebarSelected(true); // 👈 disable editing if from sidebar
    setVisibleCount(POSTS_PER_PAGE);

    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      searchRef.current.focus();
    }
  };

  const filteredPosts = trendingPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className={stylesHome.page}>
      <Header />
      <Banner screenTexts={screenTexts} />
      <AdBanner />

      <div className={stylesHome.container}>
        <main className={stylesHome.mainContent}>
          <Slider trendingPosts={trendingPosts} />

          <section className={stylesHome.postsSection}>
            <h2>Trending Stories</h2>
            <input
              type="text"
              placeholder="Search posts..."
              className={stylesHome.searchInput}
              value={searchQuery}
              onChange={(e) => {
                if (!isSidebarSelected) { // 👈 prevent typing after sidebar select
                  setSearchQuery(e.target.value);
                  setVisibleCount(POSTS_PER_PAGE);
                }
              }}
              ref={searchRef}
              readOnly={isSidebarSelected} // 👈 disable edit if sidebar selected
            />

            {filteredPosts.length > 0 ? (
              <>
                {filteredPosts.slice(0, visibleCount).map((post) => (
                  <div
                    key={post.id}
                    className={stylesHome.postCard}
                    onClick={() => handlePostClick(post.id)}
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className={stylesHome.postImage}
                      />
                    )}
                    <div className={stylesHome.postContent}>
                      <h3>{post.title}</h3>
                      <p>{post.summary}</p>

                      {/* Categories as links */}
                      <div className={stylesHome.categories}>
                        {post.categories.map((cat, i) => (
                          <Link
                            key={i}
                            href={`/category/${encodeURIComponent(cat)}`}
                            className={stylesHome.categoryTag}
                            onClick={(e) => e.stopPropagation()} // prevent opening post when clicking category
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>

                      <small className={stylesHome.authorText}>By {post.author}</small>
                      <div className={stylesHome.postActions}>
                        <Link href={`/post/${post.id}`} className={stylesHome.actionBtn}>
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {visibleCount < filteredPosts.length && (
                  <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <button onClick={handleLoadMore} className={stylesHome.loadMoreBtn}>
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No posts found.</p>
            )}
          </section>

          <OtherStories posts={otherPosts} />
        </main>

        <aside className={stylesHome.sidebarWrapper}>
          <Sidebar posts={sidebarPosts} onSelectPost={handleSelectPost} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
