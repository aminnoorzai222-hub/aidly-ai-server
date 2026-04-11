JavaScript
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aidly AI Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.json({ reply: "No message received" });
  }

  try {
    const response = await fetch(
      "https://api.affiliateplus.xyz/api/chatbot?message=" + encodeURIComponent(message)
    );

    const data = await response.json();

    res.json({ reply: data.message || "No response" });

  } catch (error) {
    console.log(error);
    res.json({ reply: "Server error ❌" });
  }
});

app.listen(3000, () => console.log("Server running"));
