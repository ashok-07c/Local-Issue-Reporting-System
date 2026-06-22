import { NavLink, useNavigate } from "react-router-dom";
import logo from "./../../public/Logo.png"; 
import {
  FaTachometerAlt,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminSidebar() {
   const navigate = useNavigate();
  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    {
      name: "Complaints",
      path: "/admin/complaints",
      icon: <FaClipboardList />,
    },
    { name: "Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Logout", isLogoutAction: true, icon: <FaSignOutAlt /> },
  ];
  const handleLogout = () => {
    localStorage.removeItem("currentSession");
    navigate("/login");
  };
  return (
    <div className="admin-sidebar">
      <img src={logo} alt="Logo" className="logo" />
      <div className="sidebar-links">
        {tabs.map((tab) => {
          if (tab.isLogoutAction) {
            return (
              <button
                key={tab.name}
                onClick={handleLogout}
                className="sidebar-item logout-btn"
                style={{
                  width: "100%",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{tab.icon}</span>
              <span className="label">{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
