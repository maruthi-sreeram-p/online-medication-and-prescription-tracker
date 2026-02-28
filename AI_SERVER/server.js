const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, role } = req.body;

    // Define behavior based on role
    let roleContext = "";
    if (role === "Admin") {
        roleContext = "You are a Technical Administrator Assistant. Help with system status, user management queries, and data reports.";
    } else if (role === "Doctor") {
        roleContext = "You are a Clinical Assistant. Provide medical summaries, drug interaction data, and professional health insights.";
    } else {
        roleContext = "You are a Friendly Patient Assistant. Explain medications simply, give health tips, and be empathetic.";
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: roleContext
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ reply: response.text() });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "The AI is resting right now. Try again later!" });
  }
});

const PORT = 5001; // Using 5001 to avoid conflict with your Java backend
app.listen(PORT, () => console.log(`🚀 AI Server flying on port ${PORT}`));