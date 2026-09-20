function ScanStatus({ status }) {
  const styles = {
    uploaded:
      "bg-slate-800 text-slate-300",
    processing:
      "bg-yellow-500/10 text-yellow-400",
    completed:
      "bg-green-500/10 text-green-400",
    failed:
      "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || styles.uploaded
      }`}
    >
      {status || "uploaded"}
    </span>
  );
}

export default ScanStatus;