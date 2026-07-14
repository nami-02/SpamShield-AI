import { useState } from "react";
import axios from "axios";

import {
  FaCommentDots,
  FaShieldAlt,
  FaExclamationTriangle,
  FaRobot,
} from "react-icons/fa";

import "../styles/MessageScanner.css";

function MessageScanner() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyzeMessage = async () => {
    if (!message.trim()) {
      setError("Please enter a message before analyzing.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-message",
        {
          message: message.trim(),
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Message analysis error:", error);

      if (error.response) {
        setError(
          "The server could not analyze this message. Please try again."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to SpamShield AI backend. Make sure the backend server is running."
        );
      } else {
        setError(
          "Something went wrong while analyzing the message."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!result) {
      return "#3b82f6";
    }

    switch (result.status?.toLowerCase()) {
      case "safe":
        return "#22c55e";

      case "suspicious":
        return "#facc15";

      case "dangerous":
      case "malicious":
      case "spam":
      case "phishing":
        return "#ef4444";

      default:
        return "#3b82f6";
    }
  };

  const getRiskValue = () => {
    const risk = Number(result?.risk || 0);

    return Math.min(100, Math.max(0, risk));
  };

  const getConfidenceValue = () => {
    if (!result) {
      return 0;
    }

    return String(result.confidence || "0")
      .replace("%", "");
  };

  return (
    <div className="message-scanner-page">
      <div className="message-scanner-header">
        <div className="message-header-icon">
          <FaCommentDots />
        </div>

        <h1>Message Scanner</h1>

        <p>
          Analyze suspicious messages for spam, phishing,
          and social engineering indicators.
        </p>
      </div>

      <div className="message-input-card">
        <label htmlFor="message-input">
          Suspicious Message
        </label>

        <textarea
          id="message-input"
          placeholder="Paste a suspicious message here..."
          value={message}
          disabled={loading}
          onChange={(e) => {
            setMessage(e.target.value);

            if (error) {
              setError("");
            }
          }}
        />

        <div className="message-input-footer">
          <span>{message.length} characters</span>

          <button
            className="message-analyze-button"
            onClick={handleAnalyzeMessage}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="message-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <FaRobot />
                Analyze Message
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="message-error">
          <FaExclamationTriangle />

          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="message-result-card">
          <div className="message-result-header">
            <span>Analysis Result</span>

            <h2
              style={{
                color: getStatusColor(),
              }}
            >
              {result.status}
            </h2>
          </div>

          <div className="message-analysis-grid">
            <div className="message-risk-panel">
              <h3>Message Risk Score</h3>

              <div
                className="message-risk-circle"
                style={{
                  background: `conic-gradient(
                    ${getStatusColor()}
                    ${getRiskValue() * 3.6}deg,
                    #334155 0deg
                  )`,
                }}
              >
                <div className="message-risk-inner">
                  <strong>{getRiskValue()}</strong>

                  <span>/100</span>
                </div>
              </div>

              <p>
                Higher scores indicate greater spam or
                phishing risk.
              </p>
            </div>

            <div className="message-stats">
              <div className="message-stat-card">
                <FaShieldAlt className="message-stat-icon" />

                <div>
                  <span>Status</span>

                  <strong
                    style={{
                      color: getStatusColor(),
                    }}
                  >
                    {result.status}
                  </strong>
                </div>
              </div>

              <div className="message-stat-card">
                <FaExclamationTriangle className="message-stat-icon" />

                <div>
                  <span>Risk Score</span>

                  <strong>
                    {getRiskValue()}/100
                  </strong>
                </div>
              </div>

              <div className="message-stat-card">
                <FaRobot className="message-stat-icon" />

                <div>
                  <span>Confidence</span>

                  <strong>
                    {getConfidenceValue()}%
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="message-reasons-section">
            <h3>💡 Analysis Reasons</h3>

            {result.reasons?.length > 0 ? (
              <ul>
                {result.reasons.map((reason, index) => (
                  <li key={`message-reason-${index}`}>
                    <span
                      className="reason-indicator"
                      style={{
                        background: getStatusColor(),
                      }}
                    ></span>

                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-message-reasons">
                No suspicious message indicators detected.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageScanner;