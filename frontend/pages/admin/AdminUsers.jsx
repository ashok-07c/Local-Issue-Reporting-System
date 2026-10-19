import { useState, useEffect } from "react";
import { usersApi, issuesApi, getSession } from "../../src/lib/api.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const session = getSession();
  const scopedDistrict = session?.district || null;
  const scopedMandal = session?.mandal || null;

  useEffect(() => {
    let ignore = false;
    Promise.all([usersApi.all(), issuesApi.all()])
      .then(([usersData, issuesData]) => {
        if (ignore) return;
        setUsers(usersData);
        setComplaints(issuesData);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load users");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Complaints carry the reporter's id in `reportedBy` — match on that,
  // falling back to matching the reporter's name for older/legacy records.
  const getUserStats = (user) => {
    const userComplaints = complaints.filter(
      (c) => c.reportedBy === user.id || c.user === user.fullName,
    );

    const total = userComplaints.length;
    const resolved = userComplaints.filter(c => c.status?.toLowerCase() === "resolved").length;
    const inProgress = userComplaints.filter(c => c.status?.toLowerCase() === "in progress").length;
    const pending = userComplaints.filter(c => c.status?.toLowerCase().includes("pending")).length;

    return { total, resolved, inProgress, pending };
  };

  if (isLoading) return <p>Loading users…</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <div className="admin-users">
      <h2>Registered Users</h2>
      {scopedMandal ? (
        <p className="district-scope-banner">
          Showing users who reported complaints in <strong>{scopedMandal}</strong> mandal, <strong>{scopedDistrict}</strong> district
        </p>
      ) : scopedDistrict ? (
        <p className="district-scope-banner">
          Showing users who reported complaints in <strong>{scopedDistrict}</strong> district
        </p>
      ) : (
        <p className="district-scope-banner">Showing all registered users</p>
      )}
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
              const stats = getUserStats(u);
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
