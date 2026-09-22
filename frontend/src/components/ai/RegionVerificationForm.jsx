import { useEffect, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import RegionStatus from "./RegionStatus";
import useAIStore from "../../stores/aiStore";
import {
  formatConfidence,
  getRegionLabel,
} from "../../utils/aiHelpers";

const RegionVerificationForm = ({
  region,
}) => {
  const {
    verifyRegion,
    isVerifying,
  } = useAIStore();

  const [feedback, setFeedback] =
    useState("");

  useEffect(() => {
    setFeedback(
      region?.doctorFeedback || ""
    );
  }, [region]);

  if (!region) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-500">
          Select a detected region to review.
        </p>
      </div>
    );
  }

  const handleVerify = async () => {
    await verifyRegion(region._id, {
      isDoctorVerified: true,
      doctorFeedback: feedback,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Selected Region
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            {getRegionLabel(region)}
          </h2>
        </div>

        <RegionStatus
          verified={region.isDoctorVerified}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Category
          </p>

          <p className="mt-1 text-sm text-white">
            {region.category || "Anomaly"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Confidence
          </p>

          <p className="mt-1 text-sm text-white">
            {formatConfidence(
              region.confidenceScore
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-950 p-4">
        <p className="text-xs text-slate-500">
          AI Clinical Note
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {region.clinicalNote ||
            "No clinical note available."}
        </p>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Doctor Feedback
        </label>

        <textarea
          value={feedback}
          onChange={(event) =>
            setFeedback(event.target.value)
          }
          rows={5}
          placeholder="Add clinical feedback..."
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={
          isVerifying ||
          region.isDoctorVerified
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isVerifying ? (
          <>
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
            Verifying...
          </>
        ) : region.isDoctorVerified ? (
          <>
            <CheckCircle2 size={17} />
            Region Verified
          </>
        ) : (
          "Verify Region"
        )}
      </button>
    </div>
  );
};

export default RegionVerificationForm;