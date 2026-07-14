import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="main-navbar">
      <NavLink to="/" className="navbar-logo">
        <span className="logo-shield">🛡️</span>
        <span>SpamShield AI</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/url-scanner"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          URL Scanner
        </NavLink>

        <NavLink
          to="/message-scanner"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Message Scanner
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          History
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;