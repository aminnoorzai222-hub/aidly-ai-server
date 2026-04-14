const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const HF_TOKEN = "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";

app.get("/", (req, res) => {
  res.send("Aidly AI Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + HF_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: message
        })
      }
    );

    const data = await response.json();

    let reply = "AI not ready 😔";

    if (data && data.generated_text) {
      reply = data.generated_text;
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
