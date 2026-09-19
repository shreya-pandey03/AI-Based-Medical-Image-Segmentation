import {
  Calendar,
  FileText,
  Phone,
  User,
} from "lucide-react";

function PatientDetails({ patient, scans = [] }) {
  if (!patient) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <User size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {patient.name}
            </h1>

            <p className="mt-1 text-slate-500">
              {patient.gender} · {patient.age} years
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-950 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone size={15} />
              Contact
            </div>

            <p className="mt-2 text-white">
              {patient.contactNumber || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={15} />
              Added
            </div>

            <p className="mt-2 text-white">
              {new Date(
                patient.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-950 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText size={15} />
            Medical Notes
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            {patient.medicalNotes || "No medical notes"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Scan History
        </h2>

        {scans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center">
            <p className="text-slate-500">
              No medical scans available for this patient.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">
                      {scan.scanType || "Medical Scan"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {scan.bodyPart || "Unknown body part"}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {scan.status || "Unknown"}
                  </span>
                </div>

                {scan.analysis?.overallFindings && (
                  <p className="mt-3 text-sm text-slate-400">
                    {scan.analysis.overallFindings}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;