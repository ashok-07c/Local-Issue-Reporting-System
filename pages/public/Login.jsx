import React from "react";
import LoginForm from "./../../components/forms/LoginForm.jsx";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="register-wrapper login-banner-new">
      <div className="top-nav-overlay">
        <span>Don't have an account?</span>
        <Link to="/register">
            Register
        </Link>
      </div>

      <div className="register-left-panel"></div>

      <div className="register-right-panel">
        <LoginForm />
      </div>
    </div>
  );
}
