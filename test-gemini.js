const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    contents: [{parts: [{text: "What is the weather in Tokyo today?"}]}],
    tools: [{ googleSearch: {} }]
  })
}).then(r => r.json()).then(console.log);
