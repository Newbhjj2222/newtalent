import React from "react";
import styles from "./pin.module.css";
import { FaRegSnowflake, FaGift, FaStar } from "react-icons/fa";

const Pin = () => {
  return (
    <div className={styles.pin}>
      <div className={styles.icons}>
        <FaRegSnowflake />
        <FaGift />
        <FaStar />
      </div>

      <p className={styles.text}>
        Tukwifurije <span>Noheri nziza</span> n'
        <span> umwaka mushya muhire wa 2026</span>. Uzatunge kandi uhirwe.
      </p>
    </div>
  );
};

export default Pin;
