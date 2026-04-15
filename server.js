const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = "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";

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // 🔥 دا به console کې هر څه وښيي
    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "No response from AI";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    }

    res.json({ reply });

  } catch (error) {
    console.log("ERROR:", error);
    res.json({ reply: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
