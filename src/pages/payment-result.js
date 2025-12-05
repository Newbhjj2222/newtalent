"use client";

import { useEffect, useState } from "react";
import { db } from "../components/firebase"; // Firestore import
import { doc, getDoc } from "firebase/firestore";

export default function PaymentResult() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const checkPayment = async () => {
      try {
        // Fata username muri localStorage
        const username = localStorage.getItem("username");
        if (!username) {
          setMsg("Username not found in localStorage.");
          setLoading(false);
          return;
        }

        // Fata doc ya depositers
        const userRef = doc(db, "depositers", username);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setMsg("No deposit record found for this user.");
          setLoading(false);
          return;
        }

        const data = userSnap.data();
        const nesPoints = data.nes;

        if (!nesPoints || nesPoints === 0) {
          setMsg("Payment not completed yet. NES Points not added.");
        } else {
          setMsg(`Payment successful! You have received ${nesPoints} NES Points.`);
        }

        setLoading(false);

      } catch (err) {
        console.error("Error checking payment:", err);
        setMsg("Error checking payment: " + err.message);
        setLoading(false);
      }
    };

    checkPayment();
  }, []);

  return (
    <div style={{ maxWidth:400, margin:"50px auto", padding:20, border:"1px solid #ccc", borderRadius:10 }}>
      <h2 style={{ textAlign:"center", marginBottom:20 }}>Payment Result</h2>
      {loading ? <p>Checking your payment...</p> : <p>{msg}</p>}
    </div>
  );
}
