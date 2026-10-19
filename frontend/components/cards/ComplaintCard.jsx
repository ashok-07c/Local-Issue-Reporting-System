export default function ComplaintCard({ title, category, status, date, icon }) {
  return (
    <div className="complaint-card">
      <div className="complaint-icon">{icon}</div>
      <div className="complaint-info">
        <h3 className="complaint-title">{title}</h3>
        <p className="complaint-category">{category}</p>
        <span className={`complaint-status ${status.toLowerCase()}`}>
          {status}
        </span>
        <p className="complaint-date">{date}</p>
      </div>
    </div>
  );
}
