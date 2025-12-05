import axios from "axios";

const PAWAPAY_TOKEN = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIwMTgiLCJtYXYiOiIxIiwiZXhwIjoyMDgwMzgxOTU2LCJpYXQiOjE3NjQ4NDkxNTYsInBtIjoiREFGLFBBRiIsImp0aSI6ImI0YWM3MzQ4LWYyNDEtNDVjNy04MmQ1LTI0ZTgwZjVlZmJhNSJ9.8qxWc0Aph9QhrhKcfPXvaFe5l_RzSPjOWsCGFr6W88QpMmcyWwqm7W7M83-UCE4OrM8UQZOncdnx-t1MACbObA";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

  const { depositId } = req.query;
  if (!depositId) return res.status(400).json({ error: "Missing parameter: depositId" });

  try {
    const response = await axios.get(`https://api.pawapay.io/v2/deposits/${depositId}`, {
      headers: { Authorization: `Bearer ${PAWAPAY_TOKEN}` }
    });

    // response.data. status, nesPoints, username etc bisa kuba muri metadata
    const depositData = response.data;
    const metadata = depositData.metadata || [];
    const nesPointsMeta = metadata.find(m => m.nesPoints)?.nesPoints || "";
    const usernameMeta = metadata.find(m => m.username)?.username || "";

    res.status(200).json({
      status: depositData.status,
      nesPoints: nesPointsMeta,
      username: usernameMeta
    });
  } catch (err) {
    console.error("Check deposit error:", err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
}
