import React, { useState, useRef } from "react";
import { db } from "../components/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiDownload } from "react-icons/fi"; // React icon for download

export default function LyricPage({ lyricsDataServer }) {
  const [lyricsData, setLyricsData] = useState(lyricsDataServer);
  const audioRefs = useRef({});
  const [playingId, setPlayingId] = useState(null);

  // Handle audio play (one at a time) + increment views
  const handlePlay = async (id) => {
    // Pause others
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id && audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });

    // Play selected
    if (audioRefs.current[id]) {
      audioRefs.current[id].play();
      setPlayingId(id);
    }

    try {
      const docRef = doc(db, "lyrics", id);
      await updateDoc(docRef, { views: increment(1) });

      // Update local state instantly
      setLyricsData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
        )
      );
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  // Handle audio download
  const handleDownload = (url, title) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "audio"}.mp3`;
    link.click();
  };

  return (
    <>
      <Header />

      <div className="lyrics-page-container">
        {lyricsData.map((lyric) => (
          <div key={lyric.id} className="lyric-card">
            <h2 className="title">{lyric.title}</h2>
            <p className="username">By: {lyric.username}</p>

            {lyric.audioUrl && (
              <div className="audio-container">
                <audio
                  ref={(el) => (audioRefs.current[lyric.id] = el)}
                  controls
                  src={lyric.audioUrl}
                  onPlay={() => handlePlay(lyric.id)}
                ></audio>

                <button
                  className="download-btn"
                  onClick={() => handleDownload(lyric.audioUrl, lyric.title)}
                  title="Download Audio"
                >
                  <FiDownload size={20} />
                </button>
              </div>
            )}

            <div
              className="lyrics-text"
              dangerouslySetInnerHTML={{
                __html: lyric.lyrics.replace(/<\/?[^>]+(>|$)/g, ""),
              }}
            ></div>

            <p className="views">Views: {lyric.views || 0}</p>
          </div>
        ))}
      </div>

      <Footer />

      <style jsx>{`
        .lyrics-page-container {
          max-width: 700px;
          margin: 50px auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 0 15px;
        }

        .lyric-card {
          text-align: center;
          background: #f3f4f6;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #111827;
        }

        .username {
          font-size: 0.95rem;
          margin-bottom: 15px;
          color: #6b7280;
        }

        .audio-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 15px 0;
        }

        audio {
          width: 80%;
        }

        .download-btn {
          background: #2563eb;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .download-btn:hover {
          background: #1e40af;
        }

        .lyrics-text {
          font-size: 1.1rem;
          color: #1f2937;
          line-height: 1.6;
          white-space: pre-wrap;
          text-align: center;
        }

        .views {
          margin-top: 15px;
          font-size: 0.95rem;
          color: #047857;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .lyrics-page-container {
            padding: 0 10px;
          }
          audio {
            width: 70%;
          }
        }
      `}</style>
    </>
  );
}

// SSR: fetch lyrics before render
export async function getServerSideProps() {
  let lyricsData = [];
  try {
    const snapshot = await getDocs(collection(db, "lyrics"));
    lyricsData = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error("Error fetching lyrics:", error);
  }

  return {
    props: {
      lyricsDataServer: lyricsData,
    },
  };
}
