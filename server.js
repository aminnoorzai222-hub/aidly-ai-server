const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 API key
const GROQ_API_KEY = "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";


// 🌐 ساده HTML (light version)
app.get("/", (req, res) => {
  res.send(`
    <h2>Aidly AI 🤖</h2>

    <input id="input" placeholder="write something here..." />
    <button onclick="send()">📤</button>

    <p id="output"></p>

    <script>
      let history = [];

      async function send() {
        const msg = document.getElementById("input").value;
        if (!msg) return;

        history.push({ role: "user", content: msg });
        document.getElementById("output").innerText = "Thinking...";

        try {
          const res = await fetch("/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ history: history })
          });

          const data = await res.json();

          history.push({ role: "assistant", content: data.reply });
          document.getElementById("output").innerText = data.reply;

        } catch {
          document.getElementById("output").innerText = "❌ Error";
        }
      }
    </script>
  `);
});


// 🤖 AI ROUTE (light + safe)
app.post("/chat", async (req, res) => {
  let history = req.body.history || [];

  // ✅ لږ history (safe)
  history = history.slice(-4);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Reply in Pashto if user uses Pashto. Reply in English if user uses English. Keep answers simple."
          },
          ...history
        ]
      })
    });

    const data = await response.json();

    let reply = "No response";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Error ❌" });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
