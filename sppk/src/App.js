import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import InputData from "./pages/InputData";
import ProsesSeleksi from "./pages/prosesSeleksi";
import HasilSeleksi from "./pages/hasilSeleksi";
import History from "./pages/History";
import ImportCSV from "./pages/ImportCSV";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded login check
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
        <h2 style={{ marginBottom: 20 }}>Login Admin</h2>
        {error && <p style={styles.errorText}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

function Sidebar({ onLogout }) {
  return (
    <div style={styles.sidebar}>
      <h1 style={styles.sidebarTitle}>SPK GRA</h1>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>
          Beranda
        </Link>
        <Link to="/input-data" style={styles.navLink}>
          Input Data
        </Link>
        <Link to="/proses-seleksi" style={styles.navLink}>
          Proses Seleksi
        </Link>
        <Link to="/hasil-seleksi" style={styles.navLink}>
          Hasil Seleksi
        </Link>
        <Link to="/history" style={styles.navLink}>
          History
        </Link>
      </nav>
      <button onClick={onLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={styles.content}>
      <h2>Dashboard Beranda</h2>
      <p>Selamat datang di sistem seleksi menggunakan metode GRA.</p>
    </div>
  );
}

function App() {
  const [user, setUser ] = useState(null);

  const handleLogin = (username) => {
    setUser (username);
  };

  const handleLogout = () => {
    setUser (null);
  };

  return (
    <Router>
      {user ? (
        <div style={styles.appContainer}>
          <Sidebar onLogout={handleLogout} />
          <div style={styles.mainContent}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/input-data" element={<InputData />} />
              <Route path="/proses-seleksi" element={<ProsesSeleksi />} />
              <Route path="/hasil-seleksi" element={<HasilSeleksi />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/import-csv" element={<ImportCSV />} />
            </Routes>
          </div>
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: 220,
    backgroundColor: "#2c3e50",
    padding: 20,
    color: "#ecf0f1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    margin: 0,
    textAlign: "center",
    marginBottom: 30,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  navLink: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontWeight: "600",
    padding: "8px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    padding: "30px",
    backgroundColor: "#ecf0f1",
    overflowY: "auto",
  },
  content: {
    maxWidth: 800,
    margin: "0 auto",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 6,
    boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
  },
  loginContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#34495e",
  },
  loginForm: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 4px 15px rgb(0 0 0 / 0.3)",
    width: 320,
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: 20,
    padding: "12px 10px",
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
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
  errorText: {
    color: "#e74c3c",
    marginBottom: 10,
  },
};

export default App;