// components/VideoBanner.jsx
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function VideoBanner() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const q = query(
        collection(db, "bannerVideos"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);
      snap.forEach((doc) => setVideo(doc.data().videoUrl));
    };

    fetchVideo();
  }, []);

  if (!video) return null;

  return (
    <div style={{ position: "relative", height: 220, borderRadius: 14, overflow: "hidden" }}>
      <video
        src={video}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
          }
