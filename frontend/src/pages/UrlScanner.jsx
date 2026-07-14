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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Analyze URL
  // -----------------------------

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please enter a URL before scanning.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-url",
        {
          url: url.trim(),
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("URL analysis error:", error);

      if (error.response) {
        setError(
          "The server could not analyze this URL. Please check the URL and try again."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to SpamShield AI backend. Make sure the backend server is running."
        );
      } else {
        setError(
          "Something went wrong while analyzing the URL."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Download PDF Report
  // -----------------------------

  const handleDownloadReport = async () => {
    if (!result) {
      setError("Please analyze a URL first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-report",
        {
          url: result.url,
        },
        {
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const downloadLink = document.createElement("a");

      downloadLink.href = fileURL;

      downloadLink.setAttribute(
        "download",
        "SpamShield_Security_Report.pdf"
      );

      document.body.appendChild(downloadLink);

      downloadLink.click();

      downloadLink.remove();

      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error(
        "Report download error:",
        error
      );

      setError(
        "Unable to generate the security report."
      );
    }
  };

  // -----------------------------
  // Status Color
  // -----------------------------

  const getStatusColor = () => {
    if (!result) {
      return "#2563eb";
    }

    switch (result.status?.toLowerCase()) {
      case "safe":
        return "#22c55e";

      case "suspicious":
        return "#facc15";

      case "dangerous":
      case "malicious":
      case "phishing":
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
        disabled={loading}
        onChange={(e) => {
          setUrl(e.target.value);

          if (error) {
            setError("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            handleAnalyze();
          }
        }}
      />

      <button
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="scanner-spinner"></span>
            Analyzing...
          </>
        ) : (
          "Analyze URL"
        )}
      </button>

      {error && (
        <div className="scanner-error">
          <span>⚠️</span>

          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-card">
          <h2
            style={{
              color: getStatusColor(),
            }}
          >
            {result.status}
          </h2>

          {/* Trust Score Gauge */}

          <div className="scanner-score-section">
            <div
              className="scanner-trust-circle"
              style={{
                background: `conic-gradient(
                  ${getStatusColor()}
                  ${
                    Number(
                      result.trust?.trust_score || 0
                    ) * 3.6
                  }deg,
                  #334155 0deg
                )`,
              }}
            >
              <div className="scanner-trust-inner">
                <strong>
                  {result.trust?.trust_score ?? 0}
                </strong>

                <span>/100</span>
              </div>
            </div>

            <p className="scanner-trust-label">
              Trust Score
            </p>
          </div>

          {/* Dashboard Cards */}

          <div className="stats-grid">
            <div className="stat-card">
              <FaShieldAlt className="icon" />

              <h2>
                {result.trust?.trust_score ?? 0}
              </h2>

              <span>Trust Score</span>
            </div>

            <div className="stat-card">
              <FaRobot className="icon" />

              <h2>
                {result.ai_prediction || "N/A"}
              </h2>

              <span>AI Prediction</span>
            </div>

            <div className="stat-card">
              <FaBug className="icon" />

              <h2>
                {result.virus_total?.malicious ?? 0}
              </h2>

              <span>Threats</span>
            </div>

            <div className="stat-card">
              <FaLock className="icon" />

              <h2>
                {result.domain_info?.https
                  ? "Yes"
                  : "No"}
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
              <strong>Domain:</strong>{" "}
              {result.domain_info?.domain || "N/A"}
            </p>

            <p>
              <strong>Registrar:</strong>{" "}
              {result.domain_info?.registrar || "N/A"}
            </p>

            <p>
              <strong>Country:</strong>{" "}
              {result.domain_info?.country || "N/A"}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {result.domain_info?.creation_date
                ? result.domain_info.creation_date.split(
                    " "
                  )[0]
                : "N/A"}
            </p>

            <p>
              <strong>Expires:</strong>{" "}
              {result.domain_info?.expiration_date
                ? result.domain_info.expiration_date.split(
                    " "
                  )[0]
                : "N/A"}
            </p>

            <p>
              <strong>HTTPS:</strong>{" "}
              {result.domain_info?.https
                ? "✅ Yes"
                : "❌ No"}
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
              {result.virus_total?.malicious ?? 0}
            </p>

            <p>
              <strong>Suspicious:</strong>{" "}
              {result.virus_total?.suspicious ?? 0}
            </p>

            <p>
              <strong>Harmless:</strong>{" "}
              {result.virus_total?.harmless ?? 0}
            </p>

            <p>
              <strong>Undetected:</strong>{" "}
              {result.virus_total?.undetected ?? 0}
            </p>
          </div>

          <hr />

          {/* AI Analysis */}

          <div className="info-section">
            <h3>💡 AI Analysis</h3>

            <ul>
              {result.reasons?.length > 0 ? (
                result.reasons.map(
                  (reason, index) => (
                    <li key={`reason-${index}`}>
                      ✔ {reason}
                    </li>
                  )
                )
              ) : (
                <li>
                  No URL analysis reasons available.
                </li>
              )}

              {result.trust?.trust_reasons?.length >
                0 &&
                result.trust.trust_reasons.map(
                  (reason, index) => (
                    <li key={`trust-${index}`}>
                      🛡 {reason}
                    </li>
                  )
                )}
            </ul>
          </div>

          {/* AI Explanation */}

          {result.explanation?.length > 0 && (
            <>
              <hr />

              <div className="info-section">
                <h3>🤖 Security Explanation</h3>

                <ul>
                  {result.explanation.map(
                    (explanation, index) => (
                      <li
                        key={`explanation-${index}`}
                      >
                        {explanation}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          )}

          {/* PDF Report */}

          <div className="report-section">
            <button
              className="download-report-button"
              onClick={handleDownloadReport}
            >
              📄 Download Security Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UrlScanner;