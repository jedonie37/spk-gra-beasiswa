import axios from "axios";

const API_URL = "http://localhost:5000/api/calon"; // Ganti dengan URL backend yang sesuai

const createCalon = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

const getAll = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const deleteCalon = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const calonService = {
  createCalon,
  getAll,
  deleteCalon  // ← pastikan ini ditambahkan
};

