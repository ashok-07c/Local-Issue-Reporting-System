import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./../../public/Logo.png";
import {
  FaHome,
  FaClipboardList,
  FaPlusCircle,
  FaChartLine,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  const tabs = [
    { name: "Home", path: "/userdashboard", icon: <FaHome /> },
    { name: "My Reports", path: "/my-reports", icon: <FaClipboardList /> },
    { name: "Report New Issue", path: "/report-new-issue", icon: <FaPlusCircle /> },
    { name: "Track Progress", path: "/track-progress", icon: <FaChartLine /> },
    { name: "My Profile", path: "/my-profile", icon: <FaUser /> },
    { name: "Logout", path: "/", icon: <FaSignOutAlt />, isLogout: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentSession");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <img src={Logo} alt="Logo" className="logo" />
      <div className="sidebar-links">
        {tabs.map((tab) =>
          tab.isLogout ? (
            <button
              key={tab.name}
              onClick={handleLogout}
              className="sidebar-item logout-btn"
            >
              <div className="sidebar-info">
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.name}</span>
              </div>
            </button>
          ) : (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <div className="sidebar-info">
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.name}</span>
              </div>
            </NavLink>
          )
        )}
      </div>
    </div>
  );
}
