const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 خپل API key دلته واچوه
const GROQ_API_KEY = "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";

// 🌐 ساده HTML UI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial; text-align:center; margin-top:50px;">
        <h2>Aidly AI 🤖</h2>

        <input id="input" placeholder="یو څه ولیکه..." style="padding:10px; width:200px;" />
        <button onclick="send()" style="padding:10px;">Send</button>

        <p id="output"></p>

        <script>
          async function send() {
            const msg = document.getElementById("input").value;
            document.getElementById("output").innerText = "Thinking...";

            try {
              const res = await fetch("/chat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: msg })
              });

              const data = await res.json();
              document.getElementById("output").innerText = data.reply;

            } catch {
              document.getElementById("output").innerText = "❌ Connection error";
            }
          }
        </script>
      </body>
    </html>
  `);
});

// 🤖 AI ROUTE
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
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    let reply = "No response from AI";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    }

    res.json({ reply });

  } catch (error) {
    res.json({ reply: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
