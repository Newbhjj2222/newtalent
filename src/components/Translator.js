import { useState } from "react";

const languages = [
  { code: "rw", name: "Kinyarwanda" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "sw", name: "Kiswahili" },
];

export default function Translator() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("rw");

  const handleTranslate = async () => {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });

    const data = await res.json();
    setTranslated(data.translatedText || "Translation error");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">🌍 Translator</h1>

      <textarea
        className="w-full p-2 border rounded"
        rows="4"
        placeholder="Andika hano..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex space-x-2">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="p-2 border rounded"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <span className="p-2">➡️</span>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="p-2 border rounded"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Hindura
      </button>

      {translated && (
        <div className="p-2 border rounded bg-gray-50">
          <strong>Result:</strong>
          <p>{translated}</p>
        </div>
      )}
    </div>
  );
}
