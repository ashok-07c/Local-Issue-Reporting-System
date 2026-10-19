import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authApi, setSession } from "../../src/lib/api.js";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { token, user } = await authApi.login(
        credentials.email,
        credentials.password,
      );

      setSession({ token, ...user });

      setCredentials({ email: "", password: "", rememberMe: false });

      // If we got here because a protected link (e.g. from a notification
      // email) redirected to /login, send the user back to that original
      // page instead of the generic dashboard. RequireAuth still re-checks
      // role access once they land there, so this is safe even if the
      // link turns out to need a different role than this account has.
      const redirectTo = location.state?.from;
      const fallback = user.role === "admin" ? "/admin/dashboard" : "/userdashboard";
      navigate(redirectTo ? `${redirectTo.pathname}${redirectTo.search || ""}` : fallback, {
        replace: true,
      });
    } catch (err) {
      alert(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              style={inputStyleWithEye}
            />
            <button
              type="button"
              className={`eye-btn ${passwordVisible ? "visible" : ""}`}
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Toggle password visibility"
              style={eyeButtonStyle}
            />
          </div>
          <button type="button" className="forgot-password-link">
            Forgot Password?
          </button>
        </div>{" "}
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
        <button type="submit" className="submit-btn login-action-btn" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log In"}
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
