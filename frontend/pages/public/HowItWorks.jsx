import Action from "./../../public/HowItWorks/Action.png";
import Issue from "./../../public/HowItWorks/Issue.png";
import ReportIssue from "./../../public/HowItWorks/Reportissue.png";
import Review from "./../../public/HowItWorks/Review.png";
import TrackReport from "./../../public/HowItWorks/Trackreport.png";
export default function HowItWorks() {
  const steps = [
    {
      icon: ReportIssue,
      title: "Report an Issue",
      description:
        "Submit issues in your community with location, photos, and description.",
    },
    {
      icon: TrackReport,
      title: "Track Your Report",
      description:
        "Get a tracking ID and stay updated on the status of your report in real-time.",
    },
    {
      icon: Review,
      title: "Review & Assign",
      description:
        "Authorities review the issue and assign it to the concerned department.",
    },
    {
      icon: Action,
      title: "Action Taken",
      description:
        "The assigned team resolves the issue and updates the progress.",
    },
    {
      icon: Issue,
      title: "Issue Resolved",
      description:
        "Once resolved, you’ll be notified and can see the resolution details.",
    },
  ];
  const features = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Easy & Transparent",
      description: "Simple process with complete transparency at every step.",
    },
    {
      icon: "fa-solid fa-bell",
      title: "Timely Updates",
      description: "Get real-time notifications and never miss an update.",
    },
    {
      icon: "fa-solid fa-users",
      title: "Community Driven",
      description:
        "Your voice makes a difference in building better communities.",
    },
    {
      icon: "fa-solid fa-lock",
      title: "Secure & Reliable",
      description: "Your data is safe with us. We ensure privacy and security.",
    },
  ];
  return (
    <div className="howitworks">
      <div className="howitworks-text">
        <span className="blue">HOW IT WORKS</span>
        <span className="black">Simple Steps, Better Solutions</span>
        <p>Our platform makes it easy for citizens to report issues </p>
        <p>and for authorities to resolve them efficiently</p>
      </div>
      <div className="process-flow">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <img src={step.icon} alt={step.title} className="step-icon" />
            <h3>{step.title}</h3>
            <p>
              <div className="step-number">{index + 1}</div>
              {step.description}
            </p>
          </div>
        ))}
      </div>
      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="icon">
              <i className={feature.icon}></i>
            </div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
