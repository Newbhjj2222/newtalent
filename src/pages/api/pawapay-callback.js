export const config = {
  api: {
    bodyParser: true, // PawaPay JSON body
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({}); // GET / browser
    }

    const event = req.body;

    console.log("----- PAWAPAY CALLBACK -----");
    console.log(event);
    console.log("----------------------------");

    // 🔥 Return exactly all fields sent by PawaPay
    return res.status(200).json(event);

  } catch (error) {
    console.error("Callback error:", error);
    return res.status(200).json({});
  }
}
