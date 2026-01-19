const DEEPL_API_KEY = "cf5e91d5-f80f-485d-ac2d-a0e588525499:fx"; // ⚠️ hardcoded

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, target_lang } = req.body;

  try {
    const response = await fetch("https://api.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        target_lang,
      }),
    });

    const data = await response.json();

    res.status(200).json({
      translated: data.translations[0].text,
    });
  } catch (e) {
    res.status(500).json({ error: "Translation failed" });
  }
}
