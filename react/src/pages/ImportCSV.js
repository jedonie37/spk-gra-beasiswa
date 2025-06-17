import React, { useState } from "react";
import axios from "axios";

function ImportCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("❗ Silakan pilih file CSV terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/calon/import", formData);
      setMessage("✅ File berhasil diupload dan data disimpan.");
    } catch (error) {
      setMessage("❌ Gagal upload: " + (error.response?.data?.message || "Error tidak diketahui"));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Import Data Calon Peserta (CSV)</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        style={styles.input}
      />
      <button onClick={handleUpload} style={styles.button}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default ImportCSV;
