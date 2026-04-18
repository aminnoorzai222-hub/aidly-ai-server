const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const GROQ_API_KEY = "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";

app.post("/chat", async (req, res) => {
  let history = req.body.history || [];
  history = history.slice(-6);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Detect language. If Pashto reply in Pashto. If English reply in English. Do not mix."
          },
          ...history
        ]
      })
    });

    const data = await response.json();

    let reply = "";

    if (data.error) {
      console.log(data.error);
      reply = "❌ AI error";
    } else if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    } else {
      reply = "❌ No response";
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "❌ Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
