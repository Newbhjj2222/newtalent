"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Card.module.css";

export default function SponsorCard() {
  const cardRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkCardState = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        setExpanded(width > 150);
      }
    };
    const interval = setInterval(checkCardState, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div
        ref={cardRef}
        className={`${styles.sponsorCard} ${
          expanded ? styles.expanded : styles.collapsed
        }`}
      >
        <img
          src="/logo.png"
          alt="Sponsor Logo"
          className={styles.sponsorLogo}
        />
        <div className={styles.sponsorDetails}>
          <h3>NewtalentsG Ltd</h3>
          <p>Promoting your business with us. Contact us on WhatsApp: 0722319367</p>
        </div>
      </div>
    </div>
  );
}
