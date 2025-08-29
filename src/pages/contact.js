// pages/contact.js
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styles from "../components/Contact.module.css"; 
import { db } from '../components/firebase';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  // Form states
  const [join, setJoin] = useState({ name: "", email: "", phone: "", whatsapp: "" });
  const [message, setMessage] = useState({ name: "", email: "", content: "" });
  const [ads, setAds] = useState({ name: "", email: "", ad: "" });

  const handleChange = (setter) => (e) => {
    setter((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e, data, path, reset) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp(),
      });
      alert("Submitted successfully!");
      reset();
    } catch (error) {
      alert("Submission failed: " + error.message);
    }
  };

  return (
    <>
    <Header />
    <div className={styles.contactContainer}>
      {/* JOIN OUR TEAM */}
      <form
        className={styles.contactForm}
        onSubmit={(e) =>
          handleSubmit(e, join, "join", () =>
            setJoin({ name: "", email: "", phone: "", whatsapp: "" })
          )
        }
      >
        <h2>JOIN OUR TEAM</h2>
        <input type="text" id="name" value={join.name} onChange={handleChange(setJoin)} placeholder="Your name..." required />
        <input type="email" id="email" value={join.email} onChange={handleChange(setJoin)} placeholder="Your Email..." required />
        <input type="number" id="phone" value={join.phone} onChange={handleChange(setJoin)} placeholder="Your phone number..." />
        <input type="number" id="whatsapp" value={join.whatsapp} onChange={handleChange(setJoin)} placeholder="Your WhatsApp number..." required />
        <button type="submit">Join</button>
      </form>

      {/* SEND A MESSAGE */}
      <form
        className={styles.contactForm}
        onSubmit={(e) =>
          handleSubmit(e, message, "messages", () =>
            setMessage({ name: "", email: "", content: "" })
          )
        }
      >
        <h2>SEND A MESSAGE</h2>
        <input type="text" id="name" value={message.name} onChange={handleChange(setMessage)} placeholder="Your name..." required />
        <input type="email" id="email" value={message.email} onChange={handleChange(setMessage)} placeholder="Your Email..." required />
        <textarea id="content" value={message.content} onChange={handleChange(setMessage)} placeholder="Type your message..." required />
        <button type="submit">Send Message</button>
      </form>

      {/* PLACE AN AD */}
      <form
        className={styles.contactForm}
        onSubmit={(e) =>
          handleSubmit(e, ads, "ads", () =>
            setAds({ name: "", email: "", ad: "" })
          )
        }
      >
        <h2>PLACE AN AD</h2>
        <input type="text" id="name" value={ads.name} onChange={handleChange(setAds)} placeholder="Your name..." required />
        <input type="email" id="email" value={ads.email} onChange={handleChange(setAds)} placeholder="Your Email..." required />
        <textarea id="ad" value={ads.ad} onChange={handleChange(setAds)} placeholder="Write your advertisement..." required />
        <button type="submit">Place Ad</button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default Contact;
