import axios from "axios";
import { useState } from "react";

export default function Pay() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState(null);

  const sendPayout = async () => {
    try {
      const res = await axios.post("/api/payout", {
        phoneNumber: phone,
        amount,
        currency: "RWF",
        country: "RWA",
        userId: "USER12345",
      });

      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || err);
    }
  };

  return (
    <div>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={sendPayout}>Send Payout</button>

      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
