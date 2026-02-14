"use client";

import Navbar from "@/components/Navbar";
import { Droplet, MapPin, Clock, CheckCircle, XCircle, User, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [view, setView] = useState('all'); // 'all' | 'mine'

  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
        setCurrentUserId(user._id);
    }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
      try {
          await api.updateRequestStatus(id, 'accepted');
          setRequests(requests.map(req => req._id === id ? { ...req, status: 'accepted' } : req));
      } catch (err) {
          alert(err.message || 'Failed to accept request');
      }
  };

  const handleReject = async (id) => {
      try {
        await api.ignoreRequest(id);
        // Optimistic update
        setRequests(prev => prev.filter(req => req._id !== id));
      } catch (err) {
        console.error("Failed to ignore request:", err);
        alert(err.message || "Failed to ignore request. Please try again.");
      }
  };

  const handleDelete = async (id) => {
      if(!confirm("Are you sure you want to delete this request?")) return;
      setRequests(requests.filter(req => req._id !== id));
  };

  if (loading) return <div className="page-wrapper"><Navbar /><main className="container text-center" style={{paddingTop: '5rem'}}>Loading...</main></div>;

  const displayedRequests = requests.filter(req => {
      // req.requester is populated object, so we need ._id
      const requesterId = typeof req.requester === 'object' ? req.requester._id : req.requester;
      
      if (view === 'mine') return requesterId === currentUserId;
      return requesterId !== currentUserId;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="container">
        <div className="request-page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--gray-800)' }}>Blood Requests</h1>
            
            <div className="view-toggle" style={{ display: 'flex', backgroundColor: 'var(--gray-100)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <button 
                    onClick={() => setView('all')}
                    className={`toggle-btn ${view === 'all' ? 'active' : ''}`}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.375rem', 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        backgroundColor: view === 'all' ? 'var(--white)' : 'transparent',
                        color: view === 'all' ? 'var(--primary-red)' : 'var(--gray-500)',
                        boxShadow: view === 'all' ? 'var(--shadow-sm)' : 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Nearby Requests
                </button>
                <button 
                    onClick={() => setView('mine')}
                    className={`toggle-btn ${view === 'mine' ? 'active' : ''}`}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.375rem', 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        backgroundColor: view === 'mine' ? 'var(--white)' : 'transparent',
                        color: view === 'mine' ? 'var(--primary-red)' : 'var(--gray-500)',
                        boxShadow: view === 'mine' ? 'var(--shadow-sm)' : 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    My Requests
                </button>
            </div>
        </div>

        {displayedRequests.length === 0 ? (
            <div className="empty-state">
                <div style={{ display: 'flex',  justifyContent: 'center' }}>
                    {view === 'all' ? <Droplet className="empty-icon" /> : <Activity className="empty-icon" />}
                </div>
                <p className="text-gray" style={{ textAlign: 'center' }}>
                    {view === 'all' 
                        ? "No active blood requests found nearby." 
                        : "You haven't raised any requests yet."}
                </p>
            </div>
        ) : (
            <div className="requests-list">
            {displayedRequests.map((req) => (
                <div key={req._id} className="request-card">
                <div className="request-header">
                    <div className="blood-type-badge">
                        {req.bloodType}
                    </div>
                    <div className="request-info">
                        <h3 className="font-semibold" style={{ color: 'var(--gray-800)' }}>{req.patientName || "Unknown Patient"}</h3>
                        <div className="request-meta">
                            <span className="meta-item"><MapPin size={12} /> {req.location || "Unknown Location"}</span>
                            <span className="urgency-badge"><Clock size={12} /> {req.urgency}</span>
                        </div>
                    </div>
                    {view === 'mine' && (
                        <div className="status-badge" style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            backgroundColor: req.status === 'pending' ? '#fef3c7' : req.status === 'accepted' ? '#dcfce7' : '#f3f4f6',
                            color: req.status === 'pending' ? '#d97706' : req.status === 'accepted' ? '#166534' : '#4b5563',
                            height: 'fit-content'
                        }}>
                            {req.status}
                        </div>
                    )}
                </div>
    
                <div className="request-actions">
                    {view === 'all' ? (
                        /* Actions for viewing other people's requests */
                        req.status === 'pending' ? (
                            <>
                                <button onClick={() => handleAccept(req._id)} className="btn btn-green" style={{ flex: 1, gap: '0.5rem' }}>
                                <CheckCircle size={16} /> Accept
                                </button>
                                <button onClick={() => handleReject(req._id)} className="btn" style={{ flex: 1, gap: '0.5rem', backgroundColor: 'var(--gray-100)', color: 'var(--gray-600)' }}>
                                <XCircle size={16} /> Ignore
                                </button>
                            </>
                        ) : (
                            <span className="status-accepted">
                                <CheckCircle size={16} /> {req.status === 'accepted' ? 'Accepted' : req.status}
                            </span>
                        )
                    ) : (
                        <div style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', flex: 1 }}>
                                {req.status === 'pending' ? 'Waiting for donors...' : 'Donors found!'}
                            </span>
                            <button onClick={() => handleDelete(req._id)} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
                </div>
            ))}
            </div>
        )}
      </main>
    </div>
  );
}
