import { Activity } from "lucide-react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="hidden w-1/2 items-center justify-center border-r border-slate-800 bg-slate-900/40 lg:flex">
        <div className="max-w-md px-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <Activity size={24} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-white">
                MedSegment
              </h1>
              <p className="text-xs text-slate-500">
                AI Medical Imaging
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight text-white">
            AI-powered medical image segmentation and analysis.
          </h2>

          <p className="mt-5 text-slate-400">
            Manage patients, analyze medical scans, visualize detected
            regions, and generate diagnostic reports from one platform.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;