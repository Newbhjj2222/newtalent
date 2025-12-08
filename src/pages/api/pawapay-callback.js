export const config = {
  api: {
    bodyParser: false, // PawaPay sometimes sends raw JSON
  },
};

export default async function handler(req, res) {
  try {
    // Read raw body
    const rawBody = await readRawBody(req);

    // Try to parse JSON if possible
    let parsedBody = null;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (e) {
      parsedBody = rawBody; // keep raw if not JSON
    }

    // Log everything
    console.log("----- LIVE CALLBACK -----");
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);
    console.log("Body:", parsedBody);
    console.log("-------------------------");

    // IMPORTANT: Always respond 200 so PawaPay does NOT retry
    return res.status(200).json({
      received: true,
      method: req.method,
      headers: req.headers,
      body: parsedBody,
    });
  } catch (error) {
    console.error("Callback Error:", error);
    return res.status(200).json({
      received: true,
      error: error.toString(),
    });
  }
}

// Function to read raw request body
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
