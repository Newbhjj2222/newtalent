"use client";
import { useState } from "react";

export default function DepositStatusPage() {
  const [depositId, setDepositId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/check-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Error checking deposit");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Check Deposit Status</h1>
      <input
        type="text"
        placeholder="Enter Deposit ID"
        value={depositId}
        onChange={(e) => setDepositId(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleCheck}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Status"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <pre className="bg-gray-100 p-4 mt-4 rounded overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
