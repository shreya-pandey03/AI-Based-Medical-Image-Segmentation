import { useEffect, useState } from "react";
import {
  FileImage,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScanCard from "../components/scans/ScanCard";
import ScanUpload from "../components/scans/ScanUpload";
import useScanStore from "../stores/scanStore";
import usePatientStore from "../stores/patientStore";

function Scans() {
  const navigate = useNavigate();

  const scans = useScanStore(
    (state) => state.scans
  );

  const isUploading = useScanStore(
    (state) => state.isUploading
  );

  const uploadScan = useScanStore(
    (state) => state.uploadScan
  );

  const fetchPatients = usePatientStore(
    (state) => state.fetchPatients
  );

  const patients = usePatientStore(
    (state) => state.patients
  );

  const [showUpload, setShowUpload] =
    useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleUpload = async (formData) => {
    try {
      const scan = await uploadScan(formData);

      setShowUpload(false);

      if (scan?._id) {
        navigate(`/scans/${scan._id}`);
      }
    } catch {
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Medical Scans
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload, analyze, and manage medical scans.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500"
        >
          <Plus size={18} />
          Upload Scan
        </button>
      </div>

      {scans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <FileImage
            size={40}
            className="mx-auto text-slate-700"
          />

          <h2 className="mt-4 text-lg font-semibold text-white">
            No scans yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Upload a medical scan to start AI analysis.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {scans.map((scan) => (
            <ScanCard
              key={scan._id}
              scan={scan}
              onView={(id) =>
                navigate(`/scans/${id}`)
              }
            />
          ))}
        </div>
      )}

      {showUpload && (
        <ScanUpload
          patients={patients}
          onSubmit={handleUpload}
          onClose={() => setShowUpload(false)}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}

export default Scans;