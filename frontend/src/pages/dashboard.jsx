import { useEffect, useState } from "react";
import axios from "axios";

import API_BASE_URL from "../config/api";

import {
  FaSearch,
  FaLink,
  FaCommentDots,
  FaImage,
  FaShieldAlt,
  FaExclamationTriangle,
  FaRadiation,
  FaSyncAlt,
} from "react-icons/fa";

import "../styles/Dashboard.css";


function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // Fetch Dashboard Data
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/history`
      );

      setScans(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard fetch error:",
        error
      );

      setError(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);


  // ==========================================
  // Scan Type Helpers
  // ==========================================

  const getScanType = (scan) => {
    return scan.scan_type || "url";
  };


  const urlScans = scans.filter(
    (scan) => getScanType(scan) === "url"
  );


  const messageScans = scans.filter(
    (scan) => getScanType(scan) === "message"
  );


  const screenshotScans = scans.filter(
    (scan) => getScanType(scan) === "screenshot"
  );


  // ==========================================
  // Scan Statistics
  // ==========================================

  const totalScans = scans.length;

  const totalUrlScans = urlScans.length;

  const totalMessageScans = messageScans.length;

  const totalScreenshotScans = screenshotScans.length;


  const safeScans = scans.filter(
    (scan) =>
      scan.status?.toLowerCase() === "safe"
  ).length;


  const suspiciousScans = scans.filter(
    (scan) =>
      scan.status?.toLowerCase() === "suspicious"
  ).length;


  const dangerousScans = scans.filter((scan) =>
    [
      "dangerous",
      "malicious",
      "phishing",
      "spam",
    ].includes(scan.status?.toLowerCase())
  ).length;


  // ==========================================
  // Average URL Trust Score
  // ==========================================

  const urlScansWithTrust = urlScans.filter(
    (scan) =>
      scan.trust_score !== null &&
      scan.trust_score !== undefined
  );


  const averageTrust =
    urlScansWithTrust.length > 0
      ? Math.round(
          urlScansWithTrust.reduce(
            (total, scan) =>
              total +
              Number(scan.trust_score),
            0
          ) / urlScansWithTrust.length
        )
      : 0;


  // ==========================================
  // Percentages
  // ==========================================

  const getPercentage = (count) => {
    if (totalScans === 0) {
      return 0;
    }

    return Math.round(
      (count / totalScans) * 100
    );
  };


  // ==========================================
  // Recent Scans
  // ==========================================

  const recentScans = scans.slice(0, 5);


  // ==========================================
  // Status Class
  // ==========================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "safe":
        return "dashboard-status-safe";

      case "suspicious":
        return "dashboard-status-suspicious";

      case "dangerous":
      case "malicious":
      case "phishing":
      case "spam":
        return "dashboard-status-dangerous";

      default:
        return "";
    }
  };


  // ==========================================
  // Scan Content
  // ==========================================

  const getScanContent = (scan) => {
    if (getScanType(scan) === "message") {
      return (
        scan.message ||
        "No message available"
      );
    }

    return scan.url || "No URL available";
  };


  const getContentPreview = (scan) => {
    const content = getScanContent(scan);

    if (content.length > 60) {
      return `${content.substring(0, 60)}...`;
    }

    return content;
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-message">
          Loading dashboard...
        </p>
      </div>
    );
  }


  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-error">
          {error}
        </p>

        <button
          className="dashboard-refresh-button"
          onClick={fetchDashboardData}
        >
          Try Again
        </button>
      </div>
    );
  }


  return (
    <div className="dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">
        <div>
          <h1>Security Dashboard</h1>

          <p>
            Overview of URL and message scans,
            threat detection, and security results.
          </p>
        </div>

        <button
          className="dashboard-refresh-button"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <FaSyncAlt />

          Refresh
        </button>
      </div>


      {/* ======================================
          PRIMARY STATISTICS
      ====================================== */}

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="dashboard-icon">
            <FaSearch />
          </div>

          <div>
            <span>Total Scans</span>

            <h2>{totalScans}</h2>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="dashboard-icon">
            <FaLink />
          </div>

          <div>
            <span>URL Scans</span>

            <h2>{totalUrlScans}</h2>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="dashboard-icon">
            <FaCommentDots />
          </div>

          <div>
            <span>Message Scans</span>

            <h2>{totalMessageScans}</h2>
          </div>
        </div>


        <div className="dashboard-card screenshot-card">
          <div className="dashboard-icon">
            <FaImage />
          </div>

          <div>
            <span>Screenshot Scans</span>

            <h2>{totalScreenshotScans}</h2>
          </div>
        </div>


        <div className="dashboard-card safe-card">
          <div className="dashboard-icon">
            <FaShieldAlt />
          </div>

          <div>
            <span>Safe</span>

            <h2>{safeScans}</h2>
          </div>
        </div>


        <div className="dashboard-card suspicious-card">
          <div className="dashboard-icon">
            <FaExclamationTriangle />
          </div>

          <div>
            <span>Suspicious</span>

            <h2>{suspiciousScans}</h2>
          </div>
        </div>


        <div className="dashboard-card dangerous-card">
          <div className="dashboard-icon">
            <FaRadiation />
          </div>

          <div>
            <span>Dangerous</span>

            <h2>{dangerousScans}</h2>
          </div>
        </div>

      </div>


      {/* ======================================
          ANALYTICS
      ====================================== */}

      <div className="dashboard-grid">

        {/* Threat Distribution */}

        <div className="dashboard-panel">

          <div className="panel-heading">
            <div>
              <h2>Threat Distribution</h2>

              <p>
                Classification of all analyzed
                URLs and messages.
              </p>
            </div>
          </div>


          {totalScans === 0 ? (
            <div className="dashboard-empty">
              No scan data available.
            </div>
          ) : (
            <div className="distribution-list">

              <div className="distribution-item">

                <div className="distribution-label">
                  <span>Safe</span>

                  <strong>
                    {getPercentage(safeScans)}%
                  </strong>
                </div>

                <div className="distribution-track">
                  <div
                    className="
                      distribution-progress
                      safe-progress
                    "
                    style={{
                      width: `${getPercentage(
                        safeScans
                      )}%`,
                    }}
                  />
                </div>

              </div>


              <div className="distribution-item">

                <div className="distribution-label">
                  <span>Suspicious</span>

                  <strong>
                    {getPercentage(
                      suspiciousScans
                    )}%
                  </strong>
                </div>

                <div className="distribution-track">
                  <div
                    className="
                      distribution-progress
                      suspicious-progress
                    "
                    style={{
                      width: `${getPercentage(
                        suspiciousScans
                      )}%`,
                    }}
                  />
                </div>

              </div>


              <div className="distribution-item">

                <div className="distribution-label">
                  <span>Dangerous</span>

                  <strong>
                    {getPercentage(
                      dangerousScans
                    )}%
                  </strong>
                </div>

                <div className="distribution-track">
                  <div
                    className="
                      distribution-progress
                      dangerous-progress
                    "
                    style={{
                      width: `${getPercentage(
                        dangerousScans
                      )}%`,
                    }}
                  />
                </div>

              </div>

            </div>
          )}

        </div>


        {/* Average URL Trust */}

        <div className="dashboard-panel trust-panel">

          <h2>Average URL Trust Score</h2>

          <p>
            Average trust rating across URL
            scans only.
          </p>

          <div
            className="trust-circle"
            style={{
              background: `conic-gradient(
                #3b82f6
                ${averageTrust * 3.6}deg,
                #334155 0deg
              )`,
            }}
          >
            <div className="trust-circle-inner">
              <strong>{averageTrust}</strong>

              <span>/100</span>
            </div>
          </div>

          <span className="trust-label">
            Overall URL Trust
          </span>

        </div>

      </div>


      {/* ======================================
          RECENT SCANS
      ====================================== */}

      <div className="dashboard-panel recent-panel">

        <div className="panel-heading">
          <div>
            <h2>Recent Scans</h2>

            <p>
              Latest URLs and messages analyzed
              by SpamShield AI.
            </p>
          </div>
        </div>


        {recentScans.length === 0 ? (
          <div className="dashboard-empty">
            No recent scans available.
          </div>
        ) : (
          <div className="recent-table-container">

            <table className="recent-table">

              <thead>
                <tr>
                  <th>Type</th>

                  <th>Analyzed Content</th>

                  <th>Status</th>

                  <th>Trust / Confidence</th>

                  <th>Risk</th>

                  <th>Scan Time</th>
                </tr>
              </thead>


              <tbody>

                {recentScans.map((scan) => {
                  const scanType =
                    getScanType(scan);

                  return (
                    <tr key={scan.id}>

                      <td>
                        <span
                          className={`dashboard-scan-type ${
                            scanType === "message"
                              ? "dashboard-type-message"
                              : scanType === "screenshot"
                              ? "dashboard-type-screenshot"
                              : "dashboard-type-url"
                          }`}
                        >
                          {scanType === "message" ? (
                            <>
                              <FaCommentDots />
                              Message
                            </>
                          ) : scanType === "screenshot" ? (
                            <>
                              <FaImage />
                              Screenshot
                            </>
                          ) : (
                            <>
                              <FaLink />
                              URL
                            </>
                          )}
                        </span>
                      </td>


                      <td
                        className="recent-url"
                        title={getScanContent(scan)}
                      >
                        {getContentPreview(scan)}
                      </td>


                      <td>
                        <span
                          className={`dashboard-status ${getStatusClass(
                            scan.status
                          )}`}
                        >
                          {scan.status}
                        </span>
                      </td>


                      <td>
                        {scanType === "message"
                          ? scan.confidence !== null &&
                            scan.confidence !== undefined
                            ? `${scan.confidence}%`
                            : "N/A"
                          : scan.trust_score !== null &&
                            scan.trust_score !== undefined
                          ? `${scan.trust_score}/100`
                          : "N/A"}
                      </td>


                      <td>
                        {scan.risk !== null &&
                        scan.risk !== undefined
                          ? `${scan.risk}/100`
                          : "N/A"}
                      </td>


                      <td>
                        {scan.scan_time}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}


export default Dashboard;