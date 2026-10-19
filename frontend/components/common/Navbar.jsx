import logo from '/Logo.png';
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  const tabs = ["Home", "About", "HowItWorks"];
  return (
    <div className="navbar">
      <div className="img">
        <img src={logo} alt="Logo" width={"260px"} />
      </div>
      <div className="nav-links">
        {tabs.map((tab) => {
          const path = tab === "Home" ? "/" : `/${tab.toLowerCase()}`;

          return (
            <NavLink
              key={tab}
              to={tab === "Home" ? "/" : `/${tab.toLowerCase()}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              {tab}
            </NavLink>
          );
        })}
      </div>
      <div className="buttons">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="register-btn">Register</button>
        </Link>
      </div>
    </div>
  );
}
