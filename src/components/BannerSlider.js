// components/BannerSlider.jsx
import styles from "./BannerSlider.module.css";

export default function BannerSlider() {
  return (
    <div className={styles.banner}>
      <div className={styles.overlay}>
        <div className={styles.slider}>
          <span>Inkuru z'urukundo zisomwa buri munsi ❤️</span>
          <span>Inkuru zidasanzwe z’Abanyarwanda ✍️</span>
          <span>Soma inkuru wishyure make cyane 💰</span>
          <span>New Talents Stories Group 📚</span>
        </div>
      </div>
    </div>
  );
}
