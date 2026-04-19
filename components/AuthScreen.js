// components/AuthScreen.js
// Beautiful login/signup screen matching the app's dark aesthetic.

"use client";

import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        input::placeholder { color: #5e5e7a; }
      `}</style>

      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, #818cf822 0%, transparent 70%)",
          top: -100,
          left: -100,
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, #2dd4bf22 0%, transparent 70%)",
          bottom: -50,
          right: -50,
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <div
        style={{
          background: "#161625",
          border: "1px solid #252540",
          borderRadius: 24,
          padding: 36,
          maxWidth: 420,
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: "0 0 6px",
            fontFamily: "'Space Grotesk', sans-serif",
            background: "linear-gradient(135deg, #818cf8, #2dd4bf)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ExtracurricularHub
        </h1>
        <p style={{ fontSize: 13, color: "#9999b0", margin: "0 0 24px" }}>
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              style={inputStyle}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
          />

          {error && (
            <div
              style={{
                fontSize: 13,
                color: "#ef4444",
                background: "#ef444412",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ef444433",
              }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              style={{
                fontSize: 13,
                color: "#2dd4bf",
                background: "#2dd4bf12",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #2dd4bf33",
              }}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            style={{
              background: loading || !email || !password ? "#252540" : "#818cf8",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 4,
            }}
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setMessage("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#9999b0",
              fontSize: 13,
              cursor: "pointer",
              marginTop: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #252540",
  background: "#0d0d14",
  color: "#e8e8ed",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};