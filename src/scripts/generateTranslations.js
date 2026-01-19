const fs = require("fs");
const fetch = require("node-fetch");

const API_KEY = "cf5e91d5-f80f-485d-ac2d-a0e588525499:fx"; // ⚠️ hardcoded
const TARGET_LANGS = ["EN", "FR", "SW", "DE", "RW"];

const source = require("../locales/source");

// Translate function (auto-detect)
async function translate(text, targetLang) {
  // niba target ari RW, dusubiza text uko iri
  if (targetLang === "RW") return text;
  
  const res = await fetch("https://api.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      target_lang: targetLang,
    }),
  });
  
  const data = await res.json();
  return data.translations[0].text;
}

async function generate() {
  for (const lang of TARGET_LANGS) {
    const result = {};
    
    for (const key of Object.keys(source)) {
      console.log(`🔁 [${key}] → ${lang}`);
      result[key] = await translate(source[key], lang);
    }
    
    const fileContent = `export default ${JSON.stringify(
      result,
      null,
      2
    )};`;
    
    fs.writeFileSync(`locales/${lang.toLowerCase()}.js`, fileContent);
  }
  
  console.log("✅ Translations zakozwe neza (auto-detect)");
}

generate();
