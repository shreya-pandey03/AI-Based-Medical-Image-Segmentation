export const getSeverityClasses = (severity) => {
  switch (severity) {
    case "Normal":
      return "border-green-500/20 bg-green-500/10 text-green-400";

    case "Low":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "Moderate":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

    case "High":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
};

export const formatConfidence = (confidence) => {
  if (confidence === undefined || confidence === null) {
    return "0%";
  }

  const value =
    confidence <= 1
      ? confidence * 100
      : confidence;

  return `${Math.round(value)}%`;
};

export const getVerificationStatus = (region) => {
  if (region?.isDoctorVerified) {
    return "Verified";
  }

  return "Pending Review";
};

export const getRegionLabel = (region) => {
  return (
    region?.label ||
    region?.category ||
    "Detected abnormality"
  );
};