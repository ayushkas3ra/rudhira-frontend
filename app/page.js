"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api"; // Adjust path if needed

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="text-center">
          <h1
            className="font-bold"
            style={{
              fontSize: "2.25rem",
              color: "var(--primary-red)",
              marginBottom: "0.5rem",
            }}
          >
            Rudhir-a
          </h1>
          <p style={{ color: "var(--gray-600)" }}>Blood Donation Platform</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold"
              style={{ color: "var(--gray-700)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold"
              style={{ color: "var(--gray-700)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: "1rem", boxShadow: "var(--shadow)" }}
          >
            Login{" "}
            <MoveRight
              style={{ marginLeft: "0.5rem", height: "1rem", width: "1rem" }}
            />
          </button>

          <div
            className="text-center text-sm"
            style={{ color: "var(--gray-500)", marginTop: "1rem" }}
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              style={{
                color: "var(--primary-green)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
