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

  let reply = "Interesting 😄 Tell me more!";

  if (message.includes("hello") || message.includes("hi")) {
    reply = "Hello! 😊 How can I help you?";
  }

  else if (message.includes("how are you")) {
    reply = "I'm fine 😄 What about you?";
  }

  else if (message.includes("name")) {
    reply = "I am Aidly AI 🤖";
  }

  else if (message.includes("bye")) {
    reply = "Goodbye! 👋 Have a nice day!";
  }

  else if (message.includes("thanks") || message.includes("thank you")) {
    reply = "You're welcome 😊";
  }

  else if (message.includes("who are you")) {
    reply = "I am your AI assistant 🤖";
  }

  else if (message.includes("what can you do")) {
    reply = "I can chat with you and answer simple questions 😄";
  }

  else if (message.includes("time")) {
    reply = "I can't check real time yet ⏰ but soon!";
  }

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
