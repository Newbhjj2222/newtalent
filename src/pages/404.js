// pages/404.js

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

export default function Custom404() {
  return (
    <>
      <Header />

      <div style={styles.wrapper}>
        <div style={styles.container}>
          <FaSearch size={65} style={{ marginBottom: 25, color: "#4a4a4a" }} />

          <h1 style={styles.title}>Mutubabarire 🙏</h1>

          <p style={styles.text}>
            Ntitubashije kubona ibyo mwashakaga kuri uru rubuga.
            Birashoboka ko byimuwe, byasibwe cyangwa ko mwanditse link ituzuye neza.
            <br /><br />
            <span style={{ fontWeight: "bold" }}>
              Mwabishatse, mushobora kugerageza kongera gushaka ibindi.
            </span>
          </p>

          <Link href="/" style={styles.backBtn}>
            <FaArrowLeft style={{ marginRight: 8 }} />
            Subira ku rubuga rukuru
          </Link>

          <p style={styles.smallNote}>
            Ntimucikwe n’ibindi bishya! Dukomeje kubaka platform irushijeho kuba nziza.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

const styles = {
  wrapper: {
    background: "#ffffff",
    minHeight: "70vh",
    display: "flex",
    margin: "60px auto",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    textAlign: "center",
    maxWidth: "600px",
    padding: "20px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "10px",
  },
  text: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "28px",
    lineHeight: 1.7,
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 22px",
    background: "#0070f3",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "16px",
  },
  smallNote: {
    marginTop: "25px",
    fontSize: "15px",
    color: "#777",
    fontStyle: "italic",
  },
};
