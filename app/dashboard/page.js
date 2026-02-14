"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import LocationPicker from "@/components/LocationPicker";
import { Activity, Droplet, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = api.getCurrentUser();
    setUser(userData);
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container">
        <div className="dashboard-grid">
          <div className="stat-card red">
             <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#fee2e2' }}>Blood Type</p>
                  <h3 className="font-bold" style={{ fontSize: '1.875rem' }}>{user?.bloodType || '--'}</h3>
                </div>
                <Droplet size={40} style={{ color: '#fecaca', opacity: 0.8 }} />
             </div>
             <p className="text-xs" style={{ marginTop: '1rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'inline-block' }}>Welcome, {user?.name?.split(' ')[0] || 'User'}</p>
          </div>

          <div className="stat-card" style={{ backgroundColor: 'var(--white)' }}>
             <div style={{ flex: 1 }}>
                <p className="text-sm" style={{ color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Location</p>
                <div style={{ marginRight: '1rem' }}>
                    <LocationPicker 
                        value={user?.location || ''} 
                        onChange={(val) => setUser(prev => ({ ...prev, location: val }))}
                        onBlur={() => api.updateProfile({ location: user.location })}
                        onDetect={(val) => api.updateProfile({ location: val })}
                    />
                </div>
             </div>
             <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: 'var(--primary-green)' }}>
                <Activity size={24} />
             </div>
          </div>

           <div className="stat-card" style={{ backgroundColor: 'var(--white)' }}>
             <div>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>Donations</p>
                <h3 className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--gray-800)' }}>{user?.donations || 0}</h3>
             </div>
             <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '50%', color: '#2563eb' }}>
                <UserCheck size={24} />
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-grid">
          <Link href="/requests">
            <div className="action-card">
              <div className="flex items-center justify-center" style={{ margin: '0 auto 1rem auto', width: '4rem', height: '4rem', backgroundColor: '#dcfce7', borderRadius: '50%' }}>
                <Activity size={32} style={{ color: 'var(--primary-green)' }} />
              </div>
              <h2 className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>View Requests</h2>
              <p style={{ color: 'var(--gray-500)' }}>Check nearby blood donation requests and help save a life.</p>
            </div>
          </Link>

          <Link href="/raise-request">
            <div className="action-card red">
              <div className="flex items-center justify-center" style={{ margin: '0 auto 1rem auto', width: '4rem', height: '4rem', backgroundColor: '#fee2e2', borderRadius: '50%' }}>
                <Droplet size={32} style={{ color: 'var(--primary-red)' }} />
              </div>
              <h2 className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>Raise a Request</h2>
              <p style={{ color: 'var(--gray-500)' }}>Urgent need for blood? Broadcast a request to nearby donors.</p>
            </div>
          </Link>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h3 className="font-semibold" style={{ fontSize: '1.125rem', color: 'var(--gray-800)', marginBottom: '1rem' }}>Recent Activity</h3>
          <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-100)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--gray-500)' }}>
            No recent activity to show.
          </div>
        </div>
      </main>
    </div>
  );
}
