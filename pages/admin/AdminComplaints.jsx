import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";

export default function AdminComplaints() {
  const complaintsData = localStorage.getItem("complaints");
  const complaints = complaintsData ? JSON.parse(complaintsData) : [];

  const [complaintsList, setComplaintsList] = useState(complaints);
  const navigate = useNavigate();

  // Delete complaint
  const handleDelete = (id) => {
    const updated = complaintsList.filter((c) => c.id !== id);
    setComplaintsList(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = complaintsList.map((c) =>
      c.id === id
        ? { ...c, status: newStatus, lastUpdated: new Date().toLocaleString() }
        : c,
    );
    setComplaintsList(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  return (
    <div className="admin-complaints">
      <h2>Complaints</h2>
      {complaintsList.length > 0 ? (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>Location</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaintsList.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.issue}</td>
                <td>{c.location}</td>
                <td>{c.user}</td>
                <td>{c.date}</td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending (For Review)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>{c.lastUpdated || "—"}</td>
                <td className="actions">
                  <button
                    onClick={() => navigate(`/admin/complaints/${c.id}`)}
                    className="view-btn"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="delete-btn"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No complaints found</p>
      )}
    </div>
  );
}
