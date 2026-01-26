'use client'; // 🔹 Only client-side

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [resetLoading, setResetLoading] = useState(false); // 🔹 reset loading

  /* =====================
     LOGIN
  ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(db, "userdate", "data");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setMessage("Nta document 'data' ibonetse muri Firestore.");
        return;
      }

      const data = docSnap.data();
      let found = false;

      for (const key in data) {
        if (data[key].email === email) {
          const fName = data[key].fName || "Unknown";
          if (typeof window !== "undefined") {
            localStorage.setItem("username", fName);
          }
          found = true;
          break;
        }
      }

      if (found) {
        setMessage("Winjiye neza!");
        router.push("/");
      } else {
        setMessage("Email ntiyabonywe muri Firestore.");
      }

    } catch (error) {
      setMessage("Injira ntibishobotse: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================
     RESET PASSWORD
  ===================== */
  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Andika email yawe mbere yo gusaba guhindura password.");
      return;
    }

    setResetLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Email yo guhindura password yoherejwe. Reba inbox cyangwa spam."
      );
    } catch (error) {
      setMessage("Ntibishobotse kohereza reset email: " + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className={styles.container}>
        <h2 className={styles.title}>Sign In</h2>

        <form onSubmit={handleLogin} className={styles.form}>
          {message && <div className={styles.messageDiv}>{message}</div>}

          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🔹 LOGIN BUTTON */}
          <button
            className={`${styles.btn} ${isLoading ? styles.loading : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* 🔹 FORGOT PASSWORD */}
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleResetPassword}
            disabled={resetLoading}
          >
            {resetLoading ? "Sending reset email..." : "Forgot password?"}
          </button>
        </form>

        <div className={styles.registerLink}>
          <p>
            Nta konti ufite?{" "}
            <Link href="/register">Iyandikishe hano</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
