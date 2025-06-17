import React, { useState } from "react";
import axios from "axios";

function ImportData() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Silakan pilih file CSV terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/calon/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message || "Import berhasil.");
    } catch (error) {
      setMessage("Gagal import CSV: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={styles.content}>
      <h2>Import Data Calon Peserta dari CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  content: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  input: {
    display: "block",
    marginBottom: 16,
    padding: 8,
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default ImportData;
