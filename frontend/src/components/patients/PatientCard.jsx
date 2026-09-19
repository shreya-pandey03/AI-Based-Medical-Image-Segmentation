import {
  Calendar,
  ChevronRight,
  FileText,
  Phone,
  User,
} from "lucide-react";

function PatientCard({ patient, onView }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <User size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {patient.name}
            </h3>

            <p className="text-sm text-slate-500">
              {patient.gender} · {patient.age} years
            </p>
          </div>
        </div>

        <button
          onClick={() => onView(patient._id)}
          className="text-slate-400 transition hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {patient.contactNumber && (
          <div className="flex items-center gap-2 text-slate-400">
            <Phone size={15} />
            {patient.contactNumber}
          </div>
        )}

        <div className="flex items-center gap-2 text-slate-400">
          <FileText size={15} />
          {patient.medicalNotes || "No medical notes"}
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={15} />
          {new Date(patient.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default PatientCard;