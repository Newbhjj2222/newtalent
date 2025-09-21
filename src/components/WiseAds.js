"use client"; // Mu Next.js 13+, kugirango ibe client-side

import { useEffect } from "react";

export default function WiseAds() {
  useEffect(() => {
    // Zone IDs za PropellerAds / Wise Tag
    const zones = {
      banner: "172619",
      push: "172620"
    };

    // Fungura script imwe ikora kuri zones zose
    Object.values(zones).forEach((zoneId) => {
      const script = document.createElement("script");
      script.src = "https://fpyf8.com/88/tag.min.js"; // Wise tag URL
      script.async = true;
      script.dataset.zone = zoneId;
      script.dataset.cfasync = "false";
      document.body.appendChild(script);
    });

    // Cleanup igihe component isohotse
    return () => {
      const scripts = document.querySelectorAll('script[src="https://fpyf8.com/88/tag.min.js"]');
      scripts.forEach((s) => s.remove());
    };
  }, []);

  return (
    <div>
      {/* Placeholder Banner */}
      <div id="propellerads-banner" style={{ width: "100%", textAlign: "center", margin: "20px 0" }}></div>

      {/* Push notifications ntabwo zikenera container */}
    </div>
  );
}
