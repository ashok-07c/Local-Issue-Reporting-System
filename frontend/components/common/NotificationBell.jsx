import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { notificationsApi } from "../../src/lib/api.js";

// Polling interval for picking up new notifications while the bell is
// mounted (no websockets in this project, so a lightweight poll is the
// simplest way to keep it reasonably fresh).
const POLL_INTERVAL_MS = 30000;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const wrapperRef = useRef(null);

  const refresh = () => {
    notificationsApi
      .mine()
      .then((data) => setNotifications(data))
      .catch(() => {
        // Fail silently — a broken notification fetch shouldn't disrupt the page.
      });
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      notificationsApi
        .markRead()
        .then(refresh)
        .catch(() => {});
    }
  };

  return (
    <div className="notification-bell" ref={wrapperRef}>
      <button
        className="notification-bell-btn"
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">Notifications</div>
          {notifications.length === 0 ? (
            <p className="notification-empty">No notifications yet</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`notification-item ${n.read ? "" : "unread"}`}
                >
                  <p>{n.message}</p>
                  <span className="notification-date">{n.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
