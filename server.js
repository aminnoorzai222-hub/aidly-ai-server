JavaScript
const express = require("express");
const fetch = require("node-fetch");

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
      "https://api.affiliateplus.xyz/api/chatbot?message=" + encodeURIComponent(message) + "&owner=Aidly&botname=Aidly"
    );

    const data = await response.json();

    res.json({ reply: data.message || "No AI response" });

  } catch (error) {
    console.log(error);
    res.json({ reply: "Server AI error ❌" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
