const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 خپل API key
const GROQ_API_KEY = "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";


// 🌐 UI + History + Icon
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
      color: #22c55e;
      margin: 5px;
    }

    .ai {
      text-align: left;
      color: #facc15;
      margin: 5px;
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
      cursor: pointer;
    }
  </style>
</head>

<body>

<h2>Aidly AI 🤖</h2>

<div id="chat"></div>

<br>

<input id="input" placeholder="write something..." />
<button onclick="send()">📤</button>

<script>
let history = [];

async function send() {
  const msg = document.getElementById("input").value;
  if (!msg) return;

  history.push({ role: "user", content: msg });
  updateChat();

  document.getElementById("input").value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        history: history
      })
    });

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


// 🤖 AI ROUTE (SAFE HISTORY)
app.post("/chat", async (req, res) => {
  let history = req.body.history || [];

  // 🔥 یوازې وروستي 6 messages
  history = history.slice(-6);

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
            content: "تل په ساده او روانه پښتو ځواب ورکړه."
          },
          ...history
        ]
      })
    });

    const data = await response.json();

    let reply = "No response from AI";

    if (data.choices && data.choices.length > 0) {
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
