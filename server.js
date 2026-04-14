const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 خپل Hugging Face token دلته واچوه
const HF_TOKEN = "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";

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
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + HF_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await response.json();

    let reply = "No response";

    if (Array.isArray(data)) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    }

    res.json({ reply });

  } catch (error) {
    console.log(error);
    res.json({ reply: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
