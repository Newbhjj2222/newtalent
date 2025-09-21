"use client"; // Mu Next.js 13+, kugirango ibe client-side

import { useEffect } from "react";

export default function WiseAds() {
  useEffect(() => {
    // Zone IDs za Wise Tag
    const zones = {
      banner: "172619", // Banner
      push: "172620"    // Push notifications
    };

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
    <div className="wise-ads-container">
      {/* Banner Placeholder */}
      <div id="propellerads-banner" className="wise-banner"></div>

      {/* Push notifications ntabwo zikenera container */}
      <style jsx>{`
        .wise-ads-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 50px;
        }

        .wise-banner {
          width: 100%;
          max-width: 728px; /* Max banner size */
          min-width: 300px; /* Min banner size */
          height: auto;
          margin: 0 auto;
          text-align: center;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .wise-banner {
            max-width: 468px;
          }
        }

        @media (max-width: 480px) {
          .wise-banner {
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
}
