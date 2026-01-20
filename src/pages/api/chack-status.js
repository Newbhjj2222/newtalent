import axios from "axios";

const PAWAPAY_TOKEN =
  "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

// Replace na DB
const deposits = {};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const { depositId } = req.query;
  if (!depositId) return res.status(400).json({ error: "Missing depositId" });

  try {
    const response = await axios.get(
      `https://api.pawapay.io/v2/deposits/${depositId}`,
      { headers: { Authorization: `Bearer ${PAWAPAY_TOKEN}` } }
    );

    const status = response.data.status; // SUCCESS / PENDING / FAILED

    // Update local log
    if (deposits[depositId]) deposits[depositId].status = status;

    return res.status(200).json({ status, deposit: deposits[depositId] || null });
  } catch (err) {
    console.error("Check status error:", err.response?.data || err.message);
    return res.status(err.response?.status || 400).json({ error: err.response?.data || { message: err.message } });
  }
}
