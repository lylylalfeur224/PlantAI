const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.get("/", (req, res) => {
  res.send("Plant AI Backend Running 🌿");
});

app.post("/analyze", async (req, res) => {

  res.json({
    plantName: "Tomato Plant",
    diseaseName: "Leaf Blight",
    severity: "Moderate",
    confidence: 94,
    description:
      "The plant shows signs of fungal leaf blight with dark spots and yellowing.",
    symptoms: [
      "Dark brown spots",
      "Yellow leaves",
      "Leaf drying"
    ],
    treatments: [
      "Use copper fungicide",
      "Remove infected leaves",
      "Avoid overwatering"
    ],
    preventiveMeasures: [
      "Improve air circulation",
      "Water in the morning",
      "Inspect leaves regularly"
    ],
    urgency: "Treat Soon"
  });

});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {

      method: "POST",

      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content: "You are a plant disease expert AI assistant."
          },
          {
            role: "user",
            content: userMessage
          }
        ]

      })

    });

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));
    console.log(data);  
    const reply =
      data.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ reply });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Error communicating with AI"
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});