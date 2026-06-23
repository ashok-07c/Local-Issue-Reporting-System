import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./../../public/Logo.png";
import {
  FaHome,
  FaClipboardList,
  FaPlusCircle,
  FaChartLine,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { name: "Home", path: "/userdashboard", icon: <FaHome /> },
    { name: "My Reports", path: "/my-reports", icon: <FaClipboardList /> },
    {
      name: "Report New Issue",
      path: "/report-new-issue",
      icon: <FaPlusCircle />,
    },
    { name: "Track Progress", path: "/track-progress", icon: <FaChartLine /> },
    { name: "My Profile", path: "/my-profile", icon: <FaUser /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentSession");
    setIsOpen(false);
    navigate("/login");
  };

  // Close sidebar when route changes (mobile)
  const handleNavClick = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Mobile toggle button (floating, bottom-left) ── */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      {/* ── Dark overlay behind sidebar on mobile ── */}
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* ── Sidebar panel ── */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Logo + close button row */}
        <div className="sidebar-header">
          <img src={Logo} alt="Logo" className="logo" />
          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav links */}
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

        {/* Logout pinned at bottom */}
        <div className="sidebar-logout">
          <button className="sidebar-item logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
