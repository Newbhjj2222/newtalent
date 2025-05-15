import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./balance.css";

const Balance = () => {
  const [formData, setFormData] = useState({
    names: "",
    phone: "",
    plan: "",
    amount: "",
    paymentMethod: "", // uburyo bwo kwishyura
  });

  const [nes, setNes] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;
    const unsub = onSnapshot(doc(db, "depositers", username), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNes(data.nes || 0);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;

    setSubmitting(true);

    const docRef = doc(db, "depositers", username);
    const docSnap = await getDoc(docRef);
    const existingData = docSnap.exists() ? docSnap.data() : {};

    await setDoc(docRef, {
      ...existingData,
      ...formData,
      nes: existingData.nes || 0,
    });

    setMessage(
      "Wohereje ubusabe bwo guhabwa NeS points mushaka kugura. Mwishyure kuri 0780786300 (MTN) cyangwa 0722319367 (Airtel)."
    );

    setTimeout(() => {
      navigate("/home");
    }, 30000);
  };

  return (
    <div className="form-container">
      <div className="nes-card">Your
        NeS Points: <span>{nes}</span>
      </div>

      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit}>
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
          <option value="Daily">Daily - 250 RWF</option>
          <option value="Weekly">Weekly - 500 RWF</option>
          <option value="Monthly">Monthly - 1000 RWF</option>
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
  );
};

export default Balance;
