import banner from "./../../public/About-banner.png";
import StatCard from "./../../components/cards/StatCard.jsx";
export default function About() {
  const communityStats = [
    {
      icon: "fa-solid fa-user",
      mainNumber: "12,458+",
      label: "Happy Citizens",
      trendIndicator: "People using our platform to report issues",
    },
    {
      icon: "fa-solid fa-clipboard-list",
      mainNumber: "24,876+",
      label: "Issues Reported",
      trendIndicator: "Issues reported across different categories",
    },
    {
      icon: "fa-solid fa-check-circle",
      mainNumber: "18,243+",
      label: "Issues Resolved",
      trendIndicator: "Successfully resolved with citizen satisfaction",
    },
    {
      icon: "fa-solid fa-building",
      mainNumber: "50+",
      label: "Partner Local Bodies",
      trendIndicator: "Working together for better communities",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-content">
        <div className="text-content">
          <div className="bold-txt">
            <span
              style={{
                color: "#2563EB",
                fontWeight: "bold",
                fontSize: "medium",
              }}
            >
              ABOUT US
            </span>
            <span className="black">Building Better Cities,</span>
            <span className="blue">Together</span>
          </div>
          <div className="normal-txt">
            <p>Our platform empowers citizens to report local issues,</p>
            <p>track their status and help local authorities take</p>
            <p>faster action. Together we'te building smarter,</p>
            <p>cleaner, and safer communities</p>
          </div>
          <div className="about-cards">
            <div className="value-card">
              <div className="icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <h3>Citizen Empowerment</h3>
                <p>
                  We give power to the people to voice issues and make a real
                  impact.
                </p>
              </div>
            </div>

            <div className="value-card">
              <div className="icon">
                <i className="fa-solid fa-shield"></i>
              </div>
              <div>
                <h3>Transparency</h3>
                <p>Track every report and action with complete transparency.</p>
              </div>
            </div>

            <div className="value-card">
              <div className="icon">
                <i className="fa-solid fa-chart-bar"></i>
              </div>
              <div>
                <h3>Better Communities</h3>
                <p>
                  Small actions today lead to better, safer, and smarter cities
                  tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="about-banner">
          <img src={banner} alt="" />
        </div>
      </div>
      <div className="about-cards-2">
        {communityStats.map((obj, index) => {
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
      <div className="mission-vision">
        <div className="mv-card">
          <i className="fa-solid fa-bullseye"></i>
          <div>
            <h3>Our Mission</h3>
            <p>
              To create a transparent and efficient platform that bridges the
              gap between citizens and local authorities for a better tomorrow.
            </p>
          </div>
        </div>

        <div className="mv-card">
          <i className="fa-solid fa-eye"></i>
          <div>
            <h3>Our Vision</h3>
            <p>
              To be the leading civic engagement platform, driving positive
              change and building smart, sustainable communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
