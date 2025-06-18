// calonServices.js

import axios from "axios";

// Pastikan URL dasar untuk API Calon sudah benar
const API_URL = "http://localhost:5000/api/calon";

/**
 * Menambahkan data calon peserta baru.
 * @param {object} data - Objek berisi data calon.
 * @returns {Promise<object>}
 */
const createCalon = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

/**
 * Mengambil semua data calon peserta dari server.
 * @returns {Promise<Array>} - Langsung mengembalikan array data.
 */
const getAllCalon = async () => {
  const response = await axios.get(API_URL);
  // Langsung mengembalikan array data dari respons
  return response.data;
};

/**
 * Menghapus satu data calon berdasarkan ID.
 * @param {number} id - ID calon yang akan dihapus.
 * @returns {Promise<object>}
 */
const deleteCalon = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Menghapus beberapa data calon sekaligus.
 * @param {Array<number>} ids - Array berisi ID calon yang akan dihapus.
 * @returns {Promise<object>}
 */
const deleteBatchCalon = async (ids) => {
  // Memanggil endpoint baru yang sudah dibuat di Flask
  const response = await axios.post(`${API_URL}/batch-delete`, { ids });
  return response.data;
};


export const calonService = {
  createCalon,
  getAllCalon,
  deleteCalon,
  deleteBatchCalon, // Pastikan fungsi baru diekspor
};
