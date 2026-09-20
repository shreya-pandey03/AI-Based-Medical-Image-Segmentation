import { useState } from "react";
import { FileImage, Upload, X } from "lucide-react";

const scanTypes = [
  "Chest X-Ray",
  "Brain MRI",
  "CT Scan",
  "Skin Lesion",
  "Hips X-Ray",
  "Other",
];

function ScanUpload({ patients, onSubmit, onClose, isUploading }) {
  const [patientId, setPatientId] = useState("");
  const [scanType, setScanType] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !scanType) {
      return;
    }

    const formData = new FormData();

    formData.append("scanImage", file);
    formData.append("scanType", scanType);
    formData.append("bodyPart", bodyPart);

    if (patientId) {
      formData.append("patientId", patientId);
    }

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Upload Medical Scan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload an image for AI analysis.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Patient</label>

            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="">No patient selected</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Scan Type
            </label>

            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="">Select scan type</option>

              {scanTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Body Part
            </label>

            <input
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              placeholder="e.g. Chest, Brain, Hip"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Scan Image
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 px-6 py-8 text-center hover:border-blue-500">
              {file ? (
                <>
                  <FileImage size={32} className="text-blue-400" />

                  <p className="mt-3 text-sm text-white">{file.name}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-slate-600" />

                  <p className="mt-3 text-sm text-slate-300">
                    Click to upload scan
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Select a medical image file
                  </p>
                </>
              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-700 px-4 py-3 font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading || !file}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? "Analyzing..." : "Upload & Analyze"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScanUpload;
