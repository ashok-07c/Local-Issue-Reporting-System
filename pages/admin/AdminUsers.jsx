import { useState } from "react";

export default function AdminUsers() {
  // Get users from localStorage
  const usersData = localStorage.getItem("user");
  const users = usersData ? JSON.parse(usersData) : [];

  // Get complaints from localStorage
  const complaintsData = localStorage.getItem("complaints");
  const complaints = complaintsData ? JSON.parse(complaintsData) : [];

  // Compute stats per user
  const getUserStats = (userId) => {
    const userComplaints = complaints.filter(c => String(c.userId) === String(userId) || c.user === users.find(u => u.id === userId)?.fullName);

    const total = userComplaints.length;
    const resolved = userComplaints.filter(c => c.status?.toLowerCase() === "resolved").length;
    const inProgress = userComplaints.filter(c => c.status?.toLowerCase() === "in progress").length;
    const pending = userComplaints.filter(c => c.status?.toLowerCase().includes("pending")).length;

    return { total, resolved, inProgress, pending };
  };

  return (
    <div className="admin-users">
      <h2>Registered Users</h2>
      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Complaints</th>
              <th>Resolved</th>
              <th>In Progress</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const stats = getUserStats(u.id);
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phoneNumber}</td>
                  <td>{stats.total}</td>
                  <td>{stats.resolved}</td>
                  <td>{stats.inProgress}</td>
                  <td>{stats.pending}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No registered users found</p>
      )}
    </div>
  );
}
