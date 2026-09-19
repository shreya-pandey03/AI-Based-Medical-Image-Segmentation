import { Eye, Pencil, Trash2 } from "lucide-react";

function PatientTable({
  patients,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-slate-800 bg-slate-900/80">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">Patient</th>
              <th className="px-5 py-4">Age</th>
              <th className="px-5 py-4">Gender</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {patients.map((patient) => (
              <tr
                key={patient._id}
                className="transition hover:bg-slate-800/40"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-white">
                      {patient.name}
                    </p>
                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      {patient.medicalNotes ||
                        "No medical notes"}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-400">
                  {patient.age}
                </td>

                <td className="px-5 py-4 text-sm text-slate-400">
                  {patient.gender}
                </td>

                <td className="px-5 py-4 text-sm text-slate-400">
                  {patient.contactNumber || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-400">
                  {new Date(
                    patient.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(patient._id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEdit(patient)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(patient)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientTable;