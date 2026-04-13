const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aidly AI Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.json({ reply: "No message" });
  }

  try {
    const response = await fetch(
      "https://api.affiliateplus.xyz/api/chatbot?message=" + encodeURIComponent(message)
    );

    const data = await response.json();

    res.json({ reply: data.message });

  } catch (err) {
    res.json({ reply: "Error ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
