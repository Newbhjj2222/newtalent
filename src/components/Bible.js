import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const Bible = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const bibleRef = collection(db, "bible");
        const snapshot = await getDocs(bibleRef);

        if (!snapshot.empty) {
          const verses = snapshot.docs.map((doc) => doc.data());
          const today = new Date();
          const index = today.getDate() % verses.length;
          setVerse(verses[index]);
        } else {
          setVerse({
            verse: "Zaburi 29:2",
            text: "Mwubahe Uwiteka, kandi mumuhimbaze.",
          });
        }
      } catch (error) {
        console.error("Error fetching verse:", error);
        setVerse({
          verse: "Zaburi 29:2",
          text: "Mwubahe Uwiteka, kandi mumuhimbaze.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "1rem",
          color: "#333",
        }}
      >
        Loading verse...
      </div>
    );
  }

  if (!verse) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "1rem",
          color: "#f00",
        }}
      >
        No verse found.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #7b2ff7, #2c3e50)",
        textAlign: "center",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        maxWidth: "600px",
        margin: "2rem auto",
        color: "#fff",
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#ff6b6b",
          textShadow: "2px 2px 4px #000",
          marginBottom: "0.5rem",
          animation: "slideDown 0.8s ease-out",
        }}
      >
        {verse.verse}
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          fontStyle: "italic",
          fontWeight: 600,
          color: "#a3f7b5",
          marginTop: "1rem",
          textShadow: "1px 1px 2px #000",
          animation: "fadeIn 1.2s ease-in",
        }}
      >
        “{verse.text}”
      </p>

      {/* Animations keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Bible;
