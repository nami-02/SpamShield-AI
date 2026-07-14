import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/home";
import UrlScanner from "./pages/UrlScanner";
import MessageScanner from "./pages/MessageScanner";
import History from "./pages/history";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/url-scanner"
          element={<UrlScanner />}
        />

        <Route
          path="/message-scanner"
          element={<MessageScanner />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;