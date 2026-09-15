import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Placeholder from "../pages/Placeholder";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/patients"
          element={<Placeholder title="Patients" />}
        />
        <Route
          path="/scans"
          element={<Placeholder title="Medical Scans" />}
        />
        <Route
          path="/reports"
          element={<Placeholder title="Reports" />}
        />
        <Route
          path="/settings"
          element={<Placeholder title="Settings" />}
        />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;