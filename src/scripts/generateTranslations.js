import fs from "fs";
import path from "path";
import * as deepl from "deepl";
import source from "../locales/source.js";

// 🔑 Shyiramo API key yawe
const authKey = "cf5e91d5-f80f-485d-ac2d-a0e588525499:fx";
const deeplClient = new deepl.DeepLClient(authKey);

// Izi ni languages ushaka
const targetLangs = ["EN", "FR", "SW", "DE", "RW"];

async function translateText(text, targetLang) {
  try {
    // RW original, subiza text uko iri
    if (targetLang === "RW") return text;

    const result = await deeplClient.translateText(text, null, targetLang);
    return result.text || text; // safety check

  } catch (err) {
    console.error(`❌ Translation failed for: "${text}" →`, err);
    return text;
  }
}

async function generate() {
  const outDir = path.join("src", "locales");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const lang of targetLangs) {
    const translated = {};
    for (const key in source) {
      console.log(`🔁 Translating [${key}] → ${lang}`);
      translated[key] = await translateText(source[key], lang);
    }

    // Save as JSON
    fs.writeFileSync(
      path.join(outDir, `${lang.toLowerCase()}.json`),
      JSON.stringify(translated, null, 2)
    );

    console.log(`✅ ${lang} translations done`);
  }
}

generate();
