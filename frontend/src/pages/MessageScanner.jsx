import { useState } from "react";
import axios from "axios";

function MessageScanner() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const analyzeMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-message",
        {
          message: message,
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Backend not connected.");
    }
  };

  return (
    <div className="scanner-container">
      <h1>💬 Message Scanner</h1>

      <textarea
        rows="10"
        cols="60"
        placeholder="Paste WhatsApp or SMS message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeMessage}>
        Analyze Message
      </button>

      {result && (
        <div className="result-card">
          <h2>{result.status}</h2>

          <p>
            <strong>Risk:</strong> {result.risk}/100
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>

          <h3>Reasons</h3>

          <ul>
            {result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MessageScanner;