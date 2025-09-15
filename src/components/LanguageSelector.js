import { useLanguage } from "./LanguageProvider";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <select value={lang} onChange={(e) => setLang(e.target.value)}>
      <option value="en">English</option>
      <option value="rw">Kinyarwanda</option>
      <option value="fr">Français</option>
      <option value="sw">Kiswahili</option>
    </select>
  );
}
