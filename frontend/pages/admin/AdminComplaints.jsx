import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaBan } from "react-icons/fa";
import { issuesApi, getSession } from "../../src/lib/api.js";

// Filter tabs shown above the table. `status: null` means "show everything".
// "Completed" maps to the Resolved status and "Fake" maps to Rejected
// (that's the status the "Mark as Fake" button sets).
const FILTERS = [
  { key: "all", label: "All", status: null },
  { key: "pending", label: "Pending", status: "Pending" },
  { key: "review", label: "Under Review", status: "Under Review" },
  { key: "progress", label: "In Progress", status: "In Progress" },
  { key: "completed", label: "Completed", status: "Resolved" },
  { key: "fake", label: "Fake", status: "Rejected" },
];

export default function AdminComplaints() {
  const [complaintsList, setComplaintsList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const session = getSession();
  // Scoped admins (session.district and/or session.mandal set) only ever
  // get their area's complaints back from the API — this banner just makes
  // that visible.
  const scopedDistrict = session?.district || null;
  const scopedMandal = session?.mandal || null;

  useEffect(() => {
    let ignore = false;
    issuesApi
      .all()
      .then((data) => {
        if (!ignore) setComplaintsList(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load complaints");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint? This cannot be undone.")) return;
    try {
      await issuesApi.remove(id);
      setComplaintsList((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete complaint");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const previous = complaintsList;
    setComplaintsList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
    try {
      const updated = await issuesApi.updateStatus(id, newStatus);
      setComplaintsList((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      setComplaintsList(previous);
      alert(err.message || "Failed to update status");
    }
  };

  // Marks a complaint as fake by setting its status to "Rejected".
  // The backend also sends the reporter an SMS acknowledgement of the change.
  const handleMarkAsFake = (id) => handleStatusChange(id, "Rejected");

  const countFor = (status) =>
    status === null
      ? complaintsList.length
      : complaintsList.filter((c) => c.status === status).length;

  const activeStatus = FILTERS.find((f) => f.key === activeFilter)?.status ?? null;
  const visibleComplaints =
    activeStatus === null
      ? complaintsList
      : complaintsList.filter((c) => c.status === activeStatus);

  if (isLoading) return <p>Loading complaints…</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <div className="admin-complaints">
      <h2>Complaints</h2>
      {scopedMandal ? (
        <p className="district-scope-banner">
          Showing complaints for <strong>{scopedMandal}</strong> mandal, <strong>{scopedDistrict}</strong> district only
        </p>
      ) : scopedDistrict ? (
        <p className="district-scope-banner">
          Showing complaints for <strong>{scopedDistrict}</strong> district only
        </p>
      ) : (
        <p className="district-scope-banner">Showing complaints for all districts</p>
      )}
      <div className="status-filter-bar" role="tablist" aria-label="Filter complaints by status">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={activeFilter === f.key}
            className={`status-filter-btn ${f.key} ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label} <span className="status-filter-count">{countFor(f.status)}</span>
          </button>
        ))}
      </div>
      {visibleComplaints.length > 0 ? (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>District</th>
              <th>Mandal</th>
              <th>Location</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleComplaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.issue}</td>
                <td>{c.district || "—"}</td>
                <td>{c.mandal || "—"}</td>
                <td>{c.location}</td>
                <td>{c.user}</td>
                <td>{c.date}</td>
                <td>
                  <span
                    className={`status-badge ${c.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {c.status}
                  </span>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending (For Review)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
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
                    onClick={() => handleMarkAsFake(c.id)}
                    className="reject-btn"
                    disabled={c.status === "Rejected"}
                    title={
                      c.status === "Rejected"
                        ? "Already marked as fake"
                        : "Mark as Fake"
                    }
                  >
                    <FaBan /> Mark as Fake
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
        <p>
          {complaintsList.length === 0
            ? "No complaints found"
            : `No ${FILTERS.find((f) => f.key === activeFilter)?.label.toLowerCase()} complaints`}
        </p>
      )}
    </div>
  );
}
