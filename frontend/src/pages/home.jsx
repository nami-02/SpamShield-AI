import "../styles/home.css";
import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaLink,
  FaCommentDots,
  FaRobot,
  FaGlobe,
  FaBug,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}

      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-badge">
            <FaShieldAlt />
            AI-Powered Threat Detection
          </div>

          <h1>
            Detect Spam.
            <br />
            Stop <span>Phishing.</span>
            <br />
            Stay Protected.
          </h1>

          <p className="home-hero-description">
            SpamShield AI analyzes suspicious URLs and messages
            using artificial intelligence and real-time security
            intelligence to identify potential threats.
          </p>

          <div className="home-action-buttons">
            <button
              className="home-primary-button"
              onClick={() => navigate("/url-scanner")}
            >
              <FaLink />
              Scan a URL
              <FaArrowRight />
            </button>

            <button
              className="home-secondary-button"
              onClick={() => navigate("/message-scanner")}
            >
              <FaCommentDots />
              Analyze Message
            </button>
          </div>

          <div className="home-trust-points">
            <span>
              <FaCheckCircle />
              AI Detection
            </span>

            <span>
              <FaCheckCircle />
              VirusTotal Intelligence
            </span>

            <span>
              <FaCheckCircle />
              Domain Analysis
            </span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="security-visual-card">
            <div className="security-card-top">
              <div className="security-icon">
                <FaShieldAlt />
              </div>

              <div>
                <span>SpamShield AI</span>
                <p>Security Analysis</p>
              </div>

              <div className="security-live">
                <span></span>
                ACTIVE
              </div>
            </div>

            <div className="security-scan-area">
              <div className="security-rings">
                <div className="security-ring security-ring-one"></div>

                <div className="security-ring security-ring-two"></div>

                <div className="security-center">
                  <FaShieldAlt />
                </div>
              </div>

              <h3>Threat Detection Active</h3>

              <p>
                AI security engine ready to analyze suspicious
                content.
              </p>
            </div>

            <div className="security-status-grid">
              <div>
                <FaRobot />
                <span>AI Model</span>
                <strong>Ready</strong>
              </div>

              <div>
                <FaBug />
                <span>Threat Intel</span>
                <strong>Active</strong>
              </div>

              <div>
                <FaGlobe />
                <span>Domain Scan</span>
                <strong>Online</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scanner Cards */}

      <section className="home-scanner-section">
        <div className="home-section-heading">
          <span>SECURITY TOOLS</span>

          <h2>Analyze suspicious content instantly</h2>

          <p>
            Choose a scanner and let SpamShield AI evaluate
            potential security risks.
          </p>
        </div>

        <div className="home-scanner-grid">
          <div className="home-scanner-card">
            <div className="scanner-card-icon">
              <FaLink />
            </div>

            <h3>URL Security Scanner</h3>

            <p>
              Analyze website links using AI classification,
              domain intelligence, WHOIS data, and VirusTotal
              threat detection.
            </p>

            <button onClick={() => navigate("/url-scanner")}>
              Scan URL
              <FaArrowRight />
            </button>
          </div>

          <div className="home-scanner-card">
            <div className="scanner-card-icon">
              <FaCommentDots />
            </div>

            <h3>Message Spam Scanner</h3>

            <p>
              Detect phishing language, credential requests,
              urgency tactics, scam indicators, and suspicious
              message patterns.
            </p>

            <button onClick={() => navigate("/message-scanner")}>
              Analyze Message
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="home-features-section">
        <div className="home-section-heading">
          <span>HOW IT WORKS</span>

          <h2>Multiple security signals. One clear result.</h2>

          <p>
            SpamShield AI combines different detection layers
            to explain why content may be safe or dangerous.
          </p>
        </div>

        <div className="home-features-grid">
          <div className="home-feature-card">
            <FaRobot />

            <h3>AI Detection</h3>

            <p>
              Machine learning analyzes URL characteristics
              and suspicious patterns.
            </p>
          </div>

          <div className="home-feature-card">
            <FaBug />

            <h3>Threat Intelligence</h3>

            <p>
              VirusTotal intelligence helps identify known
              malicious and suspicious URLs.
            </p>
          </div>

          <div className="home-feature-card">
            <FaGlobe />

            <h3>Domain Intelligence</h3>

            <p>
              WHOIS and HTTPS information provide additional
              context about a website.
            </p>
          </div>

          <div className="home-feature-card">
            <FaChartLine />

            <h3>Trust Scoring</h3>

            <p>
              Security indicators are combined into an
              understandable trust and risk assessment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="home-cta">
        <div>
          <FaShieldAlt />

          <h2>Not sure if a link is safe?</h2>

          <p>
            Analyze it with SpamShield AI before you click.
          </p>

          <button onClick={() => navigate("/url-scanner")}>
            Start Security Scan
            <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;