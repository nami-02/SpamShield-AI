import { useState } from "react";
import axios from "axios";
import "../styles/UrlScanner.css";

import {
  FaShieldAlt,
  FaRobot,
  FaBug,
  FaLock,
  FaGlobe,
} from "react-icons/fa";

function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-url",
        {
          url,
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend not connected.");
    }
  };

  const getStatusColor = () => {
    if (!result) return "#2563eb";

    switch (result.status) {
      case "Safe":
        return "#22c55e";

      case "Suspicious":
        return "#facc15";

      case "Dangerous":
      case "Malicious":
        return "#ef4444";

      default:
        return "#2563eb";
    }
  };

  return (
    <div className="scanner-container">

      <h1>🛡 SpamShield AI</h1>
      <p>AI Powered URL Security Scanner</p>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleAnalyze}>
        Analyze URL
      </button>

      {result && (
        <div className="result-card">

          <h2
            style={{
              color: getStatusColor(),
            }}
          >
            {result.status}
          </h2>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${result.trust.trust_score}%`,
                background: getStatusColor(),
              }}
            ></div>
          </div>

          {/* Dashboard Cards */}

          <div className="stats-grid">

            <div className="stat-card">
              <FaShieldAlt className="icon" />
              <h2>{result.trust.trust_score}</h2>
              <span>Trust Score</span>
            </div>

            <div className="stat-card">
              <FaRobot className="icon" />
              <h2>{result.ai_prediction}</h2>
              <span>AI Prediction</span>
            </div>

            <div className="stat-card">
              <FaBug className="icon" />
              <h2>{result.virus_total.malicious}</h2>
              <span>Threats</span>
            </div>

            <div className="stat-card">
              <FaLock className="icon" />
              <h2>
                {result.domain_info.https ? "Yes" : "No"}
              </h2>
              <span>HTTPS</span>
            </div>

          </div>

          <hr />

          {/* Domain Information */}

          <div className="info-section">

            <h3>
              <FaGlobe /> Domain Information
            </h3>

            <p>
              <strong>Domain:</strong> {result.domain_info.domain}
            </p>

            <p>
              <strong>Registrar:</strong> {result.domain_info.registrar}
            </p>

            <p>
              <strong>Country:</strong> {result.domain_info.country}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {result.domain_info.creation_date
                ? result.domain_info.creation_date.split(" ")[0]
                : "N/A"}
            </p>

            <p>
              <strong>Expires:</strong>{" "}
              {result.domain_info.expiration_date
                ? result.domain_info.expiration_date.split(" ")[0]
                : "N/A"}
            </p>

            <p>
              <strong>HTTPS:</strong>{" "}
              {result.domain_info.https ? "✅ Yes" : "❌ No"}
            </p>

          </div>

          <hr />

          {/* VirusTotal */}

          <div className="info-section">

            <h3>
              <FaBug /> VirusTotal Analysis
            </h3>

            <p>
              <strong>Malicious:</strong>{" "}
              {result.virus_total.malicious}
            </p>

            <p>
              <strong>Suspicious:</strong>{" "}
              {result.virus_total.suspicious}
            </p>

            <p>
              <strong>Harmless:</strong>{" "}
              {result.virus_total.harmless}
            </p>

            <p>
              <strong>Undetected:</strong>{" "}
              {result.virus_total.undetected}
            </p>

          </div>

          <hr />

          {/* AI Analysis */}

          <div className="info-section">

            <h3>💡 AI Analysis</h3>

            <ul>

              {result.reasons.map((reason, index) => (
                <li key={index}>
                  ✔ {reason}
                </li>
              ))}

              {result.trust.trust_reasons.length > 0 &&
                result.trust.trust_reasons.map((reason, index) => (
                  <li key={index}>
                    🛡 {reason}
                  </li>
                ))}

            </ul>

          </div>

        </div>
      )}

    </div>
  );
}

export default UrlScanner;