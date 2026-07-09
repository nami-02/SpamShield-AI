import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="home">

      <nav className="navbar">
        <h2>🛡️ SpamShield AI</h2>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Protect Yourself from Spam & Phishing</h1>

        <p>
          Analyze suspicious URLs and messages using Artificial Intelligence.
        </p>

        <div className="buttons">

          <button onClick={() => navigate("/url-scanner")}>
            🔗 Scan URL
          </button>

          <button onClick={() => navigate("/message-scanner")}>
            💬 Analyze Message
          </button>

        </div>
      </section>

    </div>
  );
}

export default Home;