// hasilSeleksi.js

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchHasil = async () => {
      try {
        const result = await seleksiService.getHasil();
        // Asumsi 'result' sudah terurut berdasarkan ranking dari backend
        setHasil(result);
      } catch (error) {
        console.error("Gagal mengambil hasil seleksi", error);
      }
    };
    fetchHasil();
  }, []);

  const exportToCSV = () => {
    // Fungsi ekspor tetap mengekspor SEMUA data hasil
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

  // Logika untuk Paginasi Tabel
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hasil.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hasil.length / itemsPerPage);

  // --- PERUBAHAN DI SINI ---
  // Membuat array baru yang hanya berisi 10 data teratas untuk grafik
  const top10Hasil = hasil.slice(0, 10);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.title}>Hasil Seleksi Metode GRA</h2>
        <p style={styles.totalInfo}>Total Peserta: {hasil.length}</p>
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
            {currentItems.map((item, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.tdRank}>#{item.ranking}</td>
                <td style={styles.td}>{item.nama}</td>
                <td style={styles.td}>{item.nilai.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              style={currentPage === number ? styles.pageButtonActive : styles.pageButton}
            >
              {number}
            </button>
          ))}
        </div>
      )}

      {/* --- PERUBAHAN DI SINI --- */}
      {/* Grafik sekarang menggunakan data 'top10Hasil' */}
      {top10Hasil.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ textAlign: "center", color: "#34495e" }}>Grafik 10 Peringkat Teratas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10Hasil}>
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

// Objek styles tetap sama
const styles = {
  container: { maxWidth: 900, margin: "0 auto", backgroundColor: "white", padding: 24, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", },
  headerContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", },
  title: { fontSize: "24px", fontWeight: "600", marginBottom: 24, color: "#2c3e50", margin: 0, },
  totalInfo: { fontSize: 16, color: "#34495e", fontWeight: "500" },
  exportButton: { marginBottom: 16, padding: "10px 16px", fontSize: "14px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, display: "block", marginLeft: "auto", },
  tableWrapper: { overflowX: "auto", },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 16, },
  th: { backgroundColor: "#ecf0f1", padding: "12px", textAlign: "center", borderBottom: "2px solid #bdc3c7", fontWeight: 600, },
  td: { padding: "12px", textAlign: "center", borderBottom: "1px solid #eee", color: "#2c3e50", },
  tdRank: { padding: "12px", textAlign: "center", borderBottom: "1px solid #eee", color: "#2980b9", fontWeight: "bold", },
  row: { transition: "background 0.2s", },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  pageButton: {
    margin: '0 5px',
    padding: '8px 12px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  pageButtonActive: {
    margin: '0 5px',
    padding: '8px 12px',
    border: '1px solid #2980b9',
    backgroundColor: '#2980b9',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '4px'
  }
};

export default HasilSeleksi;