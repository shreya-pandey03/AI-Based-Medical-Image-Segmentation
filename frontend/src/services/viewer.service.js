import api from "./api";

const getData = (response) => {
  return response.data?.data ?? response.data;
};

export const getScanForViewer = async (id) => {
  const response = await api.get(`/scans/${id}`);
  return getData(response);
};

export const verifyRegion = async (regionId, data) => {
  const response = await api.patch(
    `/scans/${regionId}/verify-region`,
    data
  );

  return getData(response);
};