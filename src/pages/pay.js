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
    provider: "MTN_MOBILE_MONEY",
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) router.push("/login");
    else setUsername(storedUsername);
  }, [router]);

  useEffect(() => {
    if (!username) return;
    const unsub = onSnapshot(doc(db, "depositers", username), (docSnap) => {
      if (docSnap.exists()) setNes(docSnap.data().nes || 0);
      else setNes(0);
    });
    return () => unsub();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    if (!formData.provider) {
      setMessage("Hitamo Mobile Money provider");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/pawapay-deposit", formData);

      if (response.data?.error) {
        const errMsg = typeof response.data.error === 'object' 
          ? JSON.stringify(response.data.error) 
          : response.data.error;
        setMessage(`Payment failed: ${errMsg}`);
      } else {
        setMessage("Payment initiated! Check your mobile money app.");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      let userMessage = "Payment failed";
      if(err.response?.data){
        userMessage = typeof err.response.data === 'object'
          ? err.response.data.message || JSON.stringify(err.response.data)
          : err.response.data;
      } else {
        userMessage = err.message;
      }
      setMessage(`Payment failed: ${userMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!username) return <div>Injira mbere yo gukomeza.</div>;

  return (
    <>
      <Header />
      <div className={styles.formContainer}>
        <div className={styles.nesCard}>Your NeS Points: <span>{nes}</span></div>

        {message && <div className={styles.successMessage}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.balanceForm}>
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
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
            <option value="bestreader">BestReader - 800 RWF</option>
          </select>

          <select name="provider" value={formData.provider} onChange={handleChange} required>
            <option value="">--Select Mobile Money Provider--</option>
            <option value="MTN_MOBILE_MONEY">MTN Rwanda</option>
            <option value="AIRTEL_MONEY">Airtel Rwanda</option>
            <option value="MTN_MOMO_UG">MTN Uganda</option>
            <option value="AIRTEL_MONEY_UG">Airtel Uganda</option>
            <option value="MTN_MOMO_ZMB">MTN Zambia</option>
            <option value="AIRTEL_MONEY_ZMB">Airtel Zambia</option>
            <option value="M-PESA_KE">M-PESA Kenya</option>
            <option value="AIRTEL_MONEY_KE">Airtel Kenya</option>
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
