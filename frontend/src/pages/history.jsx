import { useEffect, useState } from "react";
import axios from "axios";

import API_BASE_URL from "../config/api";

import {
  FaLink,
  FaCommentDots,
  FaImage,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";

import "../styles/history.css";


function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // Fetch Scan History
  // ==========================================

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/history`
      );

      setHistory(response.data);
    } catch (error) {
      console.error(
        "History fetch error:",
        error
      );

      setError(
        "Unable to load scan history."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // Delete Scan
  // ==========================================

  const handleDelete = async (scanId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/history/${scanId}`
      );

      setHistory((currentHistory) =>
        currentHistory.filter(
          (scan) => scan.id !== scanId
        )
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert("Unable to delete scan.");
    }
  };


  useEffect(() => {
    fetchHistory();
  }, []);


  // ==========================================
  // Status Class
  // ==========================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "safe":
        return "status-safe";

      case "suspicious":
        return "status-suspicious";

      case "dangerous":
      case "malicious":
      case "spam":
      case "phishing":
        return "status-dangerous";

      default:
        return "";
    }
  };


  // ==========================================
  // Scan Type
  // ==========================================

  const getScanType = (scan) => {
    return scan.scan_type || "url";
  };


  // ==========================================
  // Scan Content
  // ==========================================

  const getScanContent = (scan) => {
    if (getScanType(scan) === "message") {
      return scan.message || "No message available";
    }

    return scan.url || "No URL available";
  };


  // ==========================================
  // Message Preview
  // ==========================================

  const getContentPreview = (scan) => {
    const content = getScanContent(scan);

    if (content.length > 70) {
      return `${content.substring(0, 70)}...`;
    }

    return content;
  };


  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>Scan History</h1>

          <p>
            Review URLs and messages previously analyzed
            by SpamShield AI.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchHistory}
          disabled={loading}
        >
          <FaSyncAlt
            className={
              loading
                ? "history-refresh-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh History"}
        </button>
      </div>


      {loading && (
        <p className="history-message">
          Loading scan history...
        </p>
      )}


      {!loading && error && (
        <p className="history-error">
          {error}
        </p>
      )}


      {!loading &&
        !error &&
        history.length === 0 && (
          <div className="empty-history">
            <h2>No scans found</h2>

            <p>
              Analyze a URL or message and it will
              appear here.
            </p>
          </div>
        )}


      {!loading &&
        !error &&
        history.length > 0 && (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Type</th>

                  <th>Analyzed Content</th>

                  <th>Status</th>

                  <th>Trust / Confidence</th>

                  <th>Risk</th>

                  <th>Scan Time</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {history.map((scan) => {
                  const scanType =
                    getScanType(scan);

                  return (
                    <tr key={scan.id}>
                      <td>{scan.id}</td>


                      <td>
                        <span
                          className={`scan-type-badge ${
                            scanType === "message"
                              ? "scan-type-message"
                              : scanType === "screenshot"
                              ? "scan-type-screenshot"
                              : "scan-type-url"
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
                        className="history-content"
                        title={getScanContent(scan)}
                      >
                        {getContentPreview(scan)}
                      </td>


                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
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


                      <td>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(scan.id)
                          }
                        >
                          <FaTrash />

                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}


export default History;