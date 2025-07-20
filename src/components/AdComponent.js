// src/components/AdComponent.js
import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // Tuma script ishyirwa mu nyandiko rimwe gusa
    const scriptId = 'adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9785472098220068";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // Tuma ad yerekana
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9785472098220068"
        data-ad-slot="4501050385"
        data-ad-format="auto"
        data-full-width-responsive="true">
      </ins>
    </div>
  );
};

export default AdComponent;
