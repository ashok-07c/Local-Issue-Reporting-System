import banner from "./../../public/Landing-page-banner.png";
import StatCard from "./../../components/cards/StatCard.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  const dashboardData = [
    {
      icon: "fa-solid fa-file-alt",
      mainNumber: 124,
      label: "Total Reports",
      trendIndicator: "+10% this month",
      color: "",
    },
    {
      icon: "fa-solid fa-check-circle",
      mainNumber: 87,
      label: "Resolved Issues",
      trendIndicator: "+12% this month",
    },
    {
      icon: "fa-solid fa-user",
      mainNumber: 42,
      label: "Active Users",
      trendIndicator: "+9% this month",
    },
    {
      icon: "fa-solid fa-smile",
      mainNumber: "92.4%",
      label: "Satisfaction Rate",
      trendIndicator: "+8% this month",
    },
  ];

  return (
    <div className="home-page">
      <div className="quote">
        <i className="fa-solid fa-user"></i>
        <span>Smart City,Better Community</span>
      </div>
      <div className="main-content">
        <div className="text-section">
          <div className="bold-txt">
            <span className="black">Report Issues.</span>
            <span className="black">Build a</span>
            <span className="blue">Better Community.</span>
          </div>
          <div className="normal-txt">
            <p>A smart platform that makes it easy to report local issues</p>
            <p>and track their resolution. Together, we can build</p>
            <p>cleaner,safer,and better cities for everyone.</p>
          </div>
          <div className="buttons">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn report-btn">
                <i className="fa-solid fa-pen-to-square"></i>
                Report an Issue
              </button>
            </Link>

            <Link to="/track-progress" style={{ textDecoration: "none" }}>
              <button className="btn track-btn">
                <i className="fa-solid fa-list"></i> Track Complaint
              </button>
            </Link>
          </div>
        </div>
        <div className="banner-section">
          <img src={banner} alt="Landing-page-banner" />
        </div>
      </div>
      <div className="homepage-cards">
        {dashboardData.map((obj, index) => {
          return (
            <StatCard
              key={index}
              icon={obj.icon}
              mainNumber={obj.mainNumber}
              label={obj.label}
              trendIndicator={obj.trendIndicator}
            />
          );
        })}
      </div>
    </div>
  );
}
