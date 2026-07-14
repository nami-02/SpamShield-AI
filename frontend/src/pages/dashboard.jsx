import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://127.0.0.1:8000/history"
      );

      setScans(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalScans = scans.length;

  const safeScans = scans.filter(
    (scan) => scan.status?.toLowerCase() === "safe"
  ).length;

  const suspiciousScans = scans.filter(
    (scan) => scan.status?.toLowerCase() === "suspicious"
  ).length;

  const dangerousScans = scans.filter((scan) =>
    ["dangerous", "malicious", "phishing"].includes(
      scan.status?.toLowerCase()
    )
  ).length;

  const averageTrust =
    totalScans > 0
      ? Math.round(
          scans.reduce(
            (total, scan) =>
              total + Number(scan.trust_score || 0),
            0
          ) / totalScans
        )
      : 0;

  const getPercentage = (count) => {
    if (totalScans === 0) {
      return 0;
    }

    return Math.round((count / totalScans) * 100);
  };

  const recentScans = scans.slice(0, 5);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "safe":
        return "dashboard-status-safe";

      case "suspicious":
        return "dashboard-status-suspicious";

      case "dangerous":
      case "malicious":
      case "phishing":
        return "dashboard-status-dangerous";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-message">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-error">{error}</p>

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
      <div className="dashboard-header">
        <div>
          <h1>Security Dashboard</h1>

          <p>
            Overview of URL scans and threat detection results.
          </p>
        </div>

        <button
          className="dashboard-refresh-button"
          onClick={fetchDashboardData}
        >
          Refresh
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-icon">🔍</div>

          <div>
            <span>Total Scans</span>
            <h2>{totalScans}</h2>
          </div>
        </div>

        <div className="dashboard-card safe-card">
          <div className="dashboard-icon">🛡️</div>

          <div>
            <span>Safe URLs</span>
            <h2>{safeScans}</h2>
          </div>
        </div>

        <div className="dashboard-card suspicious-card">
          <div className="dashboard-icon">⚠️</div>

          <div>
            <span>Suspicious</span>
            <h2>{suspiciousScans}</h2>
          </div>
        </div>

        <div className="dashboard-card dangerous-card">
          <div className="dashboard-icon">🚨</div>

          <div>
            <span>Dangerous</span>
            <h2>{dangerousScans}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Threat Distribution</h2>
              <p>Classification of analyzed URLs</p>
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
                    className="distribution-progress safe-progress"
                    style={{
                      width: `${getPercentage(safeScans)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="distribution-item">
                <div className="distribution-label">
                  <span>Suspicious</span>
                  <strong>
                    {getPercentage(suspiciousScans)}%
                  </strong>
                </div>

                <div className="distribution-track">
                  <div
                    className="distribution-progress suspicious-progress"
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
                    {getPercentage(dangerousScans)}%
                  </strong>
                </div>

                <div className="distribution-track">
                  <div
                    className="distribution-progress dangerous-progress"
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

        <div className="dashboard-panel trust-panel">
          <h2>Average Trust Score</h2>

          <p>
            Average trust rating across all scanned URLs.
          </p>

          <div
            className="trust-circle"
            style={{
              background: `conic-gradient(
                #3b82f6 ${averageTrust * 3.6}deg,
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

      <div className="dashboard-panel recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Scans</h2>

            <p>
              Latest URLs analyzed by SpamShield AI.
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
                  <th>URL</th>
                  <th>Status</th>
                  <th>Trust Score</th>
                  <th>Risk</th>
                  <th>Scan Time</th>
                </tr>
              </thead>

              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.id}>
                    <td className="recent-url">
                      {scan.url}
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

                    <td>{scan.trust_score}/100</td>

                    <td>{scan.risk}/100</td>

                    <td>{scan.scan_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;