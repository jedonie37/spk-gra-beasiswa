import React, { useState, useRef } from "react";
import { calonService } from "../services/calonServices";
import axios from "axios";

function InputData() {
  const [nama, setNama] = useState("");
  const [k1, setK1] = useState("");
  const [k2, setK2] = useState("");
  const [k3, setK3] = useState("");
  const [k4, setK4] = useState("");
  const [k5, setK5] = useState("");
  const [k6, setK6] = useState("");
  const [k7, setK7] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nama,
      k1: parseFloat(k1),
      k2: parseFloat(k2),
      k3: parseFloat(k3),
      k4: parseInt(k4),
      k5: parseInt(k5),
      k6: parseFloat(k6),
      k7: parseFloat(k7),
    };

    try {
      await calonService.createCalon(data);
      setMessage("✅ Data calon peserta berhasil disimpan!");
      setNama("");
      setK1(""); setK2(""); setK3("");
      setK4(""); setK5(""); setK6(""); setK7("");
    } catch (error) {
      setMessage("❌ Gagal menyimpan data calon peserta.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Pilih file CSV terlebih dahulu.");
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
      alert("✅ " + res.data.message);
    } catch (err) {
      alert("❌ Gagal mengunggah file CSV.");
      console.error(err);
    }
  };

  return (
    <div style={styles.content}>
      <h2>Input Data Calon Peserta</h2>

      <div style={{ marginBottom: 30 }}>
        <h4>Import Data dari CSV</h4>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ marginBottom: 10 }}
          />
          <br />
          <button type="submit" style={styles.uploadButton}>
            Upload CSV
          </button>
        </form>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required style={styles.input} />
        <input type="number" step="0.01" placeholder="IPK" value={k1} onChange={(e) => setK1(e.target.value)} required style={styles.input} />
        <input type="number" placeholder="Pendapatan Keluarga" value={k2} onChange={(e) => setK2(e.target.value)} required style={styles.input} />
        <input type="number" placeholder="Jumlah Tanggungan" value={k3} onChange={(e) => setK3(e.target.value)} required style={styles.input} />
        <input type="number" placeholder="Pengeluaran Bulanan" value={k4} onChange={(e) => setK4(e.target.value)} required style={styles.input} />

        <select value={k5} onChange={(e) => setK5(e.target.value)} required style={styles.input}>
          <option value="">Status Bantuan Pemerintah</option>
          <option value="1">Menerima</option>
          <option value="0">Tidak Menerima</option>
        </select>

        <select value={k6} onChange={(e) => setK6(e.target.value)} required style={styles.input}>
          <option value="">Riwayat Beasiswa</option>
          <option value="1">Pernah</option>
          <option value="0">Belum Pernah</option>
        </select>

        <input type="number" placeholder="Daya Listrik (Watt)" value={k7} onChange={(e) => setK7(e.target.value)} required style={styles.input} />

        <button type="submit" style={styles.button}>Simpan</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  content: {
    maxWidth: 800,
    margin: "0 auto",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 6,
    boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
  },
  input: {
    marginBottom: 20,
    padding: "12px 10px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  uploadButton: {
    padding: "10px 18px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "600",
  },
  button: {
    padding: "12px",
    backgroundColor: "#2980b9",
    border: "none",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    borderRadius: 4,
  },
};

export default InputData;
