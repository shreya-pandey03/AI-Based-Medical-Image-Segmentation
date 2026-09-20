import api from "./api";

const getData = (response) => {
  return response.data?.data ?? response.data;
};

export const uploadAndAnalyzeScan = async (formData) => {
  const response = await api.post(
    "/scans/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return getData(response);
};

export const getScanById = async (id) => {
  const response = await api.get(`/scans/${id}`);

  return getData(response);
};

export const verifyDetectedRegion = async (
  regionId,
  data
) => {
  const response = await api.patch(
    `/scans/${regionId}/verify-region`,
    data
  );

  return getData(response);
};

export const deleteScan = async (id) => {
  const response = await api.delete(`/scans/${id}`);

  return getData(response);
};