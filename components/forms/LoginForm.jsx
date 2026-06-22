import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("user")) || [];

    const matchedUser = existingUsers.find(
      (user) => user.email === credentials.email,
    );
    e.preventDefault();

    // Hardcoded admin credentials
    const adminEmail = "admin@locaissuereportingsystem.com";
    const adminPassword = "Admin123"; // <-- set your chosen password here

    // Check if admin login
    if (credentials.email === adminEmail) {
      if (credentials.password !== adminPassword) {
        alert("Incorrect Admin password! Please try again.");
        return;
      }

      alert("Admin Login Successful!");

      localStorage.setItem(
        "currentSession",
        JSON.stringify({
          id: "admin-001", // fixed ID
          fullName: "System Administrator",
          email: adminEmail,
          role: "admin",
        }),
      );

      navigate("/admin/dashboard");
      return;
    }
    if (!matchedUser) {
      alert("No account found with this email address!");
      return;
    }

    if (matchedUser.password !== credentials.password) {
      alert("Incorrect password! Please try again.");
      return;
    }

    alert("Login Successful!");

    localStorage.setItem(
      "currentSession",
      JSON.stringify({
        id: matchedUser.id,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        role: "user",
      }),
    );

    navigate("/userdashboard");

    setCredentials({
      email: "",
      password: "",
      rememberMe: false,
    });
    if (!matchedUser) {
      alert("No account found with this email address!");
      return;
    }

    if (matchedUser.password !== credentials.password) {
      alert("Incorrect password! Please try again.");
      return;
    }

    localStorage.setItem(
      "currentSession",
      JSON.stringify({
        id: matchedUser.id,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        role: "user",
      }),
    );

    navigate("/userdashboard");

    setCredentials({
      email: "",
      password: "",
      rememberMe: false,
    });
  };

  const inputStyleWithEye = {
    width: "100%",
    padding: "8px",
    paddingLeft: "39px",
    paddingRight: "40px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    cursor: "pointer",
    width: "24px",
    height: "24px",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className="register-card framework-login-card">
      <div className="form-header">
        <h2>Welcome Back!</h2>
        <p>Log in to continue to your account</p>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* Email Form Entry */}
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-icon-wrapper email-icon">
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        {/* Password Entry */}
        <div className="form-group">
          <label>Password</label>
          <div
            className="input-icon-wrapper lock-icon"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={
                credentials.password
              } /* Fixed: Changed from formData.password */
              onChange={
                handleInputChange
              } /* Fixed: Changed from handleChange */
              placeholder="Enter your password"
              required
              style={
                inputStyleWithEye
              } /* Fixed: Style definitions restored above */
            />
            <button
              type="button"
              className={`eye-btn ${passwordVisible ? "visible" : ""}`}
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Toggle password visibility"
              style={
                eyeButtonStyle
              } /* Fixed: Style definitions restored above */
            />
          </div>
          <button type="button" className="forgot-password-link">
            Forgot Password?
          </button>
        </div>{" "}
        {/* Fixed: Removed the misplaced extra stray closing div from below this line */}
        <div className="form-checkbox remember-me-adjust">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={credentials.rememberMe}
            onChange={handleInputChange}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button type="submit" className="submit-btn login-action-btn">
          Log In
        </button>
      </form>

      <div className="security-badge-note">
        <span className="security-lock-vector">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#64748B"
            width="14"
            height="14"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Your data is safe and secure with us.
      </div>
    </div>
  );
}
