"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { db } from "../components/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../components/Balance.module.css";

export default function Pay() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [nes, setNes] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    plan: "",
    phone: "",
  });

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login");
      return;
    }
    setUsername(storedUsername);
  }, [router]);

  // Firestore realtime NeS
  useEffect(() => {
    if (!username) return;
    const unsub = onSnapshot(doc(db, "depositers", username), (docSnap) => {
      if (docSnap.exists()) setNes(docSnap.data().nes || 0);
      else setNes(0);
    });
    return () => unsub();
  }, [username]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form → call API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await axios.post("/api/pawapay-deposit", {
        username,
        plan: formData.plan,
        phone: formData.phone,
      });

      console.log("PawaPay response:", response.data);

      // Check if PawaPay returned an error message
      if (response.data && response.data.error) {
        setMessage(`Payment failed: ${response.data.error}`);
      } else if (response.data && response.data.message) {
        setMessage(response.data.message);
      } else {
        setMessage("Payment initiated! Check your mobile money app.");
      }

    } catch (err) {
      console.error("Payment error:", err);

      // Show PawaPay error if available
      if (err.response && err.response.data) {
        setMessage(`Payment failed: ${JSON.stringify(err.response.data)}`);
      } else {
        setMessage("Payment failed: Unknown error. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!username) return <div>Injira mbere yo gukomeza.</div>;

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
            type="tel"
            name="phone"
            placeholder="Phone number (Rwanda)"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select name="plan" value={formData.plan} onChange={handleChange} required>
            <option value="">--Select Plan--</option>
            <option value="onestory">NeS 1 - 10 RWF</option>
            <option value="Daily">NeS 15/day - 150 RWF</option>
            <option value="weekly">NeS 25/week - 250 RWF</option>
            <option value="monthly">NeS 60/month - 500 RWF</option>
            <option value="bestreader">BestReader - 100 RWF</option>
          </select>

          <button type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Pay with PawaPay"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
