import React, { useEffect, useState } from "react";
import { seleksiService } from "../services/seleksiServices";
import { calonService } from "../services/calonServices";
import axios from "axios";

function ProsesSeleksi() {
  const [message, setMessage] = useState("");
  const [calonList, setCalonList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/calon");
      setCalonList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data calon peserta:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProses = async () => {
    try {
      await seleksiService.prosesSeleksi();
      setMessage("Proses seleksi berhasil!");
    } catch (error) {
      setMessage("Gagal melakukan proses seleksi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await calonService.deleteCalon(id);
      setCalonList(calonList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus calon peserta", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Data Calon Peserta</h2>
      {calonList.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>IPK</th>
                <th style={styles.th}>Pendapatan</th>
                <th style={styles.th}>Tanggungan</th>
                <th style={styles.th}>Pengeluaran</th>
                <th style={styles.th}>Bantuan</th>
                <th style={styles.th}>Beasiswa</th>
                <th style={styles.th}>Daya Listrik</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {calonList.map((calon) => (
                <tr key={calon.id} style={styles.row}>
                  <td style={styles.td}>{calon.nama}</td>
                  <td style={styles.td}>{calon.k1.toFixed(2)}</td>
                  <td style={styles.td}>{calon.k2}</td>
                  <td style={styles.td}>{calon.k3}</td>
                  <td style={styles.td}>{calon.k4}</td>
                  <td style={styles.td}>{calon.k5 === 1 ? "Menerima" : "Tidak"}</td>
                  <td style={styles.td}>{calon.k6 === 1 ? "Pernah" : "Belum"}</td>
                  <td style={styles.td}>{calon.k7} W</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(calon.id)}
                      style={styles.deleteButton}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: "#888" }}>Tidak ada data calon peserta.</p>
      )}
  
      <button onClick={handleProses} style={styles.button}>
        Jalankan Proses Seleksi
      </button>
      {message && (
        <p style={{ marginTop: 12, color: message.includes("Gagal") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
  
}

const styles = {
  container: {
    maxWidth: 1000,
    margin: "0 auto",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
    color: "#2c3e50",
    textAlign: "center",
  },
  tableWrapper: {
    overflowX: "auto",
    marginBottom: 24,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
  },
  th: {
    backgroundColor: "#ecf0f1",
    padding: "12px",
    textAlign: "center",
    borderBottom: "2px solid #bdc3c7",
    fontWeight: 600,
  },
  td: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
    color: "#2c3e50",
  },
  row: {
    transition: "background 0.2s",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#2980b9",
    border: "none",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default ProsesSeleksi;
