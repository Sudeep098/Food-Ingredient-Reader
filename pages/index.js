import { useState } from "react";
import Tesseract from "tesseract.js";

export default function Home() {
  const [ocrText, setOcrText] = useState("");
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showResults, setShowResults] = useState(false);

  async function processImage(file) {
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setShowResults(true);
    setOcrText("Extracting text from image...");
    setSummary("Waiting for OCR to complete...");

    try {
      const result = await Tesseract.recognize(file, "eng");
      const text = result.data.text.trim();

      setOcrText(text || "No text detected in the image");

      if (!text) {
        setSummary("Unable to read ingredients from the image. Please try a clearer photo.");
        setIsProcessing(false);
        return;
      }

      setSummary("Analyzing ingredients with AI...");

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      setSummary(data.summary || "No response from AI.");
    } catch (error) {
      setSummary("Error occurred during analysis. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }

        .left-panel {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
        }

        .logo {
          font-size: 72px;
          margin-bottom: 20px;
          text-align: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .left-panel h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin-top: 0;
        }

        .left-panel p {
          font-size: 18px;
          line-height: 1.6;
          text-align: center;
          opacity: 0.95;
          margin-bottom: 30px;
        }

        .features {
          list-style: none;
          margin-top: 30px;
          padding: 0;
        }

        .features li {
          padding: 12px 0;
          font-size: 16px;
          display: flex;
          align-items: center;
          opacity: 0.9;
        }

        .features li::before {
          content: "✓";
          margin-right: 12px;
          font-weight: bold;
          font-size: 20px;
          color: #a7f3d0;
        }

        .right-panel {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .upload-section h2 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
          margin-top: 0;
          font-weight: 600;
        }

        .file-input-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .file-input-wrapper input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          color: #6b7280;
        }

        .file-input-label:hover {
          border-color: #667eea;
          background: #f3f4f6;
        }

        .file-input-label.has-file {
          border-color: #10b981;
          background: #ecfdf5;
          color: #059669;
        }

        .file-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .file-label-text {
          line-height: 1.6;
        }

        .file-label-text small {
          display: block;
          margin-top: 5px;
          font-size: 13px;
          opacity: 0.8;
        }

        .analyze-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }

        .analyze-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .results-section {
          margin-top: 40px;
        }

        .result-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #667eea;
        }

        .result-card h3 {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 12px;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-card pre {
          background: white;
          padding: 15px;
          border-radius: 8px;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-height: 200px;
          overflow-y: auto;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          border: 1px solid #e5e7eb;
          margin: 0;
          font-family: 'Courier New', monospace;
        }

        .summary-content {
          background: white;
          padding: 15px;
          border-radius: 8px;
          line-height: 1.8;
          color: #374151;
          font-size: 15px;
          border: 1px solid #e5e7eb;
        }

        .loading {
          color: #9ca3af;
          font-style: italic;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .error {
          color: #ef4444;
          background: #fee2e2;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .result-card pre::-webkit-scrollbar {
          width: 8px;
        }

        .result-card pre::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .result-card pre::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 4px;
        }

        .result-card pre::-webkit-scrollbar-thumb:hover {
          background: #5a67d8;
        }

        @media (max-width: 968px) {
          .container {
            grid-template-columns: 1fr;
          }

          .left-panel {
            padding: 40px 30px;
          }

          .right-panel {
            padding: 40px 30px;
          }

          .left-panel h1 {
            font-size: 32px;
          }

          .logo {
            font-size: 56px;
          }
        }

        @media (max-width: 480px) {
          .page-container {
            padding: 10px;
          }

          .left-panel,
          .right-panel {
            padding: 30px 20px;
          }

          .left-panel h1 {
            font-size: 28px;
          }

          .logo {
            font-size: 48px;
          }

          .upload-section h2 {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="page-container">
        <div className="container">
          {/* Left Panel */}
          <div className="left-panel">
            <div className="logo">🥗</div>
            <h1>Ingredient Reader</h1>
            <p>
              Upload any food package image and instantly get detailed ingredient
              analysis with health insights powered by AI
            </p>

            <ul className="features">
              <li>OCR text extraction from images</li>
              <li>AI-powered ingredient analysis</li>
              <li>Health condition warnings</li>
              <li>Instant results in seconds</li>
            </ul>
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <div className="upload-section">
              <h2>Upload Food Package</h2>

              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={(e) => processImage(e.target.files[0])}
                />
                <label
                  htmlFor="imageInput"
                  className={`file-input-label ${fileName ? "has-file" : ""}`}
                >
                  <div>
                    <div className="file-icon">📸</div>
                    <div className="file-label-text">
                      {fileName ? (
                        <>
                          ✓ {fileName}
                          <small>Click to change</small>
                        </>
                      ) : (
                        <>
                          Click to upload or drag & drop
                          <small>Supports JPG, PNG, WEBP</small>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="analyze-btn"
                disabled={isProcessing || !fileName}
                onClick={() => document.getElementById("imageInput").click()}
              >
                {isProcessing
                  ? "⏳ Processing..."
                  : fileName
                  ? "✓ Ready to Analyze"
                  : "🔍 Select Image to Analyze"}
              </button>
            </div>

            {showResults && (
              <div className="results-section">
                <div className="result-card">
                  <h3>📄 Extracted Text</h3>
                  <pre className={isProcessing ? "loading" : ""}>{ocrText}</pre>
                </div>

                <div className="result-card">
                  <h3>🤖 AI Analysis</h3>
                  <div className={`summary-content ${isProcessing ? "loading" : ""}`}>
                    {summary}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      setSummary(data.summary || "No response from AI.");
    } catch (error) {
      setSummary("Error occurred during analysis. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }

        .left-panel {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
        }

        .logo {
          font-size: 72px;
          margin-bottom: 20px;
          text-align: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .left-panel h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin-top: 0;
        }

        .left-panel p {
          font-size: 18px;
          line-height: 1.6;
          text-align: center;
          opacity: 0.95;
          margin-bottom: 30px;
        }

        .features {
          list-style: none;
          margin-top: 30px;
          padding: 0;
        }

        .features li {
          padding: 12px 0;
          font-size: 16px;
          display: flex;
          align-items: center;
          opacity: 0.9;
        }

        .features li::before {
          content: "✓";
          margin-right: 12px;
          font-weight: bold;
          font-size: 20px;
          color: #a7f3d0;
        }

        .right-panel {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .upload-section h2 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
          margin-top: 0;
          font-weight: 600;
        }

        .file-input-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .file-input-wrapper input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          color: #6b7280;
        }

        .file-input-label:hover {
          border-color: #667eea;
          background: #f3f4f6;
        }

        .file-input-label.has-file {
          border-color: #10b981;
          background: #ecfdf5;
          color: #059669;
        }

        .file-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .file-label-text {
          line-height: 1.6;
        }

        .file-label-text small {
          display: block;
          margin-top: 5px;
          font-size: 13px;
          opacity: 0.8;
        }

        .analyze-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }

        .analyze-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .results-section {
          margin-top: 40px;
        }

        .result-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #667eea;
        }

        .result-card h3 {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 12px;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-card pre {
          background: white;
          padding: 15px;
          border-radius: 8px;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-height: 200px;
          overflow-y: auto;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          border: 1px solid #e5e7eb;
          margin: 0;
          font-family: 'Courier New', monospace;
        }

        .summary-content {
          background: white;
          padding: 15px;
          border-radius: 8px;
          line-height: 1.8;
          color: #374151;
          font-size: 15px;
          border: 1px solid #e5e7eb;
        }

        .loading {
          color: #9ca3af;
          font-style: italic;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .error {
          color: #ef4444;
          background: #fee2e2;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        /* Scrollbar Styling */
        .result-card pre::-webkit-scrollbar {
          width: 8px;
        }

        .result-card pre::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .result-card pre::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 4px;
        }

        .result-card pre::-webkit-scrollbar-thumb:hover {
          background: #5a67d8;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .container {
            grid-template-columns: 1fr;
          }

          .left-panel {
            padding: 40px 30px;
          }

          .right-panel {
            padding: 40px 30px;
          }

          .left-panel h1 {
            font-size: 32px;
          }

          .logo {
            font-size: 56px;
          }
        }

        @media (max-width: 480px) {
          .page-container {
            padding: 10px;
          }

          .left-panel,
          .right-panel {
            padding: 30px 20px;
          }

          .left-panel h1 {
            font-size: 28px;
          }

          .logo {
            font-size: 48px;
          }

          .upload-section h2 {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="page-container">
        <div className="container">
          {/* Left Panel */}
          <div className="left-panel">
            <div className="logo">🥗</div>
            <h1>Ingredient Reader</h1>
            <p>
              Upload any food package image and instantly get detailed ingredient
              analysis with health insights powered by AI
            </p>

            <ul className="features">
              <li>OCR text extraction from images</li>
              <li>AI-powered ingredient analysis</li>
              <li>Health condition warnings</li>
              <li>Instant results in seconds</li>
            </ul>
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <div className="upload-section">
              <h2>Upload Food Package</h2>

              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={(e) => processImage(e.target.files[0])}
                />
                <label
                  htmlFor="imageInput"
                  className={`file-input-label ${fileName ? "has-file" : ""}`}
                >
                  <div>
                    <div className="file-icon">📸</div>
                    <div className="file-label-text">
                      {fileName ? (
                        <>
                          ✓ {fileName}
                          <small>Click to change</small>
                        </>
                      ) : (
                        <>
                          Click to upload or drag & drop
                          <small>Supports JPG, PNG, WEBP</small>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="analyze-btn"
                disabled={isProcessing || !fileName}
                onClick={() => document.getElementById("imageInput").click()}
              >
                {isProcessing
                  ? "⏳ Processing..."
                  : fileName
                  ? "✓ Ready to Analyze"
                  : "🔍 Select Image to Analyze"}
              </button>
            </div>

            {showResults && (
              <div className="results-section">
                <div className="result-card">
                  <h3>📄 Extracted Text</h3>
                  <pre className={isProcessing ? "loading" : ""}>{ocrText}</pre>
                </div>

                <div className="result-card">
                  <h3>🤖 AI Analysis</h3>
                  <div className={`summary-content ${isProcessing ? "loading" : ""}`}>
                    {summary}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
 ${fileName ? "has-file" : ""}`}
                >
                  <div>
                    <div className="file-icon">📸</div>
                    <div className="file-label-text">
                      {fileName ? (
                        <>
                          ✓ {fileName}
                          <small>Click to change</small>
                        </>
                      ) : (
                        <>
                          Click to upload or drag & drop
                          <small>Supports JPG, PNG, WEBP</small>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="analyze-btn"
                disabled={isProcessing || !fileName}
                onClick={() => document.getElementById("imageInput").click()}
              >
                {isProcessing
                  ? "⏳ Processing..."
                  : fileName
                  ? "✓ Ready to Analyze"
                  : "🔍 Select Image to Analyze"}
              </button>
            </div>

            {showResults && (
              <div className="results-section">
                <div className="result-card">
                  <h3>📄 Extracted Text</h3>
                  <pre className={isProcessing ? "loading" : ""}>{ocrText}</pre>
                </div>

                <div className="result-card">
                  <h3>🤖 AI Analysis</h3>
                  <div className={`summary-content ${isProcessing ? "loading" : ""}`}>
                    {summary}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
      />

      <h4>Extracted Text</h4>
      <pre>{ocrText}</pre>

      <h4>Easy Summary</h4>
      <div>{summary}</div>
    </div>
  );
}
