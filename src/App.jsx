import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Components ---
import Navbar from "./pages/Navbar";

// --- Public Pages ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Forum from "./pages/Forum";
import Monuments from "./pages/Monuments";
import MonumentDetails from "./pages/MonumentDetails";
import RegionPage from "./pages/RegionPage";

// --- Admin Pages ---
import AdminDashboard from "./pages/AdminDashboard";
import ManageMonuments from "./pages/ManageMonuments"; 

// --- Role-Based Dashboards ---
import CreatorDashboard from "./pages/CreatorDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";

// --- Form Pages ---
import AddMonument from "./pages/AddMonument"; 

// ✅ Dashboard Redirect Logic
function DashboardRedirect() {
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (role === "creator" || role === "content_creator") {
    return <Navigate to="/creator-dashboard" replace />;
  }
  if (role === "guide") return <Navigate to="/guide-dashboard" replace />;

  return <Navigate to="/user-dashboard" replace />; 
}

function App() {
  // ✅ Check if user is logged in for protected routes
  const isAuthenticated = !!localStorage.getItem("user");

  return (
    <Router>
      {/* Navbar stays on top */}
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= FEATURE ROUTES ================= */}
        
        {/* ✅ PROTECTED FORUM ROUTE: Redirects to login if not authenticated */}
        <Route 
          path="/forum" 
          element={isAuthenticated ? <Forum /> : <Navigate to="/login" replace />} 
        />

        <Route path="/monuments" element={<Monuments />} />
        <Route path="/monuments/:id" element={<MonumentDetails />} />
        <Route path="/region/:regionId" element={<RegionPage />} />

        {/* Route for the Add Monument Page */}
        <Route path="/add-monument" element={<AddMonument />} />

        {/* ================= DASHBOARD ROUTES ================= */}

        {/* Role-based redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Route for the Admin to manage/delete monuments */}
        <Route path="/manage-monuments" element={<ManageMonuments />} />

        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;