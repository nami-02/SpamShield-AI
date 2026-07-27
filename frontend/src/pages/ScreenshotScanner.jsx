import { useEffect, useState } from "react";
import axios from "axios";
import { createWorker } from "tesseract.js";

import API_BASE_URL from "../config/api";

import {
  FaImage,
  FaUpload,
  FaRobot,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaFileAlt,
  FaShieldVirus,
  FaUserShield,
  FaBolt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import "../styles/ScreenshotScanner.css";


function ScreenshotScanner() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ocrStatus, setOcrStatus] = useState("Idle");
  const [ocrProgress, setOcrProgress] = useState(0);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const getImageDimensions = (imageFile) => {
    return new Promise((resolve) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(imageFile);

      image.onload = () => {
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });

        URL.revokeObjectURL(objectUrl);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);

        resolve({
          width: null,
          height: null,
        });
      };

      image.src = objectUrl;
    });
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
      case "phishing":
        return "#ef4444";

      default:
        return "#3b82f6";
    }
  };

  const getRiskValue = () => {
    return Math.min(
      100,
      Math.max(0, Number(result?.risk || 0))
    );
  };

  const getConfidenceValue = () => {
    return Math.min(
      100,
      Math.max(0, Number(result?.confidence || 0))
    );
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a screenshot before scanning.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setOcrProgress(0);
      setOcrStatus("Preparing OCR");

      const dimensions = await getImageDimensions(file);

      const worker = await createWorker(
        "eng",
        1,
        {
          logger: (message) => {
            if (message.status) {
              setOcrStatus(
                message.status.replace(/_/g, " ")
              );
            }

            if (typeof message.progress === "number") {
              setOcrProgress(message.progress);
            }
          },
        }
      );

      try {
        const ocrResult = await worker.recognize(file);

        const extractedText =
          ocrResult.data.text?.trim() || "";

        const response = await axios.post(
          `${API_BASE_URL}/analyze-screenshot`,
          {
            filename: file.name,
            ocr_text: extractedText,
            ocr_confidence: Math.round(
              ocrResult.data.confidence || 0
            ),
            image_width: dimensions.width,
            image_height: dimensions.height,
            file_size: file.size,
          }
        );

        setResult(response.data);
      } finally {
        await worker.terminate();
      }
    } catch (requestError) {
      console.error("Screenshot analysis error:", requestError);

      if (requestError.response) {
        setError(
          "The server could not analyze this screenshot. Please try again."
        );
      } else if (requestError.request) {
        setError(
          "Unable to connect to SpamShield AI backend. Make sure the backend server is running."
        );
      } else {
        setError(
          "Something went wrong while analyzing the screenshot."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screenshot-scanner-page">
      <section className="screenshot-hero">
        <div className="screenshot-hero-copy">
          <div className="screenshot-pill">
            <FaShieldAlt />
            AI Powered Protection
          </div>

          <h1>Screenshot Scanner</h1>

          <p>
            Upload a screenshot and let OCR-powered analysis flag phishing prompts,
            credential traps, and suspicious impersonation attempts using AI.
          </p>
        </div>

        <div className="screenshot-hero-visual" aria-hidden="true">
          <div className="screenshot-visual-shield">
            <FaImage />
          </div>
        </div>
      </section>

      <section className="screenshot-scanner-shell">
        <div className="screenshot-upload-card">
          <div className="screenshot-upload-area">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Screenshot preview"
                className="screenshot-preview"
              />
            ) : (
              <div className="screenshot-upload-placeholder">
                <FaImage />
                <h2>Upload a screenshot</h2>
                <p>
                  PNG, JPG, WEBP, and GIF files are supported.
                </p>
              </div>
            )}

            <input
              id="screenshot-input"
              className="screenshot-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />

            <label
              className="screenshot-upload-button"
              htmlFor="screenshot-input"
            >
              <FaUpload />
              Choose Screenshot
            </label>

            {file && (
              <div className="screenshot-file-meta">
                <FaFileAlt />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className="screenshot-actions">
            <button
              className="screenshot-analyze-button"
              onClick={handleAnalyze}
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  Scanning Screenshot...
                </>
              ) : (
                <>
                  <FaRobot />
                  Analyze Screenshot
                </>
              )}
            </button>

            {loading && (
              <div className="ocr-progress-card">
                <div className="ocr-progress-header">
                  <span>{ocrStatus}</span>
                  <strong>{Math.round(ocrProgress * 100)}%</strong>
                </div>

                <div className="ocr-progress-track">
                  <div
                    className="ocr-progress-bar"
                    style={{
                      width: `${Math.round(ocrProgress * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="screenshot-trust-line">
          <FaShieldAlt />
          <span>
            We analyze OCR text, UI patterns, and impersonation signals in real time
          </span>
        </div>

        <div className="screenshot-feature-grid">
          <article className="screenshot-feature-card">
            <div className="screenshot-feature-icon purple">
              <FaUserShield />
            </div>
            <h3>OCR Analysis</h3>
            <p>Read text from screenshots to spot phishing prompts and login traps.</p>
          </article>

          <article className="screenshot-feature-card">
            <div className="screenshot-feature-icon green">
              <FaShieldVirus />
            </div>
            <h3>Threat Detection</h3>
            <p>Flag suspicious URLs, credential requests, and deceptive layouts.</p>
          </article>

          <article className="screenshot-feature-card">
            <div className="screenshot-feature-icon gold">
              <FaBolt />
            </div>
            <h3>Fast Scan</h3>
            <p>Get a quick safe, suspicious, or dangerous assessment from one image.</p>
          </article>

          <article className="screenshot-feature-card">
            <div className="screenshot-feature-icon blue">
              <FaSearch />
            </div>
            <h3>Privacy Focused</h3>
            <p>Your screenshot is analyzed locally in the browser and sent only as text.</p>
          </article>
        </div>

        <div className="screenshot-trust-bar">
          <div className="screenshot-trust-bar-copy">
            <FaShieldAlt />
            <span>AI Powered • Real-time Analysis • High Accuracy • Privacy Focused</span>
          </div>
        </div>

        {error && (
          <div className="screenshot-error">
            <FaTimes />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="screenshot-result-card modern-screenshot-result-card">
            <div className="screenshot-result-header">
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

              <button className="screenshot-download-button" type="button">
                <FaFileAlt />
                Screenshot Report
              </button>
            </div>

            <div className="screenshot-analysis-grid">
              <div className="screenshot-risk-panel">
                <h3>Screenshot Risk Score</h3>

                <div
                  className="screenshot-risk-circle"
                  style={{
                    background: `conic-gradient(
                      ${getStatusColor()}
                      ${getRiskValue() * 3.6}deg,
                      #334155 0deg
                    )`,
                  }}
                >
                  <div className="screenshot-risk-inner">
                    <strong>{getRiskValue()}</strong>

                    <span>/100</span>
                  </div>
                </div>

                <p>
                  Higher scores indicate a greater chance of a phishing or
                  impersonation screenshot.
                </p>
              </div>

              <div className="screenshot-stats">
                <div className="screenshot-stat-card">
                  <FaShieldAlt className="screenshot-stat-icon" />

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

                <div className="screenshot-stat-card">
                  <FaExclamationTriangle className="screenshot-stat-icon" />

                  <div>
                    <span>Risk Score</span>

                    <strong>{getRiskValue()}/100</strong>
                  </div>
                </div>

                <div className="screenshot-stat-card">
                  <FaRobot className="screenshot-stat-icon" />

                  <div>
                    <span>OCR Confidence</span>

                    <strong>{getConfidenceValue()}%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="screenshot-reasons-section">
              <h3>Analysis Reasons</h3>

              {result.reasons?.length > 0 ? (
                <ul>
                  {result.reasons.map((reason, index) => (
                    <li key={`screenshot-reason-${index}`}>
                      <span className="reason-indicator" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No suspicious indicators detected.</p>
              )}
            </div>

            {result.ocr_text && (
              <div className="screenshot-text-section">
                <h3>Extracted Text</h3>

                <p>{result.ocr_text}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}


export default ScreenshotScanner;