// pages/api/callback.js
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false, // kugirango tubashe kwakira raw body yose
  },
};

export default async function handler(req, res) {
  try {
    // Akira raw body yose
    const rawBody = await buffer(req);

    let payload;
    try {
      payload = JSON.parse(rawBody.toString());
    } catch (err) {
      // Niba atari JSON, shyiramo raw string
      payload = rawBody.toString();
    }

    console.log(`Callback Received [${req.method}]:`, payload);

    // Hano ushobora:
    // - Gushyira payload muri database
    // - Kumenyesha admin
    // - Gukora logging

    // Subiza response
    return res.status(200).json({
      message: `Callback received successfully via ${req.method}`,
      receivedPayload: payload,
    });
  } catch (error) {
    console.error('Callback error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
