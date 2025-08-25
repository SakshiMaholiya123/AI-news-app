// src/pages/Login.jsx
import { Mail, Lock } from "lucide-react";
import loginImg from "../assets/login.jpg"; // Import illustration like Register.jsx

export default function Login() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex w-1/2 bg-indigo-100 items-center justify-center p-8">
        <img src={loginImg} alt="Login Illustration" className="w-3/4" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            User Login
          </h2>

          {/* Form */}
          <form className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition"
            >
              Login
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-gray-600 mt-4 text-sm">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-700 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
