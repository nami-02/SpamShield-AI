import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../styles/UrlScanner.css";

import {
  FaArrowRight,
  FaShieldAlt,
  FaRobot,
  FaBug,
  FaLock,
  FaGlobe,
  FaShieldVirus,
  FaUserShield,
  FaFileAlt,
  FaBolt,
  FaSearch,
  FaTimes,
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
        `${API_BASE_URL}/analyze-url`,
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
        `${API_BASE_URL}/generate-report`,
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
    <div className="url-scanner-page">
      <section className="url-hero">
        <div className="url-hero-copy">
          <div className="url-pill">
            <FaShieldAlt />
            AI Powered Protection
          </div>

          <h1>URL Scanner</h1>

          <p>
            Scan any URL to detect phishing, malware, scams and other online threats
            using advanced AI and threat intelligence.
          </p>
        </div>

        <div className="url-hero-visual" aria-hidden="true">
          <div className="url-visual-shield">
            <FaGlobe />
          </div>
        </div>
      </section>

      <section className="url-scanner-shell">
        <div className="url-input-card">
          <div className="url-input-icon">
            <FaSearch />
          </div>

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
              <>
                <FaArrowRight />
                Analyze URL
              </>
            )}
          </button>
        </div>

        <div className="url-trust-line">
          <FaShieldAlt />
          <span>
            We analyze the URL using <strong>20+</strong> security engines and <strong>AI models</strong>
          </span>
        </div>

        <div className="url-feature-grid">
          <article className="url-feature-card">
            <div className="url-feature-icon green">
              <FaUserShield />
            </div>

            <h3>AI-Powered Analysis</h3>
            <p>
              Our machine learning models detect suspicious patterns and threats in real-time.
            </p>
          </article>

          <article className="url-feature-card">
            <div className="url-feature-icon purple">
              <FaShieldVirus />
            </div>

            <h3>Threat Intelligence</h3>
            <p>
              Real-time data from multiple threat intelligence sources worldwide.
            </p>
          </article>

          <article className="url-feature-card">
            <div className="url-feature-icon gold">
              <FaBolt />
            </div>

            <h3>Detailed Report</h3>
            <p>
              Get in-depth analysis with risk score, threat level and actionable insights.
            </p>
          </article>

          <article className="url-feature-card">
            <div className="url-feature-icon blue">
              <FaLock />
            </div>

            <h3>Your Privacy Matters</h3>
            <p>
              We don’t store your URLs or share your data with anyone.
            </p>
          </article>
        </div>

        <div className="url-trust-bar">
          <div className="url-trust-bar-copy">
            <FaShieldAlt />
            <span>Trusted by thousands of users to keep them safe online</span>
          </div>

          <div className="url-trust-metrics">
            <div>
              <strong>10K+</strong>
              <span>Users</span>
            </div>

            <div>
              <strong>500K+</strong>
              <span>Scans Performed</span>
            </div>

            <div>
              <strong>20+</strong>
              <span>Security Engines</span>
            </div>

            <div>
              <strong>99.9%</strong>
              <span>Detection Accuracy</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="scanner-error">
            <FaTimes />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-card modern-result-card">
            <div className="result-hero-row">
              <div>
                <span className="result-kicker">Security Result</span>

                <h2
                  style={{
                    color: getStatusColor(),
                  }}
                >
                  {result.status}
                </h2>
              </div>

              <button
                className="download-report-button"
                onClick={handleDownloadReport}
              >
                <FaFileAlt />
                Download Report
              </button>
            </div>

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

            <div className="stats-grid modern-stats-grid">
              <div className="stat-card">
                <FaShieldAlt className="icon" />

                <h2>{result.trust?.trust_score ?? 0}</h2>

                <span>Trust Score</span>
              </div>

              <div className="stat-card">
                <FaRobot className="icon" />

                <h2>{result.ai_prediction || "N/A"}</h2>

                <span>AI Prediction</span>
              </div>

              <div className="stat-card">
                <FaBug className="icon" />

                <h2>{result.virus_total?.malicious ?? 0}</h2>

                <span>Threats</span>
              </div>

              <div className="stat-card">
                <FaLock className="icon" />

                <h2>{result.domain_info?.https ? "Yes" : "No"}</h2>

                <span>HTTPS</span>
              </div>
            </div>

            <div className="info-grid">
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
                    ? result.domain_info.creation_date.split(" ")[0]
                    : "N/A"}
                </p>

                <p>
                  <strong>Expires:</strong>{" "}
                  {result.domain_info?.expiration_date
                    ? result.domain_info.expiration_date.split(" ")[0]
                    : "N/A"}
                </p>

                <p>
                  <strong>HTTPS:</strong>{" "}
                  {result.domain_info?.https ? "✅ Yes" : "❌ No"}
                </p>
              </div>

              <div className="info-section">
                <h3>
                  <FaBug /> VirusTotal Analysis
                </h3>

                <p>
                  <strong>Malicious:</strong> {result.virus_total?.malicious ?? 0}
                </p>

                <p>
                  <strong>Suspicious:</strong> {result.virus_total?.suspicious ?? 0}
                </p>

                <p>
                  <strong>Harmless:</strong> {result.virus_total?.harmless ?? 0}
                </p>

                <p>
                  <strong>Undetected:</strong> {result.virus_total?.undetected ?? 0}
                </p>
              </div>
            </div>

            <div className="analysis-panels">
              <div className="info-section compact-section">
                <h3>AI Analysis</h3>

                <ul>
                  {result.reasons?.length > 0 ? (
                    result.reasons.map((reason, index) => (
                      <li key={`reason-${index}`}>
                        ✔ {reason}
                      </li>
                    ))
                  ) : (
                    <li>No URL analysis reasons available.</li>
                  )}

                  {result.trust?.trust_reasons?.length > 0 &&
                    result.trust.trust_reasons.map((reason, index) => (
                      <li key={`trust-${index}`}>
                        🛡 {reason}
                      </li>
                    ))}
                </ul>
              </div>

              {result.explanation?.length > 0 && (
                <div className="info-section compact-section">
                  <h3>Security Explanation</h3>

                  <ul>
                    {result.explanation.map((explanation, index) => (
                      <li key={`explanation-${index}`}>{explanation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default UrlScanner;