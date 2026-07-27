import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

import {
  FaCommentDots,
  FaShieldAlt,
  FaExclamationTriangle,
  FaRobot,
  FaShieldVirus,
  FaUserShield,
  FaFileAlt,
  FaBolt,
  FaSearch,
  FaTimes,
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
        `${API_BASE_URL}/analyze-message`,
        {
          message: message.trim(),
        }
      );

      setResult(response.data);
    } catch (requestError) {
      console.error("Message analysis error:", requestError);

      if (requestError.response) {
        setError(
          "The server could not analyze this message. Please try again."
        );
      } else if (requestError.request) {
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

    return String(result.confidence || "0").replace("%", "");
  };

  return (
    <div className="message-scanner-page">
      <section className="message-hero">
        <div className="message-hero-copy">
          <div className="message-pill">
            <FaShieldAlt />
            AI Powered Protection
          </div>

          <h1>Message Scanner</h1>

          <p>
            Analyze suspicious messages for spam, phishing,
            and social engineering indicators using AI.
          </p>
        </div>

        <div className="message-hero-visual" aria-hidden="true">
          <div className="message-visual-shield">
            <FaCommentDots />
          </div>
        </div>
      </section>

      <section className="message-scanner-shell">
        <div className="message-input-card">
          <div className="message-input-header">
            <div className="message-input-title">
              <FaCommentDots />
              <span>Enter Message</span>
            </div>

            <div className="message-tips-pill">Tips</div>
          </div>

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

        <div className="message-trust-line">
          <FaShieldAlt />
          <span>
            We analyze spam language, phishing signals, and social engineering
            patterns in real time
          </span>
        </div>

        <div className="message-feature-grid">
          <article className="message-feature-card">
            <div className="message-feature-icon purple">
              <FaUserShield />
            </div>

            <h3>Spam Detection</h3>
            <p>Identify spam messages and unwanted content.</p>
          </article>

          <article className="message-feature-card">
            <div className="message-feature-icon green">
              <FaShieldVirus />
            </div>

            <h3>Phishing Indicators</h3>
            <p>Detect links, keywords and patterns used in phishing.</p>
          </article>

          <article className="message-feature-card">
            <div className="message-feature-icon gold">
              <FaBolt />
            </div>

            <h3>Social Engineering</h3>
            <p>Identify manipulation tactics and deceptive techniques.</p>
          </article>

          <article className="message-feature-card">
            <div className="message-feature-icon blue">
              <FaSearch />
            </div>

            <h3>Threat Keywords</h3>
            <p>Scan for dangerous keywords and suspicious phrases.</p>
          </article>
        </div>

        <div className="message-trust-bar">
          <div className="message-trust-bar-copy">
            <FaShieldAlt />
            <span>AI Powered • Real-time Analysis • High Accuracy • Privacy Focused</span>
          </div>
        </div>

        {error && (
          <div className="message-error">
            <FaTimes />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="message-result-card modern-message-result-card">
            <div className="message-result-header">
              <div>
                <span>Analysis Result</span>

                <h2
                  style={{
                    color: getStatusColor(),
                  }}
                >
                  {result.status}
                </h2>
              </div>

              <button className="message-download-button" type="button">
                <FaFileAlt />
                Message Report
              </button>
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
                  Higher scores indicate greater spam or phishing risk.
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

                    <strong>{getRiskValue()}/100</strong>
                  </div>
                </div>

                <div className="message-stat-card">
                  <FaRobot className="message-stat-icon" />

                  <div>
                    <span>Confidence</span>

                    <strong>{getConfidenceValue()}%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="message-reasons-section">
              <h3>Analysis Reasons</h3>

              {result.reasons?.length > 0 ? (
                <ul>
                  {result.reasons.map((reason, index) => (
                    <li key={`message-reason-${index}`}>
                      <span
                        className="reason-indicator"
                        style={{
                          background: getStatusColor(),
                        }}
                      />
                      <span>{reason}</span>
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
      </section>
    </div>
  );
}

export default MessageScanner;