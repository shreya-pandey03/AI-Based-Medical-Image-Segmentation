import { getBoxStyle } from "../../utils/imageCoordinates";

const DetectionOverlay = ({
  regions = [],
  imageWidth,
  imageHeight,
  selectedRegion,
  onSelectRegion,
}) => {
  if (
    !imageWidth ||
    !imageHeight ||
    regions.length === 0
  ) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      {regions.map((region, index) => {
        const style = getBoxStyle(
          region.box2d,
          imageWidth,
          imageHeight
        );

        if (!style) {
          return null;
        }

        const isSelected =
          selectedRegion?._id === region._id;

        return (
          <button
            key={region._id || index}
            type="button"
            onClick={() =>
              onSelectRegion(region)
            }
            className={`pointer-events-auto absolute border-2 ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-red-500 bg-red-500/5"
            }`}
            style={{
              left: style.left,
              top: style.top,
              width: style.width,
              height: style.height,
            }}
          >
            <span
              className={`absolute -top-7 left-0 whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${
                isSelected
                  ? "bg-yellow-400 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              {region.label ||
                region.category ||
                "Anomaly"}{" "}
              {region.confidenceScore
                ? `${Math.round(
                    region.confidenceScore * 100
                  )}%`
                : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DetectionOverlay;