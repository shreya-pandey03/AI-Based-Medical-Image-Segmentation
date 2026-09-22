import DetectionItem from "../viewer/DetectionItem";
import RegionVerificationForm from "./RegionVerificationForm";

import useAIStore from "../../stores/aiStore";

const DetectionReviewPanel = ({
  regions = [],
}) => {
  const {
    selectedRegion,
    selectRegion,
  } = useAIStore();

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="font-semibold text-white">
            Detected Regions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review AI detected abnormalities.
          </p>
        </div>

        <div className="max-h-[650px] space-y-3 overflow-y-auto p-4">
          {regions.length === 0 ? (
            <div className="rounded-xl bg-slate-950 p-6 text-center">
              <p className="text-sm text-slate-500">
                No abnormalities detected.
              </p>
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
      </div>

      <RegionVerificationForm
        region={selectedRegion}
      />
    </div>
  );
};

export default DetectionReviewPanel;
