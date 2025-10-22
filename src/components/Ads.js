"use client";
import { useEffect } from "react";

export default function Ads() {
  useEffect(() => {
    // Redirect nyambere: kunyura kuri link ya monetage (Otieu)
    const otieuLink = "https://otieu.com/4/10077805";
    const finalDestination = "https://www.newtalentsg.co.rw";

    // Funguza link ya Otieu muri tab nshya
    window.open(otieuLink, "_blank");

    // Hanyuma nyuma ya 5 seconds, umujyane kuri destination yawe
    const timer = setTimeout(() => {
      window.location.href = finalDestination;
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold mb-4">⏳ Utegereze gato...</h1>
      <p className="text-gray-600 mb-2">
        Turagutembereza ku mupangabuhamya mbere yo kugera kuri website yawe.
      </p>
      <p className="text-sm text-gray-500">
        Uzahita woherezwa kuri <strong>NewTalentsG</strong> mu masegonda make.
      </p>
    </div>
  );
}
