"use client";

import { useEffect, useRef } from "react";

export default function Sound() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1.0; // 100%
      audio.loop = true; // Igaruka nta mwanya
      const playAudio = () => {
        audio.play().catch(err => {
          console.warn("Browser yabujije autoplay, ongera ukande kuri page:", err);
        });
      };

      // Gerageza gukina ako kanya
      playAudio();

      // Igihe user akoze interaction, audio irakomeza
      window.addEventListener("click", playAudio);
      window.addEventListener("touchstart", playAudio);

      return () => {
        window.removeEventListener("click", playAudio);
        window.removeEventListener("touchstart", playAudio);
      };
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/back.mp3" // 👉 Hindura hano ukurikize aho ufite audio
      autoPlay
    />
  );
}
