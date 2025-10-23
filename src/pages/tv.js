"use client";

import { useEffect } from "react";
import Head from "next/head";
import styles from "../components/Tv.module.css";
import { db } from "../components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function TvPage() {
  useEffect(() => {
    async function fetchVideos() {
      try {
        const showsRef = collection(db, "shows");
        const showsQuery = query(showsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(showsQuery);
        const videoUrls = snapshot.docs.map(doc => doc.data().videoUrl).filter(Boolean);
        if (videoUrls.length > 0) {
          playPlaylist(videoUrls);
        }
      } catch (err) {
        console.error("Ikosa ribaye:", err);
      }
    }

    function playPlaylist(videoUrls) {
      const container = document.getElementById("autoPlayVideo");
      if (!container || videoUrls.length === 0) return;

      let currentIndex = 0;

      function playNextVideo() {
        if (currentIndex >= videoUrls.length) {
          // Iyo playlist irangiye → subira kuri iya mbere
          currentIndex = 0;
        }

        const url = videoUrls[currentIndex];
        container.innerHTML = ""; // Gusiba video/iframe iheruka

        // ▶️ YouTube Video
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          const videoId = getYoutubeVideoID(url);
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&rel=0&modestbranding=1`;
          iframe.allow = "autoplay; encrypted-media";
          iframe.allowFullscreen = true;
          iframe.className = styles.videoPlayer;
          container.appendChild(iframe);

          // fallback: nyuma y'iminota 5 (300s) ihite ijya ku yindi
          setTimeout(() => {
            currentIndex++;
            playNextVideo();
          }, 1);

        } else {
          // ▶️ MP4 cyangwa izindi video
          const video = document.createElement("video");
          video.src = url;
          video.autoplay = true;
          video.muted = false; // <-- Amafaranga hano!
          video.controls = true;
          video.className = styles.videoPlayer;
          container.appendChild(video);

          video.onended = () => {
            currentIndex++;
            playNextVideo();
          };

          video.play().catch(err => console.error("Autoplay error:", err));
        }
      }

      function getYoutubeVideoID(url) {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.searchParams.get("v") || url.split("/").pop();
        } catch {
          return null;
        }
      }

      playNextVideo();
    }

    fetchVideos();
  }, []);

  return (
    <>
      <Head>
        <title>NewtalentsG Tv</title>
      </Head>

      <div className={styles.ntv}>
        <div className={styles.tv}>
          <div id="autoPlayVideo" className={styles.videoContainer}></div>
        </div>
      </div>
    </>
  );
}
