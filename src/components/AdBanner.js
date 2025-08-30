"use client";
import { useEffect, useState, useRef } from "react";

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // Push ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});

      // Reba niba iframe y'ads yinjijwe muri div
      const interval = setInterval(() => {
        const iframe = adRef.current?.querySelector("iframe");
        if (iframe) {
          setIsVisible(true); // Ad yabonetse
          clearInterval(interval);
        }
      }, 500);

      // Clean up interval
      return () => clearInterval(interval);
    } catch (err) {
      console.log("Ads error:", err);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        display: isVisible ? "block" : "none",
        textAlign: "center",
        margin: "20px 0",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2059573562083386"
        data-ad-slot="6343851723"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
