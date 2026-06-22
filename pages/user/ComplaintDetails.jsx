import { useParams, useNavigate } from "react-router-dom";

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const complaintsData = localStorage.getItem("complaints");
  const complaints = complaintsData ? JSON.parse(complaintsData) : [];

  const complaint = complaints.find(c => String(c.id) === String(id));

  if (!complaint) {
    return <p>Complaint not found</p>;
  }

  return (
    <div className="complaint-details-page">
      <h2>Complaint Details</h2>
      <p><strong>ID:</strong> {complaint.id}</p>
      <p><strong>Issue:</strong> {complaint.issue}</p>
      <p><strong>Location:</strong> {complaint.location}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      <p><strong>Date:</strong> {complaint.date}</p>
      <p><strong>Reported By:</strong> {complaint.user}</p>

      <button onClick={() => navigate("/admin/complaints")} className="back-btn">
        ← Back to Complaints
      </button>
    </div>
  );
}
