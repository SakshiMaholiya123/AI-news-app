import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SummarizerPage from "./pages/SummarizerPage";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Categories from "./pages/Categories"; 
// import SavedSummaries from "./pages/SavedSummaries";  


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
        {/* <Route path="/saved" element={<SavedSummaries />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
