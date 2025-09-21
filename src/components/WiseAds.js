"use client"; // Iyi ikenewe kugirango ibe client-side

import { useEffect } from "react";

export default function WiseAds() {
  useEffect(() => {
    // Zone IDs za Wise Ads
    const zones = {
      banner: "9909708",       // Native Banner (Interstitial)
      inPagePush: "9909707",   // In-Page Push
      pushNotification: "9909710" // Push Notifications
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
    <div className="wise-ads-container">
      {/* Native Banner */}
      <div id="wise-banner" className="wise-banner"></div>

      {/* In-Page Push */}
      <div id="wise-inpage-push" className="wise-inpage-push"></div>

      {/* Push notifications ntabwo zikenera container */}
      <style jsx>{`
        .wise-ads-container {
          width: 100%;
          max-width: 1000px;
          margin: 20px auto;
          text-align: center;
        }

        .wise-banner, .wise-inpage-push {
          width: 100%;
          margin: 10px 0;
          min-height: 90px; /* height y'ibanze ya banner */
        }

        @media (max-width: 768px) {
          .wise-banner, .wise-inpage-push {
            min-height: 70px;
          }
        }

        @media (max-width: 480px) {
          .wise-banner, .wise-inpage-push {
            min-height: 60px;
          }
        }
      `}</style>
    </div>
  );
}
