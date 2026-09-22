import {
  CheckCircle,
  CircleAlert,
} from "lucide-react";

const DetectionItem = ({
  region,
  isSelected,
  onClick,
}) => {
  const confidence = region.confidenceScore
    ? Math.round(
        region.confidenceScore * 100
      )
    : 0;

  return (
    <button
      onClick={() => onClick(region)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        isSelected
          ? "border-blue-500 bg-blue-500/10"
          : "border-slate-800 bg-slate-950 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start gap-3">
        {region.isDoctorVerified ? (
          <CheckCircle
            size={19}
            className="mt-0.5 text-green-400"
          />
        ) : (
          <CircleAlert
            size={19}
            className="mt-0.5 text-yellow-400"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium text-white">
              {region.label ||
                region.category ||
                "Anomaly"}
            </h3>

            <span className="text-xs text-slate-400">
              {confidence}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-red-500"
              style={{
                width: `${confidence}%`,
              }}
            />
          </div>

          <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-400">
            {region.clinicalNote ||
              "No clinical note available."}
          </p>

          {region.isDoctorVerified && (
            <span className="mt-3 inline-block text-xs text-green-400">
              Doctor verified
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default DetectionItem;