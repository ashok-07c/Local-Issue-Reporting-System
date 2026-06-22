import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./../components/common/Navbar.jsx";
import About from "./../pages/public/About.jsx";
import Home from "./../pages/public/Home.jsx";
import Login from "./../pages/public/Login.jsx";
import HowItWorks from "./../pages/public/HowItWorks.jsx";
import Register from "./../pages/public/Register.jsx";
import Sidebar from "./../components/common/Sidebar.jsx";
import UserDashboard from "./../pages/user/UserDashboard.jsx";
import MyReports from "./../pages/user/MyReports.jsx";
import Reportissue from "./../pages/user/Reportissue.jsx";
import TrackProgress from "./../pages/user/TrackProgress.jsx";
import MyProfile from "./../pages/user/Profile.jsx";
import AdminSidebar from "./../components/common/AdminSidebar.jsx";
import AdminDashboard from "./../pages/admin/AdminDashboard";
import AdminComplaints from "./../pages/admin/AdminComplaints";
import AdminAnalytics from "./../pages/admin/AdminAnalytics";
import AdminUsers from "./../pages/admin/AdminUsers";
import ComplaintDetails from "./../pages/user/ComplaintDetails.jsx";

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

        <Route element={<UserLayout />}>
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/report-new-issue" element={<Reportissue />} />
          <Route path="/track-progress" element={<TrackProgress />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
