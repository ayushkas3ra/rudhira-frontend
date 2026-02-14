"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import LocationPicker from "@/components/LocationPicker";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodType: "",
    age: "",
    gender: "Not specified",
    location: "Not specified",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (parseInt(formData.age) < 18) {
      setError("You must be at least 18 years old to sign up.");
      return;
    }

    try {
      await api.signup(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <main className="login-page">
      <div className="login-card" style={{ maxWidth: '32rem' }}>
        <div className="text-center">
          <h1 className="font-bold" style={{ fontSize: '2.25rem', color: 'var(--primary-red)', marginBottom: '0.5rem' }}>Rudhir-a</h1>
          <p style={{ color: 'var(--gray-600)' }}>Join the saving lives movement</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="flex flex-col gap-2">
                <label htmlFor="bloodType" className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
                  Blood Type
                </label>
                <select id="bloodType" className="input" style={{ appearance: 'auto' }} value={formData.bloodType} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="age" className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  placeholder="Age"
                  className="input"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
                  Gender
                </label>
                <select id="gender" className="input" style={{ appearance: 'auto' }} value={formData.gender} onChange={handleChange} required>
                    <option value="Not specified">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
          </div>



          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
              Location
            </label>
            <LocationPicker
                value={formData.location}
                onChange={(val) => setFormData({ ...formData, location: val })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold" style={{ color: 'var(--gray-700)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: '1rem', boxShadow: 'var(--shadow)' }}
          >
            Create Account <MoveRight style={{ marginLeft: '0.5rem', height: '1rem', width: '1rem' }} />
          </button>
          
          <div className="text-center text-sm" style={{ color: 'var(--gray-500)', marginTop: '1rem' }}>
            Already have an account? <Link href="/" style={{ color: 'var(--primary-green)', cursor: 'pointer', fontWeight: 500 }}>Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
