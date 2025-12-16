// pages/pay.js
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";

// SSR function to get user NES points
export async function getServerSideProps(context) {
  const username = context.req.cookies.username || null;

  if (!username) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const depositerRef = doc(db, "depositers", username);
  const docSnap = await getDoc(depositerRef);
  const nes = docSnap.exists() ? docSnap.data().nes || 0 : 0;

  return {
    props: {
      username,
      nes,
    },
  };
}

export default function Pay({ username, nes }) {
  const handlePurchase = () => {
    window.location.href = "https://payj.gamer.gd/";
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  };

  const cardStyle = {
    maxWidth: "500px",
    width: "100%",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "30px",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#333",
  };

  const nesStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#0070f3",
    marginTop: "20px",
  };

  const buttonStyle = {
    marginTop: "25px",
    padding: "12px 25px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#005bb5",
  };

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Your NeS Balance</h1>
          <p style={nesStyle}>{nes} NeS Points</p>

          <button
            style={buttonStyle}
            onClick={handlePurchase}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
          >
            Gura NeS
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
