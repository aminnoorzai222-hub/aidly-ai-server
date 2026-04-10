const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch("https://api.affiliateplus.xyz/api/chatbot?message=" + message);
    const data = await response.json();

    res.json({ reply: data.message });
  } catch (error) {
    res.json({ reply: "AI error" });
  }
});

app.listen(3000, () => console.log("Server running"));
