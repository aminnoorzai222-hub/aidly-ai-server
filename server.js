const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const HF_TOKEN = "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"; // خپل token

app.get("/", (req, res) => {
  res.send("Aidly AI Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
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

    let reply = "AI is thinking...";

    if (data && data[0]?.generated_text) {
      reply = data[0].generated_text;
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "AI error ❌" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
