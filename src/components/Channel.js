"use client";
import React from "react";
import styles from "./channel.module.css";
import { FaWhatsapp } from "react-icons/fa";

const Channel = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FaWhatsapp className={styles.iconLarge} />

        <div className={styles.textBox}>
          <h2 className={styles.title}>
            Dukurikirane kuri <span>WhatsApp Channel</span>
          </h2>
          <p className={styles.subtitle}>
            Ujye ubona inkuru nshya, amakuru, inama, n'ubumenyi kugihe buri munsi.
          </p>
        </div>

        <a
          href="https://whatsapp.com/channel/0029Vb24TMfKLaHgsBDVUw3N"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
        >
          <FaWhatsapp className={styles.btnIcon} />
          Dukurikirane
        </a>
      </div>
    </div>
  );
};

export default Channel;
