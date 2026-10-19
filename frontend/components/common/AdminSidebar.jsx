import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../../src/lib/api.js";
import logo from "./../../public/Logo.png";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { name: "Dashboard",  path: "/admin/dashboard",  icon: <FaTachometerAlt /> },
    { name: "Complaints", path: "/admin/complaints",  icon: <FaClipboardList /> },
    { name: "Analytics",  path: "/admin/analytics",   icon: <FaChartBar /> },
    { name: "Users",      path: "/admin/users",        icon: <FaUsers /> },
  ];

  const handleLogout = () => {
    clearSession();
    setIsOpen(false);
    navigate("/login");
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open admin menu"
      >
        <FaBars />
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`admin-sidebar ${isOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close admin menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-links">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `sidebar-item${isActive ? " active" : ""}`
              }
            >
              <span className="sidebar-icon">{tab.icon}</span>
              <span className="sidebar-label">{tab.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button
            className="sidebar-item logout-btn"
            onClick={handleLogout}
          >
            <span className="sidebar-icon"><FaSignOutAlt /></span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}
