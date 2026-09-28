import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ReportFlowPage from "./pages/ReportFlowPage";
import MatchesPage from "./pages/MatchesPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import ClaimVerificationPage from "./pages/ClaimVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import SearchBrowsePage from "./pages/SearchBrowsePage";
import NotificationsPage from "./pages/NotificationsPage";
import ItemDetailPage from "./pages/ItemDetailPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminClaimsPage from "./pages/AdminClaimsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/report" element={<ReportFlowPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<MatchDetailPage />} />
          <Route path="/claim/:id" element={<ClaimVerificationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/browse" element={<SearchBrowsePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
        </Route>

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="claims" element={<AdminClaimsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

function ProtectedAdminRoute() {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  const role = String(user?.role || "").toUpperCase();

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}