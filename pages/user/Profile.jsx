import React, { useState, useEffect } from 'react';
// import './UserProfile.css';

export default function Profile() {
  const [user, setUser] = useState({ fullName: 'Guest User', email: 'guest@example.com' });
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    const sessionData = localStorage.getItem("currentSession");
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setUser({
        fullName: parsedSession.fullName || 'Anonymous User',
        email: parsedSession.email || 'No email provided'
      });
    }

    const sessionUser = sessionData ? JSON.parse(sessionData).fullName : null;
    const storageData = localStorage.getItem("complaints");
    const allComplaints = storageData ? JSON.parse(storageData) : [];
    
    const userComplaints = allComplaints.filter(item => item.user === sessionUser);

    setStats({
      total: userComplaints.length,
      pending: userComplaints.filter(item => item.status === "Pending").length,
      inProgress: userComplaints.filter(item => item.status === "In Progress").length,
      resolved: userComplaints.filter(item => item.status === "Resolved").length
    });
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        <div className="profile-header">
          <div className="avatar-large">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h2>{user.fullName}</h2>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-item total">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{stats.total}</span>
          </div>

          <div className="stat-item pending">
            <span className="stat-label">Pending Issues</span>
            <span className="stat-value">{stats.pending}</span>
          </div>

          <div className="stat-item progress">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>

          <div className="stat-item resolved">
            <span className="stat-label">Resolved Issues</span>
            <span className="stat-value">{stats.resolved}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
