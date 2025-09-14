"use client";
import { useEffect, useRef } from "react";

export default function AdBanner() {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // Push ads ku buryo Google ibasha gushyiramo iframe
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Ads error:", err);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        textAlign: "center",
        margin: "20px 0",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minWidth: "300px",
          height: "250px",
        }}
        data-ad-client="ca-pub-2059573562083386"
        data-ad-slot="6343851723"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
