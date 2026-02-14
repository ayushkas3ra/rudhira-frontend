"use client";

import Navbar from "@/components/Navbar";
import { Droplet, MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import LocationPicker from "@/components/LocationPicker";

export default function RaiseRequest() {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    units: "",
    location: "",
    requiredDate: "",
    urgency: "Standard (Within 24 hrs)",
    note: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createRequest(formData);
      router.push('/requests');
    } catch (err) {
      alert(err.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container">
        <h1 className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--gray-800)', marginBottom: '1.5rem' }}>Raise a Request</h1>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-note">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <p>This request will be broadcasted to all nearby donors immediately. Please verify the details before submitting.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-group">
                   <label className="form-label">Patient Name</label>
                   <input type="text" name="patientName" className="input" placeholder="Enter patient name" value={formData.patientName} onChange={handleChange} required />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Blood Type</label>
                        <select name="bloodType" className="input" style={{ appearance: 'auto' }} value={formData.bloodType} onChange={handleChange} required>
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
                    <div className="form-group">
                        <label className="form-label">Units Required</label>
                         <input type="number" name="units" className="input" placeholder="1" value={formData.units} onChange={handleChange} required />
                    </div>
                </div>



                <div className="form-group">
                   <label className="form-label">Hospital / Location</label>
                   <LocationPicker
                        value={formData.location}
                        onChange={(val) => setFormData({ ...formData, location: val })}
                   />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="form-group">
                        <label className="form-label">Required Date</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: '0.75rem', top: '0.6rem', color: 'var(--gray-300)' }} size={20} />
                            <input type="date" name="requiredDate" className="input" style={{ paddingLeft: '2.5rem' }} value={formData.requiredDate} onChange={handleChange} required />
                        </div>
                   </div>
                   <div className="form-group">
                         <label className="form-label">Urgency</label>
                        <div style={{ position: 'relative' }}>
                            <Clock style={{ position: 'absolute', left: '0.75rem', top: '0.6rem', color: 'var(--gray-300)' }} size={20} />
                            <select name="urgency" className="input" style={{ paddingLeft: '2.5rem', appearance: 'auto' }} value={formData.urgency} onChange={handleChange}>
                                <option>Critical (Within 2 hrs)</option>
                                <option>Urgent (Within 6 hrs)</option>
                                <option>Standard (Within 24 hrs)</option>
                            </select>
                        </div>
                   </div>
                </div>

                <div className="form-group">
                   <label className="form-label">Note (Optional)</label>
                   <textarea name="note" className="input" rows={3} placeholder="Add any specific instructions..." value={formData.note} onChange={handleChange}></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '1rem', boxShadow: 'var(--shadow-lg)' }}>
                    {loading ? 'Broadcasting...' : 'Broadcast Request'}
                </button>
            </form>
        </div>
      </main>
    </div>
  );
}
