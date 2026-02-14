"use client";

import Navbar from "@/components/Navbar";
import { MapPin, Droplet, User as UserIcon, Calendar, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const data = await api.getProfile();
            setUser(data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchProfile();
  }, []);

  if (!user) return <div className="page-wrapper"><Navbar /><main className="container text-center pt-20">Loading...</main></div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container">
        <div className="profile-card">
          <div className="profile-header-bg">
             <div className="profile-avatar-container">
                <img 
                    src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                    alt="User Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`; }}
                />
             </div>
          </div>
          
          <div className="text-center" style={{ paddingTop: '5rem', paddingBottom: '2rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
             <h1 className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--gray-800)' }}>{user.name}</h1>
             <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--gray-500)' }}>
                <MapPin size={16} /> {user.location}
             </p>
             
             <div className="flex justify-center" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                <button className="btn btn-green" style={{ borderRadius: '9999px', fontSize: '0.875rem' }} onClick={() => window.location.href = '/profile/edit'}>
                   <Edit2 size={16} style={{ marginRight: '0.5rem' }} /> Edit Profile
                </button>
             </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-100)' }}>
            <div className="profile-stats-grid">
               <div className="profile-stat">
                  <span className="font-semibold text-xs" style={{ display: 'block', color: 'var(--gray-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blood Type</span>
                  <span className="font-bold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '1.5rem', color: 'var(--primary-red)' }}>
                     <Droplet size={20} fill="currentColor" /> {user.bloodType}
                  </span>
               </div>
               <div className="profile-stat">
                  <span className="font-semibold text-xs" style={{ display: 'block', color: 'var(--gray-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age</span>
                  <span className="font-bold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '1.5rem', color: 'var(--gray-800)' }}>
                     <Calendar size={20} /> {user.age}
                  </span>
               </div>
               <div className="profile-stat">
                  <span className="font-semibold text-xs" style={{ display: 'block', color: 'var(--gray-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
                  <span className="font-bold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '1.5rem', color: 'var(--gray-800)' }}>
                     <UserIcon size={20} /> {user.gender}
                  </span>
               </div>
                <div className="profile-stat">
                  <span className="font-semibold text-xs" style={{ display: 'block', color: 'var(--gray-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Donations</span>
                  <span className="font-bold" style={{ display: 'block', marginTop: '0.25rem', fontSize: '1.5rem', color: 'var(--primary-green)' }}>
                     {user.donations}
                  </span>
               </div>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--gray-100)' }}>
             <h3 className="font-semibold" style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>About Me</h3>
             <p className="text-sm" style={{ color: 'var(--gray-600)', lineHeight: '1.625' }}>
                {user.about || `Regular blood donor. Committed to helping others in need. Contact me for urgent ${user.bloodType} requirements.`}
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
