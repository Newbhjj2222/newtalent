// pages/success.js
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Soma payload muri URL
      const params = new URLSearchParams(window.location.search);
      const payloadParam = params.get("payload");

      if (!payloadParam) {
        setError("No payload received");
        return;
      }

      // Decode URL → JSON
      const decoded = decodeURIComponent(payloadParam);
      const parsedData = JSON.parse(decoded);

      setData(parsedData);
    } catch (err) {
      console.error("Payload parse error:", err);
      setError("Invalid payload format");
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Payment Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Processing payment...</h1>
      </div>
    );
  }

  // Aha dufata data yose uko iri
  const transaction = data?.data?.result?.[0];

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Payment Status</h1>

      <p>
        <strong>Status:</strong> {data.status}
      </p>

      {transaction && (
        <>
          <hr />

          <p>
            <strong>Deposit ID:</strong> {transaction.depositId}
          </p>
          <p>
            <strong>Amount:</strong>{" "}
            {transaction.depositedAmount} {transaction.currency}
          </p>
          <p>
            <strong>Customer ID:</strong>{" "}
            {transaction.metadata?.customerId}
          </p>
          <p>
            <strong>Order ID:</strong>{" "}
            {transaction.metadata?.orderId}
          </p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {transaction.correspondent}
          </p>
        </>
      )}

      <hr />

      <h3>Raw Payload (Full Data)</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: 15,
          borderRadius: 5,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
