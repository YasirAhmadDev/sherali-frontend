import api from "@/api/axios";

export const getAccidents = async (params = {}) => {
  const { data } = await api.get("/accidents", { params });
  return data; // { data: [...], pagination: { page, limit, total, pages } }
};

export const getAccident = async (id) => {
  const { data } = await api.get(`/accidents/${id}`);
  return data.accident;
};

export const createAccident = async (payload) => {
  const { data } = await api.post("/accidents", payload);
  return data.accident;
};

export const updateAccident = async (id, payload) => {
  const { data } = await api.put(`/accidents/${id}`, payload);
  return data.accident;
};

export const deleteAccident = async (id) => {
  await api.delete(`/accidents/${id}`);
};

// files = array of File objects (backend field name is "photos")
export const uploadPhotos = async (id, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));
  const { data } = await api.post(`/accidents/${id}/photos`, formData);
  return data.photos;
};

export const deletePhoto = async (id, filename) => {
  await api.delete(`/accidents/${id}/photos/${filename}`);
};

// Photos are private, so they are downloaded with the login token and shown as a blob
export const fetchPhotoBlob = async (filename) => {
  const { data } = await api.get(`/photos/${filename}`, { responseType: "blob" });
  return data;
};