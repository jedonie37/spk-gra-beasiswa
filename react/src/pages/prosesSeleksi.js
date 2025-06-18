// prosesSeleksi.js

import React, { useEffect, useState } from "react";
import { seleksiService } from "../services/seleksiServices";
import { calonService } from "../services/calonServices";

function ProsesSeleksi() {
  const [message, setMessage] = useState("");
  const [calonList, setCalonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State untuk mode seleksi hapus
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    try {
      // Panggil service yang langsung mengembalikan array data
      const dataDariServer = await calonService.getAllCalon();
      
      // PERBAIKAN: Pastikan data yang diterima adalah array sebelum di-set
      if (Array.isArray(dataDariServer)) {
        setCalonList(dataDariServer);
      } else {
        console.error("Data yang diterima dari server bukan array:", dataDariServer);
        setCalonList([]); // Fallback ke array kosong
      }
    } catch (error) {
      console.error("Gagal mengambil data calon peserta:", error);
      setCalonList([]); // Set ke array kosong jika ada error jaringan
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProses = async () => {
    setMessage("Memproses...");
    try {
      await seleksiService.prosesSeleksi();
      setMessage("Proses seleksi berhasil!");
    } catch (error) {
      setMessage("Gagal melakukan proses seleksi.");
    }
  };

  // --- Logika Baru untuk Seleksi Hapus ---
  const handleSelectOne = (id) => {
    setSelectedIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(prevId => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleSelectAllOnPage = (event) => {
    const pageIds = currentItems.map(item => item.id);
    if (event.target.checked) {
      setSelectedIds(prevIds => [...new Set([...prevIds, ...pageIds])]);
    } else {
      setSelectedIds(prevIds => prevIds.filter(id => !pageIds.includes(id)));
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedIds.length === 0) {
      setMessage("Pilih setidaknya satu data untuk dihapus.");
      return;
    }
    setMessage("Menghapus data...");
    try {
      await calonService.deleteBatchCalon(selectedIds);
      setMessage(`${selectedIds.length} data berhasil dihapus.`);
      fetchData(); // Muat ulang data
      setSelectionMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Gagal menghapus data batch", error);
      setMessage("Gagal menghapus data yang dipilih.");
    }
  };

  // --- Logika Paginasi ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = calonList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(calonList.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const areAllOnPageSelected = currentItems.length > 0 && currentItems.every(item => selectedIds.includes(item.id));

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.title}>Data Calon Peserta</h2>
        <p style={styles.totalInfo}>Total Calon: {calonList.length}</p>
      </div>

      {currentItems.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {selectionMode && (
                  <th style={styles.thCheckbox}>
                    <input
                      type="checkbox"
                      checked={areAllOnPageSelected}
                      onChange={handleSelectAllOnPage}
                      title="Pilih semua di halaman ini"
                    />
                  </th>
                )}
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>IPK</th>
                <th style={styles.th}>Pendapatan</th>
                <th style={styles.th}>Tanggungan</th>
                <th style={styles.th}>Pengeluaran</th>
                <th style={styles.th}>Bantuan</th>
                <th style={styles.th}>Beasiswa</th>
                <th style={styles.th}>Daya Listrik</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((calon) => (
                <tr key={calon.id} style={selectedIds.includes(calon.id) ? styles.rowSelected : styles.row}>
                  {selectionMode && (
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(calon.id)}
                        onChange={() => handleSelectOne(calon.id)}
                      />
                    </td>
                  )}
                  <td style={styles.td}>{calon.nama}</td>
                  <td style={styles.td}>{calon.k1.toFixed(2)}</td>
                  <td style={styles.td}>{calon.k2}</td>
                  <td style={styles.td}>{calon.k3}</td>
                  <td style={styles.td}>{calon.k4}</td>
                  <td style={styles.td}>{calon.k5 === 1 ? "Menerima" : "Tidak"}</td>
                  <td style={styles.td}>{calon.k6 === 1 ? "Pernah" : "Belum"}</td>
                  <td style={styles.td}>{calon.k7} W</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: "#888", textAlign: 'center' }}>Tidak ada data calon peserta.</p>
      )}

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

      <div style={styles.actionContainer}>
        {selectionMode ? (
          <>
            <button onClick={handleConfirmDelete} style={styles.deleteButtonConfirm} disabled={selectedIds.length === 0}>
              Konfirmasi Hapus ({selectedIds.length} data)
            </button>
            <button onClick={() => { setSelectionMode(false); setSelectedIds([]); }} style={{...styles.button, ...styles.cancelButton}}>
              Batal
            </button>
          </>
        ) : (
          <>
            <button onClick={handleProses} style={styles.button}>
              Jalankan Proses Seleksi
            </button>
            <button onClick={() => setSelectionMode(true)} style={{ ...styles.button, ...styles.deleteButtonInitiate }}>
              Hapus Data
            </button>
          </>
        )}
      </div>

      {message && (
        <p style={{ marginTop: 16, textAlign: 'center', fontWeight: '500', color: message.includes("Gagal") ? "#e74c3c" : "#27ae60" }}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 1200, margin: "0 auto", backgroundColor: "white", padding: 24, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", },
  headerContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, },
  title: { fontSize: 22, fontWeight: "600", color: "#2c3e50", margin: 0, },
  totalInfo: { fontSize: 16, color: "#34495e", fontWeight: "500" },
  tableWrapper: { overflowX: "auto", marginBottom: 24, },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 15, },
  th: { backgroundColor: "#ecf0f1", padding: "12px", textAlign: "center", borderBottom: "2px solid #bdc3c7", fontWeight: 600, },
  td: { padding: "10px", textAlign: "center", borderBottom: "1px solid #eee", color: "#2c3e50", },
  row: { transition: "background 0.2s", },
  rowSelected: { backgroundColor: '#e9f5ff' },
  thCheckbox: { width: '50px', padding: '12px', textAlign: 'center', backgroundColor: '#ecf0f1', borderBottom: '2px solid #bdc3c7' },
  // --- PERBAIKAN DI SINI ---
  button: { 
    padding: "12px 20px", 
    backgroundColor: "#2980b9", // Warna biru ditambahkan kembali
    border: "none", 
    color: "white", 
    fontWeight: "600", 
    fontSize: 16, 
    borderRadius: 4, 
    cursor: "pointer", 
    transition: 'background-color 0.2s' 
  },
  actionContainer: { display: 'flex', justifyContent: 'center', gap: '10px' },
  deleteButtonInitiate: { backgroundColor: '#c0392b' },
  deleteButtonConfirm: { padding: "12px 20px", border: "none", color: "white", fontWeight: "600", fontSize: 16, borderRadius: 4, cursor: "pointer", backgroundColor: '#e74c3c', },
  cancelButton: { backgroundColor: '#7f8c8d' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, },
  pageButton: { margin: '0 5px', padding: '8px 12px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', borderRadius: '4px' },
  pageButtonActive: { margin: '0 5px', padding: '8px 12px', border: '1px solid #2980b9', backgroundColor: '#2980b9', color: 'white', cursor: 'pointer', borderRadius: '4px' }
};

export default ProsesSeleksi;

