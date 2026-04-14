const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const HF_TOKEN = "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"; // 

app.get("/", (req, res) => {
  res.send("Aidly AI Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
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

    res.json({
      reply: data.generated_text || "AI error ❌"
    });

  } catch (err) {
    res.json({ reply: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running")
