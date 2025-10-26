'use client';
import Head from "next/head";

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
import { db } from "../components/firebase";
import Pop from "../components/Pop";
import Sound from "../components/Sound";
import Chat from "../components/Chat";
import SponsorCard from "../components/SponsorCard";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const foldersSnapshot = await getDocs(collection(db, "folders"));

    // 🔹 Fata gusa folders zifite hidden ≠ true
    const visibleDocs = foldersSnapshot.docs.filter(
      (doc) => !doc.data().hidden
    );

    // Fata titles zidasubirwamo  
    const cleanedTitles = visibleDocs.map((doc) => {  
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
        sidebarPosts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        trendingPosts: [],
        otherPosts: [],
        screenTexts: [],
        sidebarPosts: [],
      },
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
     <>
      <Head>
        <title>New Talents Stories Group</title>
        <meta
          name="description"
          content="New Talents Stories group n'urubuga rurimo inkuru zitandukanye zo gusoma zabanditsi batandukanye."
        />
        <meta
          name="keywords"
          content="newtalentg, new talents stories group, inkuru ndende, inkuru zurukundo, inkuru ngufi, agasobanuye, urubyiruko, newtalentsg, New Talents Stories Group"
        />
        <meta name="author" content="New Talents Stories Group" />

        {/* Open Graph */}
        <meta property="og:title" content="New Talents Stories Group" />
        <meta
          property="og:description"
          content="Urubuga rw’abafite impano mu Rwanda no hanze, rugufasha gusoma inkuru zitandukanye no kwandika no kubyaza inyungu ibihangano byawe."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://newtalentsg.co.rw/" />
        <meta property="og:image" content="https://newtalentsg.co.rw/logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="New Talents Stories Group" />
        <meta
          name="twitter:description"
          content="Urubuga rw’abafite impano mu Rwanda no hanze, rugufasha kwandika no gusoma inkuru zitandukanye."
        />
        <meta name="twitter:image" content="https://newtalentsg.co.rw/logo.png" />

        {/* Canonical link */}
        <link rel="canonical" href="https://newtalentsg.co.rw/" />
      </Head>
    <div className={stylesHome.page}>
            <Sound />
      <Header />
      <Banner screenTexts={screenTexts} />
            <SponsorCard />
      <div className={stylesHome.container}>
    
        <main className={stylesHome.mainContent}>
          <Slider trendingPosts={trendingPosts} />

          <section className={stylesHome.postsSection}>
     <aside className={stylesHome.sidebarWrapper}>
          <Sidebar posts={sidebarPosts} onSelectPost={handleSelectPost} />
        </aside>
            <h2>All Stories</h2>
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
                  <div key={post.id} className={stylesHome.postCard}>
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

                      {/* Categories as tags */}
                      <div className={stylesHome.categoriesWrapper}>
                        {post.categories &&
                          post.categories.map((cat, i) => (
                            <span key={i} className={stylesHome.categoryTag}>
                              {cat}
                            </span>
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
                    <button
                      onClick={handleLoadMore}
                      className={stylesHome.loadMoreBtn}
                    >
                      Kanda urebe izindi
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No posts found.</p>
            )}
          </section>

          <OtherStories posts={otherPosts} />
              <Pop />
        </main>
      </div>
<Chat />
      <Footer />
    </div>
     </>
  );
}
