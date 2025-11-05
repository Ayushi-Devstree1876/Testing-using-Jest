import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 1. Validate empty fields
    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      // ✅ 2. Call API
      const res = await loginUser({ email, password });

      // ✅ 3. Store token & show success alert
      localStorage.setItem("token", res.data.access_token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      // ✅ 4. Handle invalid credentials
      if (err.response && err.response.status === 401) {
        alert("Invalid email or password!");
      } else {
        alert("Invalid credentials");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700">
          Welcome Back 👋
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
