import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  if (location.pathname === "/register" || location.pathname === "/login" || 
    location.pathname === "/summarize" || location.pathname === "/categories" || location.pathname === "/dashboard" ) {
  return null;
}


  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Project Name */}
        <Link to="/" className="text-xl font-semibold text-indigo-700">
          AI News
        </Link>

        {/* Right Side - Auth Buttons */}
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-50 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
