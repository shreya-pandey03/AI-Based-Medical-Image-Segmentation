import api from "./api";

const getData = (response) => {
  return response.data?.data ?? response.data;
};

export const registerUser = async (formData) => {
  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return getData(response);
};

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);

  return getData(response);
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");

  return getData(response);
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");

  return getData(response);
};

export const refreshAccessToken = async () => {
  const response = await api.post("/users/refresh-token");

  return getData(response);
};

export const changePassword = async (data) => {
  const response = await api.post("/users/change-password", data);

  return getData(response);
};

export const updateAccount = async (data) => {
  const response = await api.patch("/users/update-account", data);

  return getData(response);
};

export const getPatientsProfile = async () => {
  const response = await api.get("/users/patients-profile");

  return getData(response);
};