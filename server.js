const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aidly AI Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message.toLowerCase();

  let reply = "زه Aidly AI یم 🤖";

  if (message.includes("hello")) {
    reply = "Hello! How can I help you?";
  } else if (message.includes("how are you")) {
    reply = "I'm fine 😊 What about you?";
  } else if (message.includes("name")) {
    reply = "I am Aidly AI 🤖";
  } else {
    reply = "Interesting 😄 Tell me more!";
  }

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
