"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // 🔹 ukoreshe firebase.js iri muri components
import styles from "./PerimeterAdBoard.module.css";

export default function PerimeterAdBoard() {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Fata ads muri Firestore
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ads"));
        const adsData = querySnapshot.docs.map((doc) => doc.data());
        setAds(adsData);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAds();
  }, []);

  // 🔹 Guhinduranya video/images buri second zigenwe
  useEffect(() => {
    if (ads.length === 0) return;

    const currentAd = ads[currentIndex];
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, (currentAd.duration || 5) * 1000);

    return () => clearTimeout(timer);
  }, [ads, currentIndex]);

  // 🔹 Fallback content niba nta data iri muri Firestore
  if (ads.length === 0) {
    return (
      <div className={styles.board}>
        <div className={styles.fallback}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <p className={styles.text}>
            Amamaza business yawe na{" "}
            <strong>New Talents Stories Group</strong>.
          </p>
          <a
            href="https://wa.me/250722319367"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
          >
            WhatsApp: +250 722 319 367
          </a>
        </div>
      </div>
    );
  }

  // 🔹 Niba hari ads
  const currentAd = ads[currentIndex];

  return (
    <div className={styles.board}>
      {currentAd.type === "video" ? (
        <video
          key={currentAd.mediaUrl}
          src={currentAd.mediaUrl}
          autoPlay
          muted
          playsInline
          className={styles.media}
        />
      ) : (
        <img
          key={currentAd.mediaUrl}
          src={currentAd.mediaUrl}
          alt="Ad"
          className={styles.media}
        />
      )}
    </div>
  );
}
