import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import ScanStatus from "./ScanStatus";
import { Brain, Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";

function ScanDetails({ scan, onBack, onDelete }) {
  if (!scan) {
    return null;
  }

  const regions = scan.analysis?.detectedRegions || [];
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Scans
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="aspect-square bg-black">
            <img
              src={scan.imageUrl}
              alt={scan.scanType}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {scan.scanType}
                </h1>

                <p className="mt-1 text-slate-500">
                  {scan.bodyPart || "General"}
                </p>
              </div>

              <ScanStatus status={scan.status} />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase text-slate-500">Patient</p>

                <p className="mt-1 text-white">
                  {scan.patientId?.name ||
                    scan.patientId?.patientName ||
                    "No patient"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Uploaded</p>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                  <Calendar size={15} />
                  {new Date(scan.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white">AI Analysis</h2>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {scan.analysis?.overallFindings || "No findings available."}
            </p>

            {scan.analysis?.severityLevel && (
              <div className="mt-4">
                <span className="text-xs text-slate-500">Severity</span>

                <p className="mt-1 font-medium text-white">
                  {scan.analysis.severityLevel}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white">
              Detected Regions
            </h2>

            {regions.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No detected regions.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {regions.map((region) => (
                  <div key={region._id} className="rounded-xl bg-slate-950 p-4">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{region.label}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {region.category}
                        </p>
                      </div>

                      <span className="text-sm text-blue-400">
                        {Math.round((region.confidenceScore || 0) * 100)}%
                      </span>
                    </div>

                    {region.clinicalNote && (
                      <p className="mt-3 text-sm text-slate-400">
                        {region.clinicalNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/scans/${scan._id}/viewer`)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
          >
            <Eye size={17} />
            Open Medical Viewer
          </button>

          <button
            onClick={() => navigate(`/scans/${scan._id}/ai-analysis`)}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-medium text-white hover:bg-purple-500"
          >
            <Brain size={17} />
            AI Analysis
          </button>

          <button
            onClick={() => onDelete(scan._id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-950/40"
          >
            <Trash2 size={17} />
            Delete Scan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanDetails;
