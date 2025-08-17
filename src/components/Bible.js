import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";  // ✅ fata db iva muri firebase.js

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

          // Gutoranya verse ya buri munsi hashingiwe ku itariki
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
    return <div className="text-center p-4">Loading verse...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
      {verse ? (
        <>
          <h2 className="text-lg font-semibold">{verse.verse}</h2>
          <p className="mt-2 text-base italic">“{verse.text}”</p>
        </>
      ) : (
        <p>No verse found.</p>
      )}
    </div>
  );
};

export default Bible;
