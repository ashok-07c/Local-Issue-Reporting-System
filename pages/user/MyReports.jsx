export default function MyReports() {
  const sessionData = localStorage.getItem("currentSession");
  const currentSessionUser = sessionData
    ? JSON.parse(sessionData).fullName
    : null;

  const complaintsData = localStorage.getItem("complaints");
  const allComplaints = complaintsData ? JSON.parse(complaintsData) : [];

  const userComplaints = allComplaints.filter(
    (item) => item.user === currentSessionUser,
  );

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
                        src={photo}
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
