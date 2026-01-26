'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  /* =====================
     EMAIL + PASSWORD LOGIN
  ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await handleUserFromFirestore(email);
      router.push("/");
    } catch (error) {
      setMessage("Injira ntibishobotse: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================
     GOOGLE LOGIN / REGISTER
  ===================== */
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const username = user.displayName || "Google User";
      const userEmail = user.email;

      // 🔹 Save / update Firestore
      const dataRef = doc(db, "userdate", "data");
      const snap = await getDoc(dataRef);
      const existingData = snap.exists() ? snap.data() : {};

      let userExists = false;
      for (const key in existingData) {
        if (existingData[key].email === userEmail) {
          userExists = true;
          break;
        }
      }

      if (!userExists) {
        await setDoc(dataRef, {
          ...existingData,
          [user.uid]: {
            fName: username,
            email: userEmail,
            referralCode: null,
            referredBy: null,
            provider: "google",
          },
        });
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("username", username);
      }

      router.push("/");
    } catch (error) {
      setMessage("Google login ntibishobotse: " + error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  /* =====================
     RESET PASSWORD
  ===================== */
  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Andika email yawe mbere yo gusaba reset password.");
      return;
    }

    setResetLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Email yo guhindura password yoherejwe. Reba inbox cyangwa spam.");
    } catch (error) {
      setMessage("Reset ntibishobotse: " + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  /* =====================
     HELPER: FIRESTORE USER
  ===================== */
  const handleUserFromFirestore = async (email) => {
    const docRef = doc(db, "userdate", "data");
    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const data = snap.data();
    for (const key in data) {
      if (data[key].email === email) {
        const name = data[key].fName || "User";
        if (typeof window !== "undefined") {
          localStorage.setItem("username", name);
        }
        break;
      }
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
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className={`${styles.btn} ${isLoading ? styles.loading : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleResetPassword}
            disabled={resetLoading}
          >
            {resetLoading ? "Sending reset email..." : "Forgot password?"}
          </button>

          {/* 🔵 GOOGLE LOGIN */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </form>

        <div className={styles.registerLink}>
          <p>
            Nta konti ufite? <Link href="/register">Iyandikishe hano</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
