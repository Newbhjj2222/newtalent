// src/components/AdComponent.js
import React, { useEffect } from 'react';

function AdComponent() {
  useEffect(() => {
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
        data-ad-slot="1234567890" // Hindura ibi na slot yawe ya nyayo
        data-ad-format="auto"
        data-full-width-responsive="true">
      </ins>
    </div>
  );
}

export default AdComponent;
