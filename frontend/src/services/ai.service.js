import api from "./api";

const getData = (response) => {
  return response.data?.data ?? response.data;
};

export const getAIAnalysis = async (scanId) => {
  const response = await api.get(`/scans/${scanId}`);
  return getData(response);
};

export const verifyRegion = async (regionId, data) => {
  const response = await api.patch(
    `/scans/${regionId}/verify-region`,
    data
  );

  return getData(response);
};

