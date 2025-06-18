import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
//react-icons
import { FaHome, FaWpforms, FaCog, FaChartBar, FaHistory, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import InputData from "./pages/InputData";
import ProsesSeleksi from "./pages/prosesSeleksi";
import HasilSeleksi from "./pages/hasilSeleksi";
import History from "./pages/History";

// Asumsi Anda sudah membuat service ini
import { calonService } from "./services/calonServices"; 
import { historyService } from "./services/historyServices";


function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      onLogin(username);
      navigate("/");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div style={styles.loginContainer}>
      <form onSubmit={handleSubmit} style={styles.loginForm}>
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>Login Admin</h2>
        {error && <p style={styles.errorText}>{error}</p>}
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}

// --- Komponen Sidebar (Tidak diubah) ---
function Sidebar({ onLogout, isOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Beranda", icon: <FaHome /> },
    { path: "/input-data", label: "Input Data", icon: <FaWpforms /> },
    { path: "/proses-seleksi", label: "Proses Seleksi", icon: <FaCog /> },
    { path: "/hasil-seleksi", label: "Hasil Seleksi", icon: <FaChartBar /> },
    { path: "/history", label: "History", icon: <FaHistory /> },
  ];

  return (
    <aside style={{ ...styles.sidebar, width: isOpen ? 250 : 80 }}>
      <div style={styles.sidebarTop}>
        <h1 style={{ ...styles.sidebarTitle, display: isOpen ? 'block' : 'none' }}>Seleksi Beasiswa</h1>
        <button onClick={toggleSidebar} style={styles.sidebarToggleButton}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <nav style={styles.nav}>
        {navItems.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            style={{
              ...styles.navLink,
              backgroundColor: location.pathname === path ? "#34495e" : "transparent",
              justifyContent: isOpen ? 'flex-start' : 'center'
            }}
            title={label}
          >
            <span style={styles.navIcon}>{icon}</span>
            <span style={{ ...styles.navLabel, display: isOpen ? 'inline' : 'none' }}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
      <div style={styles.sidebarBottom}>
        <button onClick={onLogout} style={styles.logoutButton} title="Logout">
          <span style={styles.navIcon}><FaSignOutAlt /></span>
          <span style={{ ...styles.navLabel, display: isOpen ? 'inline' : 'none' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// --- Komponen Dashboard (Versi Baru yang Menarik) ---
function Dashboard() {
  const [stats, setStats] = useState({
    totalCalon: 0,
    seleksiTerakhir: "Belum ada",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const calonData = await calonService.getAllCalon();
        const historyData = await historyService.getHistory();
        
        setStats({
          totalCalon: calonData.length,
          seleksiTerakhir: historyData.length > 0 ? new Date(historyData[0].tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Belum ada",
        });

      } catch (error) {
        console.error("Gagal mengambil data untuk dashboard:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div style={styles.dashboardHeader}>
        <h1 style={styles.headerTitle}>Selamat Datang di Sistem Seleksi Beasiswa!</h1>
        <p style={styles.headerSubtitle}>
          
        </p>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <FaWpforms style={styles.statIcon} />
          <div>
            <h3 style={styles.statValue}>{stats.totalCalon}</h3>
            <p style={styles.statLabel}>Total Calon Peserta</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaHistory style={styles.statIcon} />
          <div>
            <h3 style={styles.statValue}>{stats.seleksiTerakhir}</h3>
            <p style={styles.statLabel}>Seleksi Terakhir</p>
          </div>
        </div>
      </div>
      
      <div style={{...styles.statsContainer, marginTop: '30px'}}>
         <Link to="/input-data" style={styles.actionCard}>
            <FaWpforms style={styles.actionIcon} />
            <h4 style={styles.actionLabel}>Input & Kelola Data</h4>
        </Link>
         <Link to="/proses-seleksi" style={styles.actionCard}>
            <FaCog style={styles.actionIcon} />
            <h4 style={styles.actionLabel}>Proses Seleksi</h4>
        </Link>
         <Link to="/hasil-seleksi" style={styles.actionCard}>
            <FaChartBar style={styles.actionIcon} />
            <h4 style={styles.actionLabel}>Lihat Hasil</h4>
        </Link>
      </div>
    </div>
  );
}


function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);


  return (
    <Router>
      {user ? (
        <div style={styles.appContainer}>
          <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main style={styles.mainContent}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/input-data" element={<InputData />} />
                <Route path="/proses-seleksi" element={<ProsesSeleksi />} />
                <Route path="/hasil-seleksi" element={<HasilSeleksi />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f4f7f6",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease",
    flexShrink: 0,
    overflowX: 'hidden',
    position: 'relative',
  },
  sidebarTop: {
    padding: '20px 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #34495e',
  },
  sidebarTitle: {
    margin: 0,
    whiteSpace: "nowrap",
    color: 'white',
    fontWeight: '600',
  },
  sidebarToggleButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5em',
    cursor: 'pointer',
  },
  sidebarBottom: {
    padding: '20px',
    borderTop: '1px solid #34495e',
  },
  nav: {
    flexGrow: 1,
    padding: '20px 0',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    color: "#ecf0f1",
    textDecoration: "none",
    padding: "12px 25px",
    transition: "background-color 0.2s ease, justify-content 0.3s ease",
    whiteSpace: "nowrap",
  },
  navIcon: {
    fontSize: '1.3em',
    minWidth: '30px',
    textAlign: 'center',
  },
  navLabel: {
    marginLeft: '15px',
    fontWeight: '500',
    transition: 'display 0.3s ease',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: "transparent",
    border: "1px solid #e74c3c",
    padding: "12px 25px",
    borderRadius: "4px",
    color: "#e74c3c",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: 'left',
  },
  mainContent: {
    flexGrow: 1, // Otomatis mengisi sisa ruang
    overflowY: 'auto',
    padding: '30px',
  },
  // Style 'pageContent' asli Anda (tetap ada untuk halaman lain)
  pageContent: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: 8,
    boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
    height: '100%',
  },
  // Login styles (tetap sama)
  loginContainer: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#34495e" },
  loginForm: { backgroundColor: "white", padding: 40, borderRadius: 8, boxShadow: "0 4px 15px rgb(0 0 0 / 0.3)", width: 350, display: "flex", flexDirection: "column" },
  input: { marginBottom: 20, padding: "12px 10px", fontSize: 16, borderRadius: 4, border: "1px solid #ccc" },
  button: { padding: "12px", backgroundColor: "#2980b9", border: "none", color: "white", fontWeight: "600", cursor: "pointer", borderRadius: 4 },
  errorText: { color: "#e74c3c", marginBottom: 10, textAlign: 'center' },

  // --- STYLE BARU UNTUK DASHBOARD ---
  dashboardHeader: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '40px 30px',
    borderRadius: '8px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '2.5em',
    fontWeight: '600',
  },
  headerSubtitle: {
    margin: '10px 0 0',
    fontSize: '1.1em',
    opacity: 0.9,
    maxWidth: '700px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: '3em',
    color: '#3498db',
    marginRight: '20px',
  },
  statValue: {
    margin: 0,
    fontSize: '2em',
    fontWeight: '700',
    color: '#2c3e50',
  },
  statLabel: {
    margin: 0,
    color: '#7f8c8d',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#2c3e50',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  actionIcon: {
    fontSize: '3.5em',
    color: '#2980b9',
    marginBottom: '15px',
  },
  actionLabel: {
      margin: 0,
      fontWeight: '600',
  }
};

export default App;
