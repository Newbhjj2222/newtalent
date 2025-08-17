import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // fata db iva muri firebase.js

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
      <div className="text-center p-4 text-purple-700 font-semibold animate-pulse">
        Loading verse...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 rounded-3xl shadow-2xl 
                    bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600
                    text-white text-center relative overflow-hidden
                    transform transition-all duration-500 hover:scale-105">
      {/* Decorative overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-3xl pointer-events-none"></div>

      {verse ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
            {verse.verse}
          </h2>
          <p className="mt-3 text-lg md:text-xl italic drop-shadow-md">
            “{verse.text}”
          </p>
        </>
      ) : (
        <p className="text-lg">No verse found.</p>
      )}

      {/* Animated bottom border */}
      <div className="mt-4 h-1 w-16 mx-auto bg-white rounded-full animate-pulse"></div>
    </div>
  );
};

export default Bible;
