const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 خپل Groq API key دلته واچوه
const GROQ_API_KEY = "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";

// 🌐 HTML + AI یو ځای
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Aidly AI 🤖</h2>
        <input id="input" placeholder="Type..." />
        <button onclick="send()">Send</button>
        <p id="output"></p>

        <script>
          async function send() {
            const msg = document.getElementById("input").value;
            document.getElementById("output").innerText = "Thinking...";

            try {
              const res = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg })
              });

              const data = await res.json();
              document.getElementById("output").innerText = data.reply;

            } catch (err) {
              document.getElementById("output").innerText = "Connection error ❌";
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
        // 🔥 سم model (نوې نسخه)
        model: "llama3-70b-8192",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    console.log("AI DATA:", data);

    let reply = "No response from AI";

    if (data.error) {
      reply = "❌ " + data.error.message;
    } else if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
