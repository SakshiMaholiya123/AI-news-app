import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      console.log("✅ Token received");
      localStorage.setItem("token", token);
      
      // Fetch user data
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ User data:", data);
          localStorage.setItem("user", JSON.stringify(data));
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("❌ Error fetching user:", err);
          navigate("/login");
        });
    } else {
      console.log("❌ No token found");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-700 mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Completing sign in...</p>
      <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
    </div>
  );
}
