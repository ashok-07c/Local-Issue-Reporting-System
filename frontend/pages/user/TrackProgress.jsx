import React, { useState } from "react";
import { issuesApi } from "../../src/lib/api.js";

export default function TrackProgress() {
  const [complaintId, setComplaintId] = useState("");
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!complaintId.trim()) {
      alert("Please enter a Complaint ID");
      return;
    }

    setIsLoading(true);
    try {
      const found = await issuesApi.byId(complaintId.trim());
      setResult(found);
    } catch {
      setResult(null);
    } finally {
      setHasSearched(true);
      setIsLoading(false);
    }
  };

  const getStatusClass = (status = "") => {
    return `status-badge ${status.toLowerCase().replace(" ", "-")}`;
  };

  return (
    <div className="track-container">
      <div className="track-box">
        <h1>Track Complaint Status</h1>
        <p className="subtitle">
          Enter your Complaint ID to check live progress
        </p>

        <div className="input-group">
          <label>Complaint ID</label>
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="e.g. 690f2b1c8a4e1d2f3a4b5c6d"
          />
        </div>

        <button className="track-btn" onClick={handleTrack} disabled={isLoading}>
          {isLoading ? "Tracking…" : "Track Status"}
        </button>

        {hasSearched &&
          (result ? (
            <div className="details-box">
              <h3>Complaint Details</h3>
              <p>
                <strong>ID:</strong> #{result.id}
              </p>
              <p>
                <strong>Reported By:</strong> {result.user || "Anonymous"}
              </p>
              <p>
                <strong>Issue:</strong> {result.issue}
              </p>
              <p className="status-row">
                <strong>Status:</strong>
                <span className={getStatusClass(result.status)}>
                  {result.status}
                </span>
              </p>
              <span className="update-date">Created: {result.date}</span>
              <span className="update-date">
                Last Updated: {result.lastUpdated || "Not updated yet"}
              </span>
            </div>
          ) : (
            <div className="error-box">
              No complaint found matching ID: <strong>{complaintId}</strong>
            </div>
          ))}
      </div>
    </div>
  );
}
