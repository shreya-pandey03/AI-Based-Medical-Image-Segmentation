import api from "./api";

const getData = (response) => {
  return response.data?.data ?? response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post(
    "/patient/create-Patient",
    patientData
  );

  return getData(response);
};

export const getDoctorPatients = async (search = "") => {
  const response = await api.get(
    "/patient/get-Doctor-Patient",
    {
      params: search ? { search } : {},
    }
  );

  return getData(response);
};

export const getPatientById = async (id) => {
  const response = await api.get(
    `/patient/${id}/get-Patient`
  );

  return getData(response);
};

export const updatePatient = async (id, patientData) => {
  const response = await api.patch(
    `/patient/${id}/update-Patient`,
    patientData
  );

  return getData(response);
};

export const deletePatient = async (id) => {
  const response = await api.delete(
    `/patient/${id}/delete-Patient`
  );

  return getData(response);
};