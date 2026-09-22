import { getSeverityClasses } from "../../utils/aiHelpers";

const AISeverityBadge = ({ severity }) => {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getSeverityClasses(
        severity
      )}`}
    >
      {severity || "Unknown"}
    </span>
  );
};

export default AISeverityBadge;