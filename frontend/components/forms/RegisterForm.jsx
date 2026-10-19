import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "./../../public/Logo.png";
import { authApi } from "./../../src/lib/api.js";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("You must agree to the Terms of Service.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      alert("Account Registered Successfully! Please log in.");
      navigate("/login");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      });
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common styling to prevent duplication and clean up code
  const inputStyleWithEye = {
    width: "100%",
    padding: "8px",
    paddingLeft: "39px",
    paddingRight:
      "40px" ,
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "10px" ,
    background: "none",
    border: "none",
    cursor: "pointer",
    top: "50%",
    transform: "translateY(-50%)" ,
  };

  return (
    <div className="register-card">
      <div className="form-header">
        <img src={logo} alt="Community Logo" className="form-logo" />
        <h2>Create Your Account</h2>
        <p>Sign up to get started with your account</p>
      </div>

      <form onSubmit={handleRegister}>
        {}
        <div className="form-group">
          <label>Full Name</label>
          <div className="input-icon-wrapper name-icon">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              style={{
                width: "100%",
                padding: "8px",
                paddingLeft: "39px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {}
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-icon-wrapper email-icon">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {}
        <div className="form-group">
          <label>Phone Number</label>
          <div className="input-icon-wrapper phone-icon">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        {}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
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
        </div>

        {}
        <div className="form-group">
          <label>Confirm Password</label>
          <div
            className="input-icon-wrapper lock-icon"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              style={inputStyleWithEye}
            />
            <button
              type="button"
              className={`eye-btn ${confirmPasswordVisible ? "visible" : ""}`}
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              aria-label="Toggle password visibility"
              style={eyeButtonStyle}
            />
          </div>
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            id="terms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="terms">
            I agree to the <Link to="/terms">Terms of Service</Link> and Privacy
            Policy
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Registering…" : "Register"}
        </button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <p className="login-redirect">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
