import React, { useEffect, useState } from "react";
import { historyService } from "../services/historyServices";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await historyService.getHistory();
        setHistory(result);
      } catch (error) {
        console.error("Gagal mengambil history", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Riwayat Proses Seleksi</h2>
      {history.length > 0 ? (
        <div style={styles.cardContainer}>
          {history.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.date}>{item.tanggal}</span>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.keterangan}>{item.keterangan || "–"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.empty}>Belum ada riwayat seleksi.</p>
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
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  date: {
    fontWeight: "bold",
    color: "#2980b9",
  },
  cardBody: {
    fontSize: 15,
    color: "#333",
  },
  keterangan: {
    margin: 0,
  },
  empty: {
    fontStyle: "italic",
    color: "#888",
  },
};

export default History;
