import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/history.css";

function history() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/history"
      );

      setHistory(response.data);
    } catch (error) {
      console.error("History fetch error:", error);
      setError("Unable to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scanId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/history/${scanId}`
      );

      setHistory((currentHistory) =>
        currentHistory.filter((scan) => scan.id !== scanId)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete scan.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "safe":
        return "status-safe";

      case "suspicious":
        return "status-suspicious";

      case "dangerous":
      case "malicious":
        return "status-dangerous";

      default:
        return "";
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Scan History</h1>

        <p>
          Review URLs previously analyzed by SpamShield AI.
        </p>

        <button
          className="refresh-button"
          onClick={fetchHistory}
        >
          Refresh History
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

      {!loading && !error && history.length === 0 && (
        <div className="empty-history">
          <h2>No scans found</h2>

          <p>
            Analyze a URL and it will appear here.
          </p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>URL</th>
                <th>Status</th>
                <th>Trust Score</th>
                <th>Risk</th>
                <th>Scan Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {history.map((scan) => (
                <tr key={scan.id}>
                  <td>{scan.id}</td>

                  <td className="history-url">
                    {scan.url}
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
                    {scan.trust_score}/100
                  </td>

                  <td>
                    {scan.risk}/100
                  </td>

                  <td>
                    {scan.scan_time}
                  </td>

                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(scan.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default history;