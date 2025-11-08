import React, { useState, useRef, useEffect } from "react";
import { db } from "../components/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiDownload, FiShare2 } from "react-icons/fi";

export default function LyricPage({ lyricsDataServer, sharedId }) {
  const [lyricsData, setLyricsData] = useState(
    lyricsDataServer.map((item) => ({
      ...item,
      showLyrics: sharedId === item.id, // reveal only shared audio
    }))
  );
  const audioRefs = useRef({});
  const router = useRouter();

  // Auto-play shared audio on mount
  useEffect(() => {
    if (sharedId && audioRefs.current[sharedId]) {
      audioRefs.current[sharedId].play();
    }
  }, [sharedId]);

  // Handle play (one audio at a time) + reveal lyrics + increment views
  const handlePlay = async (id) => {
    // Pause other audios
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id && audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });

    // Reveal lyrics for this audio
    setLyricsData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, showLyrics: true } : { ...item, showLyrics: false }
      )
    );

    // Play audio
    if (audioRefs.current[id]) {
      audioRefs.current[id].play();
    }

    // Increment views in Firestore
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

  // Download audio
  const handleDownload = (url, title) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "audio"}.mp3`;
    link.click();
  };

  // Share audio (copy domain + id)
  const handleShare = (id) => {
    const domain = "https://www.newtalentsg.co.rw"; // replace with your domain
    const shareUrl = `${domain}/lyric?id=${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Audio share link copied!");
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
                />
                <div className="action-buttons">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(lyric.audioUrl, lyric.title)}
                    title="Download Audio"
                  >
                    <FiDownload size={20} />
                  </button>
                  <button
                    className="share-btn"
                    onClick={() => handleShare(lyric.id)}
                    title="Share Audio"
                  >
                    <FiShare2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {lyric.showLyrics && (
              <div
                className="lyrics-text"
                dangerouslySetInnerHTML={{
                  __html: lyric.lyrics.replace(/<\/?[^>]+(>|$)/g, ""),
                }}
              />
            )}

            <p className="views">Views: {lyric.views || 0}</p>
          </div>
        ))}
      </div>
      <Footer />

      <style jsx>{`
        .lyrics-page-container {
          max-width: 700px;
          margin: 70px auto;
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
          color: #111827;
        }

        .username {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 15px;
        }

        .audio-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin: 15px 0;
        }

        audio {
          width: 80%;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .download-btn,
        .share-btn {
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

        .download-btn:hover,
        .share-btn:hover {
          background: #1e40af;
        }

        .lyrics-text {
          font-size: 1.1rem;
          color: #1f2937;
          line-height: 1.6;
          white-space: pre-wrap;
          text-align: center;
          margin-top: 15px;
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

// SSR: fetch lyrics (all or only shared audio)
export async function getServerSideProps(context) {
  const { id } = context.query;
  let lyricsData = [];
  let sharedId = id || null;

  try {
    if (id) {
      const docRef = doc(db, "lyrics", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        lyricsData = [{ id: docSnap.id, ...docSnap.data() }];
      }
    } else {
      const snapshot = await getDocs(collection(db, "lyrics"));
      lyricsData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
  }

  if (!lyricsData.length) {
    return { notFound: true };
  }

  return {
    props: {
      lyricsDataServer: lyricsData,
      sharedId,
    },
  };
}
