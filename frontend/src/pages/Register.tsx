import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      // ✅ API call
      const response = await registerUser({ username, email, password });

      if (response?.status === 201 || response?.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        // ❌ Invalid data (server didn’t accept input)
        alert("Invalid registration data. Please check your inputs.");
      }
    } catch (err: any) {
      // ✅ API failure or server error
      if (err.response && err.response.status === 400) {
        alert("Invalid registration data. Please check your inputs.");
      } else {
        alert("Failed to register. Please try again later.");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transition-all"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Create Account ✨
        </h2>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
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
            placeholder="Enter password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
