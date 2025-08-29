export default async function handler(req, res) {
  try {
    // code yawe
    res.status(200).json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
