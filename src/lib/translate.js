export async function translateText(text, lang) {
  if (lang === "EN") return text;

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      target_lang: lang,
    }),
  });

  const data = await res.json();
  return data.translated;
}
