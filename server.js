const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 خپل Groq API key
const GROQ_API_KEY = "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";


// 🌐 ښکلی UI + History
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Aidly AI</title>

  <style>
    body {
      font-family: Arial;
      background: #0f172a;
      color: white;
      text-align: center;
      padding: 20px;
    }

    h2 {
      color: #38bdf8;
    }

    #chat {
      max-width: 400px;
      margin: auto;
      background: #1e293b;
      padding: 10px;
      border-radius: 10px;
      height: 400px;
      overflow-y: auto;
    }

    .user {
      text-align: right;
      margin: 5px;
      color: #22c55e;
    }

    .ai {
      text-align: left;
      margin: 5px;
      color: #facc15;
    }

    input {
      width: 70%;
      padding: 10px;
      border-radius: 5px;
      border: none;
    }

    button {
      padding: 10px;
      border: none;
      background: #38bdf8;
      color: black;
      border-radius: 5px;
    }
  </style>
</head>

<body>

<h2>Aidly AI 🤖</h2>

<div id="chat"></div>

<br>

<input id="input" placeholder="یو څه ولیکه..." />
<button onclick="send()">Send</button>

<script>
let history = [];

async function send() {
  const msg = document.getElementById("input").value;

  if (!msg) return;

  history.push({ role: "user", content: msg });
  updateChat();

  document.getElementById("input").value = "";

  try {
    let res;

    // 🔁 retry system (3 ځله)
    for (let i = 0; i < 3; i++) {
      try {
        res = await fetch("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: msg,
            history: history
          })
        });

        if (res.ok) break;
      } catch (e) {
        if (i === 2) throw e;
      }
    }

    const data = await res.json();

    history.push({ role: "assistant", content: data.reply });
    updateChat();

  } catch {
    history.push({ role: "assistant", content: "❌ ستونزه رامنځته شوه" });
    updateChat();
  }
}

function updateChat() {
  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = item.role === "user" ? "user" : "ai";
    div.innerText = item.content;
    chat.appendChild(div);
  });

  chat.scrollTop = chat.scrollHeight;
}
</script>

</body>
</html>
  `);
});


// 🤖 AI ROUTE (پښتو + history)
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const history = req.body.history || [];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${GROQ_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "ته یو هوښیار AI یې. تل په ساده، روانه او سمه پښتو ځواب ورکړه."
          },
          ...history,
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    let reply = "No response from AI";

    if (data.error) {
      reply = "❌ " + data.error.message;
    } else if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    }

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Server error ❌" });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});
