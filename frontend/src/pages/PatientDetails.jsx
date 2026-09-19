import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PatientDetailsView from "../components/patients/PatientDetails";
import usePatientStore from "../stores/patientStore";

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const patient = usePatientStore(
    (state) => state.selectedPatient
  );

  const scans = usePatientStore(
    (state) => state.patientScans
  );

  const isLoading = usePatientStore(
    (state) => state.isLoading
  );

  const error = usePatientStore(
    (state) => state.error
  );

  const fetchPatient = usePatientStore(
    (state) => state.fetchPatient
  );

  useEffect(() => {
    fetchPatient(id);
  }, [id, fetchPatient]);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/patients")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Patients
      </button>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5 text-red-400">
          {error}
        </div>
      ) : (
        <PatientDetailsView
          patient={patient}
          scans={scans}
        />
      )}
    </div>
  );
}

export default PatientDetails;