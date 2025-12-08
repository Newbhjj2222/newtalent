export const config = {
  api: {
    bodyParser: true, // PawaPay ituma JSON body
  },
};

export default async function handler(req, res) {
  try {
    console.log("----- PAWAPAY CALLBACK -----");
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("----------------------------");

    // PawaPay always sends POST
    if (req.method !== "POST") {
      return res.status(200).json({ message: "Callback active" });
    }

    const event = req.body;

    // Extract required fields
    const depositId =
      event.depositId ||
      event.id ||
      event.reference ||
      null;

    const amount =
      event.amount ||
      event.value ||
      event.transactionAmount ||
      null;

    const currency =
      event.currency ||
      event.currencyCode ||
      null;

    const status =
      event.status ||
      event.state ||
      event.paymentStatus ||
      null;

    // Ensure we return valid data always
    return res.status(200).json({
      message: "OK",
      depositId: depositId,
      amount: amount,
      currency: currency,
      status: status,
      raw: event, // Ibi bigufasha kubona EVERY field PawaPay yohereje
    });

  } catch (error) {
    console.error("Callback error:", error);
    return res.status(200).json({ message: "OK" }); // PawaPay idakeneye error
  }
}
