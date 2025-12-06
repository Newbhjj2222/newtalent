// pages/api/withdraw.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, recipient } = req.body;

  if (!amount || !recipient) {
    return res.status(400).json({ error: 'Amount and recipient are required' });
  }

  // API key watanze
  const PAWAPAY_API_KEY = 'eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA';

  try {
    const response = await axios.post('https://api.pawapay.com/withdraw', {
      apiKey: PAWAPAY_API_KEY,
      amount,
      recipient,
      currency: 'RWF'
    });

    return res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: response.data
    });
  } catch (err) {
    console.error('Withdrawal error:', err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
}
