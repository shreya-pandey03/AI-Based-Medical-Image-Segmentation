import { Patient } from "../models/patient.model.js";
import { MedicalScan } from "../models/medicalScan.model.js";
import { ApiError } from "../util/apiError.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { ApiResponse } from "../util/apiResponse.js";

// create a patient
const createPatient = asyncHandler(async (req, res) => {
  // Step 1) Recieve the patient name, age, gender,contact no, medicalNotes from req.body
  // Step 2) check whether the fileds are empty, if yes then throw error
  // Step 3) if not then create the patient
  // Step 4) return the res

  const { name, age, gender, contactNumber, medicalNotes } = req.body;

  if (!name || !age || !gender) {
    throw new ApiError(404, "Patient credentials are required");
  }

  const patient = await Patient.create({
    doctorId: req.user._id,
    name: name.trim(),
    age: Number(age),
    gender,
    contactNumber: contactNumber || "",
    medicalNotes: medicalNotes || "",
  });

  if (!patient) {
    throw new ApiError(500, "Error while savong the patient into database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Patient created successsfully."));
});

// get all patient by logged in doctor
const getDoctorPatients = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const query = { doctorId: req.user._id };

  if (search) {
    query.name = {
      $regex: search.trim(),
      $options: "i",
    };
    // $regex means pattern matching.
    //options: "i" means case-insensitive.
  }

  const patients = await Patient.find(query).sort({ createdAt: -1 });
  // sort({ createdAt: -1 }: Sort by createdAt in descending order. Newest patient first

  return res
    .status(200)
    .json(new ApiResponse(200, patients, "Patients retrieved successfully"));
});

// get single patient details + all associated medical scans
const getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "Patient id is required");
  }

  const patient = await Patient.findOne({
    _id: id,
    doctorId: req.user._id,
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const scans = await MedicalScan.find({ patientId: id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { patient, scans },
        "Patient profile and scan history retrieved successfully",
      ),
    );
});
// update patient details

const updatePatient = asyncHandler(async (req, res) => {
  // Step 1) Get the patient id form query.params
  // Step 2) Get the field to update form req.body
  // Step 3) By using id and doctorId find the patient and update its field
  // Step 4) if patient not found throw new api error
  // Step 5) return the res
  const { id } = req.params;
  const { name, age, gender, contactNumber, medicalNotes } = req.body;

  if (!name && !age && !gender) {
    throw new ApiError("At least one field is required to update ");
  }

  const patient = await Patient.findOneAndUpdate(
    { _id: id, doctorId: req.user._id },
    {
      $set: {
        // name:name
        // age:age
        // gender:gender
        // contactNumber : contactNumber
        // medicalNotes: medicalNotes
        ...(name && { name: name.trim() }),
        ...(age && { age: Number(age) }),
        ...(gender && { gender }),
        ...(contactNumber !== undefined && { contactNumber }),
        ...(medicalNotes !== undefined && { medicalNotes }),
      },
    },
    { new: true },
  );

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient updated successfully"));
});

// delete a patient

const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findOneAndDelete({
    _id: id,
    doctorId: req.user._id,
  });

  if (!patient) {
    throw new ApiError(404, "Patient not found or unauthorized to delete.");
  }

  // Delete all linked scans
  await MedicalScan.deleteMany({ patientId: id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Patient and associated records deleted successfully",
      ),
    );
});

export {
  createPatient,
  getDoctorPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
