import "./App.css";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./../components/common/Navbar.jsx";
import About from "./../pages/public/About.jsx";
import Home from "./../pages/public/Home.jsx";
import Login from "./../pages/public/Login.jsx";
import HowItWorks from "./../pages/public/HowItWorks.jsx";
import Register from "./../pages/public/Register.jsx";
import Sidebar from "./../components/common/Sidebar.jsx";
import NotificationBell from "./../components/common/NotificationBell.jsx";
import UserDashboard from "./../pages/user/UserDashboard.jsx";
import MyReports from "./../pages/user/MyReports.jsx";
import Reportissue from "./../pages/user/Reportissue.jsx";
import TrackProgress from "./../pages/user/TrackProgress.jsx";
import MyProfile from "./../pages/user/Profile.jsx";
import UserComplaintDetails from "./../pages/user/ComplaintDetails.jsx";
import AdminSidebar from "./../components/common/AdminSidebar.jsx";
import AdminDashboard from "./../pages/admin/AdminDashboard";
import AdminComplaints from "./../pages/admin/AdminComplaints";
import AdminAnalytics from "./../pages/admin/AdminAnalytics";
import AdminUsers from "./../pages/admin/AdminUsers";
import AdminComplaintDetails from "./../pages/admin/ComplaintDetails.jsx";
import { getSession } from "./lib/api.js";

// Redirects to /login if there's no active session; optionally restricts
// by role (e.g. requiredRole="admin" keeps regular users out of /admin/*).
// The path the user was trying to reach (e.g. a link from an email) is
// passed along as router state, so Login can send them back there after
// they sign in instead of dropping them on the generic dashboard.
function RequireAuth({ requiredRole, children }) {
  const session = getSession();
  const location = useLocation();

  if (!session?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to={session.role === "admin" ? "/admin/dashboard" : "/userdashboard"} replace />;
  }
  return children;
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function UserLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px", backgroundColor: "#F8FAFC" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <NotificationBell />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "40px", backgroundColor: "#F8FAFC" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth requiredRole="user"><UserLayout /></RequireAuth>}>
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/report-new-issue" element={<Reportissue />} />
          <Route path="/track-progress" element={<TrackProgress />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-reports/:id" element={<UserComplaintDetails />} />
        </Route>

        <Route path="/admin" element={<RequireAuth requiredRole="admin"><AdminLayout /></RequireAuth>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="complaints/:id" element={<AdminComplaintDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
