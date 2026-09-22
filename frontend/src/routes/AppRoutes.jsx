import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import PatientDetails from "../pages/PatientDetails";
import Placeholder from "../pages/Placeholder";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Scans from "../pages/Scans";
import ScanDetails from "../pages/ScanDetails";
import ScanViewer from "../pages/ScanViewer";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />

          <Route path="/patients/:id" element={<PatientDetails />} />

          <Route path="/scans" element={<Scans />} />

          <Route path="/scans/:id" element={<ScanDetails />} />

          <Route path="/scans/:id/viewer" element={<ScanViewer />} />

          <Route path="/reports" element={<Placeholder title="Reports" />} />

          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
