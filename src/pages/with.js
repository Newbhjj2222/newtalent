import { useState } from 'react';

export default function WithdrawPage() {
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
        const errMsg = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        setMessage(`❌ ${errMsg}`);
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20, border: '1px solid #ddd', borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Withdraw Funds</h1>
      <form onSubmit={handleWithdraw}>
        <label>
          Amount (RWF):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '100%', padding: 10, margin: '10px 0', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>

        <label>
          Recipient (Phone or Bank):
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            style={{ width: '100%', padding: 10, margin: '10px 0', borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>

        <button
          type="submit"
          style={{ width: '100%', padding: 12, backgroundColor: '#38a169', color: '#fff', fontWeight: 'bold', borderRadius: 8, cursor: 'pointer', marginTop: 10 }}
        >
          Withdraw
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 15, whiteSpace: 'pre-wrap', textAlign: 'center', fontWeight: 'bold', color: message.startsWith('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}
