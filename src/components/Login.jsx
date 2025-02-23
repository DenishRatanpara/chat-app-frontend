import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, User, Lock, AlertCircle, Loader } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { username, password } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 1500); // Simulate page loading
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user.id.toString());
      localStorage.setItem("username", res.data.user.username);
      setPageLoading(true);
      navigate("/");
    } catch (err) {
      console.error("API Error:", err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <Loader className="w-12 h-12 animate-spin text-[#075E54]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#075E54] text-white mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to Chat</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={onChange}
                required
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:border-transparent transition duration-200"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:border-transparent transition duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#075E54] text-white py-2.5 rounded-lg hover:bg-[#054c44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#075E54] transition duration-200 font-medium flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#075E54] font-medium hover:text-[#054c44] transition duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
