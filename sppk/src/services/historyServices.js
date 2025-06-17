import axios from "axios";

const API_URL = "http://localhost:5000/api/history"; // Ganti dengan URL backend yang sesuai

const getHistory = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const historyService = {
  getHistory,
};
