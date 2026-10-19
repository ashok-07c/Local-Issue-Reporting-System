export default function StatCard(props) {
  return (
    <div className="card">
      <div className="icon">
        <i className={props.icon}></i>
      </div>
      <div className="data">
        <h2>{props.mainNumber}</h2>
        <p className="label">{props.label}</p>
        <span className="trend">{props.trendIndicator}</span>
      </div>
    </div>
  );
}
