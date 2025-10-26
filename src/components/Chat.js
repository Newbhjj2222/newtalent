"use client";
import { useState, useEffect } from "react";
import styles from "./Chat.module.css";
import { FaWhatsapp, FaPaperPlane } from "react-icons/fa";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteName(window.location.hostname);
    }
  }, []);

  const handleSend = () => {
    if (message.trim() !== "") {
      const fullMessage = `Ubutumwa buvuye kuri ${siteName}: ${message}`;
      const encodedMessage = encodeURIComponent(fullMessage);
      const phoneNumber = "+250722319367";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
      setMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>💬 Vugana natwe kuri WhatsApp</div>
          <textarea
            className={styles.chatInput}
            placeholder="Andika ubutumwa bwawe hano..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className={styles.sendButton} onClick={handleSend}>
            <FaPaperPlane size={16} />
            Ohereza
          </button>
        </div>
      )}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Twandikire kuri WhatsApp"
      >
        <FaWhatsapp size={28} />
      </button>
    </div>
  );
}
