import { useState, useEffect } from "react";
import { issuesApi, resolvePhotoUrl } from "../../src/lib/api.js";

export default function MyReports() {
  const [userComplaints, setUserComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    issuesApi
      .mine()
      .then((data) => {
        if (!ignore) setUserComplaints(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load your reports");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) return <p>Loading your reports…</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <div className="my-reports">
      {userComplaints.length > 0 ? (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>Photos</th>
              <th>Location</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {userComplaints.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>
                  <div className="issue-cell">
                    <div>
                      <h4>{item.issue}</h4>
                      <p className="desc">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="photo-gallery">
                    {item.photos?.map((photo, idx) => (
                      <img
                        key={idx}
                        src={resolvePhotoUrl(photo)}
                        alt={`complaint-${item.id}-photo-${idx}`}
                        className="complaint-photo"
                      />
                    ))}
                  </div>
                </td>
                <td>{item.location}</td>
                <td>{item.user}</td>
                <td>
                  <span
                    className={`status-badge ${
                      item.status?.toLowerCase().replace(" ", "-") || "pending"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Complaints yet</p>
      )}
    </div>
  );
}
