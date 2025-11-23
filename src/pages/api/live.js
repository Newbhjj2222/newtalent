export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": "af2aa3a86b48c0b3e4ea990982a03c8138256a2b53b7c9a672baf1fc85770461",
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
