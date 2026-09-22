import { useState } from "react";
import DetectionItem from "./DetectionItem";
import useViewerStore from "../../stores/viewerStore";

const DetectionSidebar = ({
  regions = [],
}) => {
  const {
    selectedRegion,
    selectRegion,
    verifySelectedRegion,
  } = useViewerStore();

  const [feedback, setFeedback] =
    useState("");

  const handleVerify = async () => {
    if (!selectedRegion?._id) {
      return;
    }

    await verifySelectedRegion(
      selectedRegion._id,
      {
        isDoctorVerified: true,
        doctorFeedback: feedback,
      }
    );

    setFeedback("");
  };

  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-5">
        <h2 className="font-semibold text-white">
          AI Detections
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {regions.length} detected region
          {regions.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="max-h-[500px] space-y-3 overflow-y-auto p-4">
        {regions.length === 0 ? (
          <div className="rounded-xl bg-slate-950 p-5 text-center text-sm text-slate-500">
            No detected regions.
          </div>
        ) : (
          regions.map((region, index) => (
            <DetectionItem
              key={region._id || index}
              region={region}
              isSelected={
                selectedRegion?._id ===
                region._id
              }
              onClick={selectRegion}
            />
          ))
        )}
      </div>

      {selectedRegion && (
        <div className="border-t border-slate-800 p-4">
          <label className="mb-2 block text-sm text-slate-300">
            Doctor Feedback
          </label>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            rows={4}
            placeholder="Add clinical feedback..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <button
            onClick={handleVerify}
            disabled={
              selectedRegion.isDoctorVerified
            }
            className="mt-3 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedRegion.isDoctorVerified
              ? "Doctor Verified"
              : "Verify Region"}
          </button>
        </div>
      )}
    </aside>
  );
};

export default DetectionSidebar;