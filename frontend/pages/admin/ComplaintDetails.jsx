import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { issuesApi, resolvePhotoUrl } from "../../src/lib/api.js";
import { FaBan } from "react-icons/fa";

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    issuesApi
      .byId(id)
      .then((data) => {
        if (!ignore) setComplaint(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Complaint not found");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleMarkAsFake = async () => {
    try {
      const updated = await issuesApi.updateStatus(id, "Rejected");
      setComplaint(updated);
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  if (isLoading) return <p>Loading…</p>;
  if (error || !complaint) return <p>Complaint not found</p>;

  return (
    <div className="complaint-details-page">
      <h2>Complaint Details</h2>
      <p><strong>ID:</strong> {complaint.id}</p>
      <p><strong>Issue:</strong> {complaint.issue}</p>
      <p><strong>District:</strong> {complaint.district || "—"}</p>
      <p><strong>Mandal:</strong> {complaint.mandal || "—"}</p>
      <p><strong>Location:</strong> {complaint.location}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`status-badge ${complaint.status
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {complaint.status}
        </span>
      </p>
      <p><strong>Date:</strong> {complaint.date}</p>
      <p><strong>Reported By:</strong> {complaint.user}</p>
      {complaint.photos?.length > 0 && (
        <div className="photo-gallery">
          {complaint.photos.map((photo, idx) => (
            <img key={idx} src={resolvePhotoUrl(photo)} alt={`complaint-photo-${idx}`} className="complaint-photo" />
          ))}
        </div>
      )}

      <div className="admin-action-panel">
        <button
          onClick={handleMarkAsFake}
          className="reject-btn"
          disabled={complaint.status === "Rejected"}
          title={
            complaint.status === "Rejected"
              ? "Already marked as fake"
              : "Mark as Fake"
          }
        >
          <FaBan /> Mark as Fake
        </button>
      </div>

      <button onClick={() => navigate("/admin/complaints")} className="back-btn">
        ← Back to Complaints
      </button>
    </div>
  );
}
