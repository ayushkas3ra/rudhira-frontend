"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { Camera, Save, ArrowLeft } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";

export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    bloodType: "",
    about: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        gender: user.gender || "",
        location: user.location || "",
        bloodType: user.bloodType || "",
        about: user.about || "",
      });
      if (user.image) {
        setPreview(user.image);
      }
    } else {
        router.push('/login');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(formData.age) < 18) {
      alert("Age must be at least 18");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append("image", image);
      }

      await api.updateProfile(data);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container">
        <div className="edit-profile-container">
            <button onClick={() => router.back()} className="back-btn">
                <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Profile
            </button>

          <div className="card">
            <h1 className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--gray-800)', marginBottom: '1.5rem' }}>Edit Profile</h1>

            <form onSubmit={handleSubmit}>
                

                <div className="image-upload-section">
                    <div className="profile-preview-wrapper">
                        {preview ? (
                            <img src={preview} alt="Profile Preview" className="profile-preview-img" />
                        ) : (
                            <div className="profile-placeholder">
                                <Camera size={40} />
                            </div>
                        )}
                    </div>
                    <label className="upload-label">
                        Change Profile Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden-input" />
                    </label>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="input"
                            style={{ backgroundColor: 'var(--gray-100)', color: 'var(--gray-500)', cursor: 'not-allowed' }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <LocationPicker
                            value={formData.location}
                            onChange={(val) => setFormData({ ...formData, location: val })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Blood Type</label>
                        <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">About Me</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        className="input"
                        rows="4"
                        placeholder="Tell us about yourself..."
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ borderRadius: '9999px', opacity: loading ? 0.5 : 1 }}
                    >
                        <Save size={18} style={{ marginRight: '0.5rem' }} />
                        {loading ? "Saving..." : "Save changes"}
                    </button>
                </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
