import Banner from './../../public/Register-banner.png';
import logo from "./../../public/Logo.png";
import RegisterForm from "./../../components/forms/RegisterForm.jsx";

export default function Register() {
  return (
    <div className="register-wrapper">
      {/* Left Column: Context Banner Text */}
      <div className="register-left-panel">
        {/* <div className="register-headline">
          <h1>
            Let’s Build a <br />
            <span className="accent-blue">Better Community</span>
          </h1>
          <p>
            Create your account and join us in making our cities smarter, safer,
            and better for everyone.
          </p>
        </div> */}
      </div>

      {/* Right Column: White Registration Card */}
      <div className="register-right-panel">
        <RegisterForm />
      </div>
    </div>
  );
}