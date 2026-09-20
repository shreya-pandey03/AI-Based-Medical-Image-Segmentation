import { Calendar, Eye, FileImage } from "lucide-react";
import ScanStatus from "./ScanStatus";

function ScanCard({ scan, onView }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="aspect-video bg-slate-950">
        {scan.imageUrl ? (
          <img
            src={scan.imageUrl}
            alt={scan.scanType}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileImage
              size={40}
              className="text-slate-700"
            />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">
              {scan.scanType}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {scan.bodyPart || "General"}
            </p>
          </div>

          <ScanStatus status={scan.status} />
        </div>

        {scan.patientId && (
          <p className="mt-4 text-sm text-slate-400">
            Patient:{" "}
            <span className="text-slate-300">
              {scan.patientId.name ||
                scan.patientId.patientName ||
                "Unknown"}
            </span>
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} />
            {new Date(
              scan.createdAt
            ).toLocaleDateString()}
          </div>

          <button
            onClick={() => onView(scan._id)}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Eye size={15} />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanCard;