import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScanDetailsView from "../components/scans/ScanDetails";
import useScanStore from "../stores/scanStore";

function ScanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const scan = useScanStore(
    (state) => state.selectedScan
  );

  const isLoading = useScanStore(
    (state) => state.isLoading
  );

  const error = useScanStore(
    (state) => state.error
  );

  const fetchScan = useScanStore(
    (state) => state.fetchScan
  );

  const removeScan = useScanStore(
    (state) => state.removeScan
  );

  useEffect(() => {
    fetchScan(id);
  }, [id, fetchScan]);

  const handleDelete = async (scanId) => {
    const confirmed = window.confirm(
      "Delete this scan and its associated AI analysis?"
    );

    if (!confirmed) {
      return;
    }

    await removeScan(scanId);
    navigate("/scans");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <ScanDetailsView
      scan={scan}
      onBack={() => navigate("/scans")}
      onDelete={handleDelete}
    />
  );
}

export default ScanDetails;