import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SummarizerPage from "./pages/SummarizerPage";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import SavedSummaries from "./pages/SavedSummaries";
import ProfileSettings from "./pages/ProfileSettings";
import SecurityDashboard from "./pages/SecurityDashboard"; // ✅ new import

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/summarize" element={<SummarizerPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/saved-summaries" element={<SavedSummaries />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        {/* ✅ Security dashboard route */}
        <Route path="/admin-security" element={<SecurityDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
