import { useEffect } from "react";
import {
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import MedicalImageViewer from "../components/viewer/MedicalImageViewer";
import DetectionSidebar from "../components/viewer/DetectionSidebar";
import useViewerStore from "../stores/viewerStore";

const ScanViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    scan,
    isLoading,
    error,
    fetchScan,
    resetViewer,
  } = useViewerStore();

  useEffect(() => {
    resetViewer();
    fetchScan(id);

    return () => {
      resetViewer();
    };
  }, [id, fetchScan, resetViewer]);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <LoaderCircle
            size={20}
            className="animate-spin"
          />
          Loading medical scan...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        {error}
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        Scan not found.
      </div>
    );
  }

  const regions =
    scan.analysis?.detectedRegions || [];

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(`/scans/${scan._id}`)
        }
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Scan Details
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Medical Image Viewer
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          {scan.scanType} · {scan.bodyPart}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <MedicalImageViewer
          imageUrl={scan.imageUrl}
          regions={regions}
        />

        <DetectionSidebar
          regions={regions}
        />
      </div>
    </div>
  );
};

export default ScanViewer;