import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { issuesApi } from "../../src/lib/api.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalytics() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    issuesApi
      .all()
      .then((data) => {
        if (!ignore) setComplaints(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
  const inProgress = complaints.filter(c => c.status?.toLowerCase() === "in progress").length;
  const pending = complaints.filter(c => c.status?.toLowerCase().includes("pending")).length;

  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.issue] = (acc[c.issue] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Complaints by Status",
        data: [pending, inProgress, resolved],
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e"],
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Complaints by Category",
        data: Object.values(categoryCounts),
        backgroundColor: ["#3b82f6", "#22c55e", "#facc15", "#ef4444", "#64748b"],
      },
    ],
  };

  if (isLoading) return <p>Loading analytics…</p>;

  return (
    <div className="admin-analytics">
      <h2>Analytics Overview</h2>

      <div className="summary-cards">
        <div className="card"><h3>Total Complaints</h3><p>{total}</p></div>
        <div className="card"><h3>Resolved</h3><p>{resolved} ({((resolved / total) * 100 || 0).toFixed(1)}%)</p></div>
        <div className="card"><h3>In Progress</h3><p>{inProgress}</p></div>
        <div className="card"><h3>Pending</h3><p>{pending}</p></div>
      </div>

      <div className="analytics-grid">
        <div className="chart-box">
          <h3>Complaints by Status</h3>
          <Bar key="statusChart" data={statusData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="chart-box">
          <h3>Complaints by Category</h3>
          <Pie key="categoryChart" data={categoryData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
