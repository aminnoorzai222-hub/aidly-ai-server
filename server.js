const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 API key
const GROQ_API_KEY = "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";


// 🌐 SAFE HTML (no backtick problems)
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aidly AI</title>

<style>
body { margin:0; font-family:Arial; background:#0b141a; }
#chat { padding:10px; height:85vh; overflow-y:auto; }
.msg { max-width:70%; padding:10px; margin:5px; border-radius:10px; }
.user { background:#005c4b; color:white; margin-left:auto; }
.ai { background:#202c33; color:white; margin-right:auto; }
#inputBox { position:fixed; bottom:0; width:100%; display:flex; background:#202c33; padding:10px; }
input { flex:1; padding:10px; border-radius:20px; border:none; }
button { background:none; border:none; font-size:20px; margin-left:10px; color:#00a884; }
</style>

</head>

<body>

<div id="chat"></div>

<div id="inputBox">
  <input id="input" placeholder="write something..." />
  <button onclick="send()">➤</button>
</div>

<script>
let history = [];

async function send() {
  const msg = document.getElementById("input").value;
  if (!msg) return;

  addMessage(msg, "user");
  history.push({ role: "user", content: msg });

  document.getElementById("input").value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: history })
    });

    const data = await res.json();

    addMessage(data.reply, "ai");
    history.push({ role: "assistant", content: data.reply });

  } catch {
    addMessage("❌ Error", "ai");
  }
}

function addMessage(text, type) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
</script>

</body>
</html>
  `);
});


// 🤖 AI ROUTE (FIXED STRING)
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
            content: "Reply in correct Pashto if user uses Pashto. Reply in English if user uses English."
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
