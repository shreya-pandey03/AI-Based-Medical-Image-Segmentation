import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <Topbar />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;