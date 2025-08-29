'use client';

import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../components/Balance.module.css";

export default function Balance() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [nes, setNes] = useState(0);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    names: "",
    phone: "",
    plan: "",
    paymentMethod: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fata username muri localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login"); // niba nta username, ohereza login
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  // Realtime listener kuri Firestore
  useEffect(() => {
    if (!username) return;

    const unsub = onSnapshot(doc(db, "depositers", username), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNes(data.nes || 0);
      } else {
        setNes(0);
      }
    });

    return () => unsub();
  }, [username]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(
      "Wohereje ubusabe bwo guhabwa NeS points. Mwishyure kuri 0780786300 (MTN) cyangwa 0722319367 (Airtel)."
    );
    setTimeout(() => {
      router.push("/home");
    }, 30000);
  };

  if (!username) {
    return <div className={styles.noUser}>Ntutangiye session. Injira mbere yo gukoresha Balance.</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.formContainer}>
        <div className={styles.nesCard}>
          Your NeS Points: <span>{nes}</span>
        </div>

        {message && <div className={styles.successMessage}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.balanceForm}>
          <input
            type="text"
            name="names"
            placeholder="Andika amazina yawe abaruye kuri nimero ukoresha wishyura."
            value={formData.names}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Andika nimero ya telefone ukoresha wishyura"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            required
          >
            <option value="">-- Hitamo Plan --</option>
            <option value="onestory">NeS 1 - 20 RWF</option>
            <option value="Local">NeS 7 - 100 RWF</option>
            <option value="Daily">Umunsi NeS 10 - 150 RWF</option>
            <option value="weakly">Icyumweru NeS 15 - 200 RWF</option>
            <option value="limited">Icyumweru NeS 25 - 300 RWF</option>
            <option value="monthly">Ukwezi NeS 60 - 600 RWF</option>
            <option value="bestreader">Ukwezi kose - 1200 RWF</option>
          </select>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">-- Hitamo Uburyo bwo Kwishyura --</option>
            <option value="MTN">MTN Mobile Money</option>
            <option value="Airtel">Airtel Money</option>
          </select>

          <button type="submit" disabled={submitting}>
            {submitting ? "Kohereza..." : "Ohereza"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
