// pages/404.js

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

export default function Custom404() {
  return (
    <>
      <Header />

      <div style={styles.container}>
        <FaSearch size={60} style={{ marginBottom: 20, color: "#555" }} />

        <h1 style={styles.title}>Mutubabarire 🙏</h1>
        <p style={styles.text}>
          Ntitubashije kubona ibyo mwashakaga.
          <br />
          <span style={{ fontWeight: "bold" }}>
            Subira inyuma ujye gushaka ibindi.
          </span>
        </p>

        <Link href="/" style={styles.backBtn}>
          <FaArrowLeft style={{ marginRight: 8 }} />
          Subira ku rubuga rukuru
        </Link>
      </div>

      <Footer />
    </>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "80px 20px",
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "10px",
  },
  text: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "25px",
    lineHeight: 1.6,
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 18px",
    background: "#0070f3",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
  },
};
