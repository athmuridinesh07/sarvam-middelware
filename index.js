const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/tts", async (req, res) => {
  try {
    const text = req.body.text || req.body.input || "";
    
    const response = await axios.post(
      "https://api.sarvam.ai/text-to-speech",
      {
        inputs: [text],
        target_language_code: "te-IN",
        speaker: "anushka",
        pitch: 0,
        pace: 0.85,
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v1",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": process.env.SARVAM_API_KEY,
        },
      }
    );

    const audioBase64 = response.data.audios[0];
    const audioBuffer = Buffer.from(audioBase64, "base64");

    res.set("Content-Type", "audio/wav");
    res.send(audioBuffer);
  } catch (err) {
    console.error("Sarvam error:", err?.response?.data || err.message);
    res.status(500).json({ error: "TTS failed", details: err?.response?.data });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sarvam middleware running on port ${PORT}`));
