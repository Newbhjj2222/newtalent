"use client";
import { useEffect, useState } from "react";

export default function PaymentResult({ searchParams }) {
  const [status, setStatus] = useState("loading"); // loading / success / fail
  const [msg, setMsg] = useState("");
  const depositId = searchParams?.depositId; // depositId iva kuri returnUrl

  useEffect(() => {
    if (!depositId) {
      setStatus("fail");
      setMsg("No depositId provided in URL");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/check-deposit?depositId=${depositId}`);
        const data = await res.json();

        if (!res.ok) {
          let errorMsg = typeof data.error === "object" ? JSON.stringify(data.error) : data.error;
          setStatus("fail");
          setMsg(errorMsg || "Failed to check deposit status");
          return;
        }

        if (data.status === "SUCCESS") {
          setStatus("success");
          setMsg(`Payment successful! You bought ${data.nesPoints} NES Points.`);
        } else {
          setStatus("fail");
          setMsg(`Payment not successful. Status: ${data.status}`);
        }
      } catch (err) {
        setStatus("fail");
        setMsg("Network error: " + err.message);
      }
    };

    checkStatus();
  }, [depositId]);

  return (
    <div style={{ maxWidth:400, margin:"50px auto", padding:20, border:"1px solid #ccc", borderRadius:10, textAlign:"center" }}>
      <h2>Payment Result</h2>
      {status === "loading" && <p>Checking payment status...</p>}
      {status !== "loading" && <p>{msg}</p>}
    </div>
  );
}
