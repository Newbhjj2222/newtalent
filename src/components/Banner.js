import styles from "./Banner.module.css";

const Banner = ({ screenTexts }) => {
  return (
    <div className={styles.banner}>
      <div className={styles.scrollContainer}>
        <div className={styles.scrollText}>
          {screenTexts.map((text, index) => (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
