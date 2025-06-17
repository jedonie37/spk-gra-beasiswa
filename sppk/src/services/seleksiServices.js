import axios from "axios";

const API_URL = "http://localhost:5000/api/proses-seleksi"; // Ganti dengan URL backend yang sesuai

const prosesSeleksi = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getHasil = async () => {
  const response = await axios.get(`${API_URL}/hasil`);
  return response.data;
};

export const seleksiService = {
  prosesSeleksi,
  getHasil,
};
