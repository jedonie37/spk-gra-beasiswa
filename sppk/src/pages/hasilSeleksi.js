import React, { useEffect, useState } from "react";
import { seleksiService } from "../services/seleksiServices";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function HasilSeleksi() {
  const [hasil, setHasil] = useState([]);

  useEffect(() => {
    const fetchHasil = async () => {
      try {
        const result = await seleksiService.getHasil();
        setHasil(result);
      } catch (error) {
        console.error("Gagal mengambil hasil seleksi", error);
      }
    };

    fetchHasil();
  }, []);

  const exportToCSV = () => {
    if (!hasil || hasil.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const header = ["Ranking", "Nama", "Nilai GRA"];
    const rows = hasil.map((row) => [row.ranking, row.nama, row.nilai.toFixed(4)]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hasil_seleksi_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Hasil Seleksi Metode GRA</h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p><strong>Total Peserta:</strong> {hasil.length}</p>
        
      </div>
      <button onClick={exportToCSV} style={styles.exportButton}>
        📥 Unduh CSV
      </button>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ranking</th>
              <th style={styles.th}>Nama</th>
              <th style={styles.th}>Nilai GRA</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map((item, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.tdRank}>#{item.ranking}</td>
                <td style={styles.td}>{item.nama}</td>
                <td style={styles.td}>{item.nilai.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasil.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ textAlign: "center", color: "#34495e" }}>Grafik Nilai GRA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hasil}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama" angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="nilai" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasil.length === 0 && (
        <p style={{ marginTop: 16, color: "#888" }}>Belum ada hasil seleksi.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: 24,
    color: "#2c3e50",
    textAlign: "center",
  },
  exportButton: {
    marginBottom: 16,
    padding: "10px 16px",
    fontSize: "14px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    display: "block",
    marginLeft: "auto",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 16,
  },
  th: {
    backgroundColor: "#ecf0f1",
    padding: "12px",
    textAlign: "center",
    borderBottom: "2px solid #bdc3c7",
    fontWeight: 600,
  },
  td: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
    color: "#2c3e50",
  },
  tdRank: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
    color: "#2980b9",
    fontWeight: "bold",
  },
  row: {
    transition: "background 0.2s",
  },
};

export default HasilSeleksi;
