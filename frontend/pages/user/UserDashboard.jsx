import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "./../../components/cards/StatCard.jsx";
import PieChart from "./../../components/charts/PieChart.jsx";
import { issuesApi, getSession } from "./../../src/lib/api.js";
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
  const currentUser = getSession()?.fullName || "User";

  const [userComplaints, setUserComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    issuesApi
      .mine()
      .then((data) => {
        if (!ignore) setUserComplaints(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const pendingIssues = userComplaints.filter((item) => item.status === "Pending");
  const inProgressIssues = userComplaints.filter((item) => item.status === "In Progress");
  const resolvedIssues = userComplaints.filter((item) => item.status === "Resolved");

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

        <div className="recent-reports">
          <h2>Recent Reports</h2>
          {isLoading ? (
            <p>Loading…</p>
          ) : (
            userComplaints.map((item, idx) => (
              <ComplaintCard
                key={idx}
                title={item.title}
                category={item.issue}
                status={item.status}
                date={item.date}
                icon={iconMap[item.icon] || <FaEllipsisH />}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
