// components/WiseAds.js
"use client";

import { useEffect } from "react";

export default function WiseAds() {
  useEffect(() => {
    const zones = {
      banner: "172619",   // Wise banner ID
      push: "172620",     // Wise push notification ID
    };

    Object.values(zones).forEach((zoneId) => {
      const existing = document.querySelector(`script[data-zone="${zoneId}"]`);
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://fpyf8.com/88/tag.min.js";
        script.async = true;
        script.dataset.zone = zoneId;
        script.dataset.cfasync = "false";
        document.body.appendChild(script);
      }
    });

    return () => {
      Object.values(zones).forEach((zoneId) => {
        const script = document.querySelector(`script[data-zone="${zoneId}"]`);
        if (script) script.remove();
      });
    };
  }, []);

  return (
    <div>
      <div
        id="wise-banner"
        style={{
          width: "100%",
          maxWidth: "728px",
          margin: "20px auto",
          textAlign: "center",
        }}
      ></div>
    </div>
  );
}
