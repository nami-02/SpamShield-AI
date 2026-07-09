import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import UrlScanner from "./pages/UrlScanner";
import MessageScanner from "./pages/MessageScanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/url-scanner" element={<UrlScanner />} />
        <Route path="/message-scanner" element={<MessageScanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;