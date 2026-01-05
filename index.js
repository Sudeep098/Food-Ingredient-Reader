import { useState } from "react";
import Tesseract from "tesseract.js";

export default function Home() {
  const [ocrText, setOcrText] = useState("");
  const [summary, setSummary] = useState("");

  async function processImage(file) {
    setOcrText("Extracting text...");
    setSummary("Analyzing ingredients...");

    const result = await Tesseract.recognize(file, "eng");
    const text = result.data.text.trim();

    setOcrText(text || "No text detected");

    if (!text) return;

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setSummary(data.summary);
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>🥗 Ingredient Reader</h2>

      <input
        type="file"
        accept="image/*"
        onChange={e => processImage(e.target.files[0])}
      />

      <h4>Extracted Text</h4>
      <pre>{ocrText}</pre>

      <h4>Easy Summary</h4>
      <div>{summary}</div>
    </div>
  );
}