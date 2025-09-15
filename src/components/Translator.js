import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function TranslatedText({ text, translationKey }) {
  const { lang } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (lang === "en") {
      setTranslated(text);
      return;
    }

    // fetch translation only if lang != English
    const fetchTranslation = async () => {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: lang }),
      });
      const data = await res.json();
      setTranslated(data.translatedText);
    };

    fetchTranslation();
  }, [lang, text]);

  return <>{translated}</>;
}
