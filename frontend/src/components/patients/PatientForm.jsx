import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  contactNumber: "",
  medicalNotes: "",
};

function PatientForm({
  patient,
  onSubmit,
  onClose,
  isSubmitting,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || "",
        age: patient.age || "",
        gender: patient.gender || "",
        contactNumber: patient.contactNumber || "",
        medicalNotes: patient.medicalNotes || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [patient]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      contactNumber: form.contactNumber.trim(),
      medicalNotes: form.medicalNotes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {patient ? "Edit Patient" : "Add Patient"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {patient
                ? "Update patient information"
                : "Create a new patient profile"}
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
            <label className="mb-2 block text-sm text-slate-300">
              Patient Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter patient name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Age
              </label>

              <input
                name="age"
                type="number"
                min="0"
                value={form.age}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                placeholder="Age"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Contact Number
            </label>

            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter contact number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Medical Notes
            </label>

            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              rows="4"
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Enter medical notes"
            />
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
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : patient
                  ? "Update Patient"
                  : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;