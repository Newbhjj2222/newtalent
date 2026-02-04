// pages/api/callback.js
export const runtime = 'edge';
export default async function handler(req, res) {
  try {
    // Ushobora kwakira POST/PUT/GET/DELETE n'ibindi byose
    const method = req.method;

    // Body izaba JSON niba uri gukoresha POST cyangwa PUT
    const payload = req.body;

    console.log(`Callback received via ${method}:`, payload);

    // Hano wakora:
    // - Gushyira payload muri database
    // - Kumenyesha admin
    // - Logging y’amanota

    return res.status(200).json({
      message: `Callback received successfully via ${method}`,
      receivedPayload: payload,
    });
  } catch (error) {
    console.error('Callback error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
