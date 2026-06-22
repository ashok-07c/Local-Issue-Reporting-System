import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "./../../components/common/Sidebar.jsx";
import StatCard from "./../../components/cards/StatCard.jsx";
import PieChart from "./../../components/charts/PieChart.jsx";
import {
  FaRoad,
  FaLightbulb,
  FaTint,
  FaTrash,
  FaWater,
  FaTree,
  FaBuilding,
  FaEllipsisH,
} from "react-icons/fa";

import ComplaintCard from "./../../components/cards/ComplaintCard.jsx";

// 1. PLACE ICONMAP OUTSIDE THE COMPONENT (Keeps code clean and performs much faster)
const iconMap = {
  FaRoad: <FaRoad />,
  FaLightbulb: <FaLightbulb />,
  FaTint: <FaTint />,
  FaTrash: <FaTrash />,
  FaWater: <FaWater />,
  FaTree: <FaTree />,
  FaBuilding: <FaBuilding />,
  FaEllipsisH: <FaEllipsisH />,
};

export default function UserDashboard() {
  const sessionData = localStorage.getItem("currentSession");
  const currentSessionUser = sessionData
    ? JSON.parse(sessionData).fullName
    : null;

  const complaintsData = localStorage.getItem("complaints");
  const allComplaints = complaintsData ? JSON.parse(complaintsData) : [];

  const userComplaints = allComplaints.filter(
    (item) => item.user === currentSessionUser,
  );

  const pendingIssues = userComplaints.filter(
    (item) => item.status === "Pending",
  );
  const inProgressIssues = userComplaints.filter(
    (item) => item.status === "In Progress",
  );
  const resolvedIssues = userComplaints.filter(
    (item) => item.status === "Resolved",
  );

  const stats = [
    {
      icon: "fa fa-file-alt",
      mainNumber: `${userComplaints.length}`,
      label: "Total Reports",
      trendIndicator: "All time",
    },
    {
      icon: "fa fa-check-circle",
      mainNumber: `${resolvedIssues.length}`,
      label: "Resolved",
      trendIndicator: "All time",
    },
    {
      icon: "fa fa-clock",
      mainNumber: `${inProgressIssues.length}`,
      label: "In-Progress",
      trendIndicator: "Currently",
    },
    {
      icon: "fa-solid fa-hourglass",
      mainNumber: `${pendingIssues.length}`,
      label: "Pending",
      trendIndicator: "All time",
    },
  ];

  const session = JSON.parse(localStorage.getItem("currentSession")) || {
    fullName: "User",
  };
  const currentUser = session.fullName;
  console.log(currentUser);

  return (
    <div className="userdashboard">
      <div className="top-section">
        <div className="intro">
          <h4 style={{ fontWeight: "600" }}>Welcome Back, {currentUser}!👋</h4>
          <p>Here is what happening in your community</p>
        </div>
        <div className="user-card">
          <div className="avatar">
            <i className="fa fa-user-circle"></i>
          </div>
          <Link to="/my-profile">
            <div className="user-info">
              <h4>{currentUser}</h4>
            </div>
          </Link>
        </div>
      </div>

      <div className="dashboard-cards">
        {stats.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      <div className="stats">
        <div className="pie-chart">
          <h3>Reports Overview</h3>
          <PieChart data={stats} />
        </div>

        {/* Recent Reports Section */}
        <div className="recent-reports">
          <h2>Recent Reports</h2>
          {userComplaints.map((item, idx) => (
            <ComplaintCard
              key={idx}
              title={item.title}
              category={item.issue}
              status={item.status}
              date={item.date}
              icon={iconMap[item.icon] || <FaEllipsisH />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
