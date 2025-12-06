// components/WithdrawForm.js
import { useState } from 'react';

export default function WithdrawForm() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recipient })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
      } else {
        // Error nyirizina, ikoze stringify niba ari object
        const errMsg = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        setMessage(`❌ ${errMsg}`);
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleWithdraw} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Withdraw Funds</h2>
      <input
        type="number"
        placeholder="Amount (RWF)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <input
        type="text"
        placeholder="Recipient (Phone or Bank)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#38a169', color: '#fff' }}>
        Withdraw
      </button>
      {message && <p style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>{message}</p>}
    </form>
  );
}
