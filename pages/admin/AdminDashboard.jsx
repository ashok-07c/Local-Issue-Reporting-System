import React from "react";
import { Pie } from "react-chartjs-2";
import ComplaintCard from "./../../components/cards/ComplaintCard.jsx";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import {
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaRoad,
  FaLightbulb,
  FaTint,
  FaTrash,
  FaWater,
  FaTree,
  FaBuilding,
  FaEllipsisH,
} from "react-icons/fa";

export default function AdminDashboard() {
  const iconMap = {
    "Roads & Potholes": <FaRoad />,
    "Street Light": <FaLightbulb />,
    "Water Supply": <FaTint />,
    "Garbage & Waste": <FaTrash />,
    "Drainage": <FaWater />,
    "Parks & Gardens": <FaTree />,
    "Building & Structure": <FaBuilding />,
    "Other": <FaEllipsisH />,
  };

  const complaintsData = localStorage.getItem("complaints");
  const complaints = complaintsData ? JSON.parse(complaintsData) : [];

  const sessionData = localStorage.getItem("currentSession");
  const currentUser = sessionData ? JSON.parse(sessionData).fullName : "Admin";

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
  const inProgress = complaints.filter(c => c.status?.toLowerCase() === "in progress" ).length 
  const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;

  const categoryCounts = complaints.reduce((acc, c) => {
    const issueName = c.issue || "Other";
    acc[issueName] = (acc[issueName] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: ["#3b82f6", "#22c55e", "#facc15", "#ef4444", "#a855f7", "#f97316", "#06b6d4", "#64748b"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } }
    }
  };

  const recentComplaints = complaints.slice(-5).reverse();

  return (
    <div className="admin-dashboard">
      {/* Intro Section */}
      <div className="intro-section">
        <div className="intro-text">
          <h4>Welcome Back, {currentUser}! 👋</h4>
          <p>Here’s what’s happening in your community today.</p>
        </div>
        <div className="user-card">
          <i className="fa fa-user-circle avatar"></i>{currentUser}
        </div>
      </div>

      <div className="summary-cards">
        <div className="card">
          <FaClipboardList className="icon total" />
          <p className="card-label">Total Reports</p>
          <h3>{total}</h3>
        </div>
        <div className="card">
          <FaCheckCircle className="icon resolved" />
          <p className="card-label">Resolved</p>
          <h3>{resolved}</h3>
        </div>
        <div className="card">
          <FaHourglassHalf className="icon progress" />
          <p className="card-label">In Progress</p>
          <h3>{inProgress}</h3>
        </div>
        <div className="card">
          <FaTimesCircle className="icon pending" />
          <p className="card-label">Pending</p>
          <h3>{pending}</h3>
        </div>
      </div>

      {/* Bottom Section splits Chart analytics and Lists columns cleanly */}
      <div className="bottom-layout-grid">
        {/* Recent Reports List Column */}
        <div className="recent-reports">
          <h2>Recent Reports</h2>
          <div className="complaints-list-wrapper">
            {recentComplaints.length === 0 ? (
              <p className="empty-state">No community complaints registered yet.</p>
            ) : (
              recentComplaints.map((item, idx) => (
                <ComplaintCard
                  key={idx}
                  title={item.title || item.description}
                  category={item.issue}
                  status={item.status}
                  date={item.date}
                  icon={iconMap[item.issue] || <FaEllipsisH />}
                />
              ))
            )}
          </div>
        </div>

        {/* Analytics Chart Column */}
        <div className="chart-section">
          <h2>Complaints by Category</h2>
          <div className="chart-container">
            {total === 0 ? (
              <div className="empty-chart">No data available</div>
            ) : (
              <Pie data={pieData} options={pieOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
