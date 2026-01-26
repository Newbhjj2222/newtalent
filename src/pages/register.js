'use client'; // 🔹 Only client-side

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../components/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styles from '../components/Register.module.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 🔹 loading state

  /** Fata referral code iri muri URL */
  useEffect(() => {
    const code = searchParams.get('ref');
    if (code) setRefCode(code);
  }, [searchParams]);

  /** Generate referral code */
  const generateReferralCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username) return alert("Andika username");

    setIsLoading(true); // 🔹 button igaragaze ko yakanzweho

    try {
      // 1️⃣ Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Fata document ya data
      const dataDocRef = doc(db, "userdate", "data");
      const dataDocSnap = await getDoc(dataDocRef);
      let existingData = {};
      if (dataDocSnap.exists()) existingData = dataDocSnap.data();

      // 3️⃣ Shyiramo user nshya
      const referralCode = generateReferralCode();
      const newUserData = {
        fName: username,
        email,
        referralCode,
        referredBy: refCode || null,
      };

      const updatedData = { ...existingData, [uid]: newUserData };
      await setDoc(dataDocRef, updatedData);

      // 4️⃣ NES kuri new user
      const depositerRef = doc(db, 'depositers', username);
      await setDoc(depositerRef, { nes: 5 });

      // 5️⃣ NES kuri referrer
      if (refCode) {
        for (const key in updatedData) {
          if (updatedData[key].referralCode === refCode) {
            const referrerUsername = updatedData[key].fName;
            const referrerDepositRef = doc(db, 'depositers', referrerUsername);
            const refSnap = await getDoc(referrerDepositRef);

            if (refSnap.exists()) {
              const currentNes = refSnap.data().nes || 0;
              await updateDoc(referrerDepositRef, {
                nes: currentNes + 10,
              });
            } else {
              await setDoc(referrerDepositRef, { nes: 10 });
            }
            break;
          }
        }
      }

      router.push('/login');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false); // 🔹 garura button normal
    }
  };

  return (
    <>
      <Header />

      <div className={styles.container}>
        <h2>Register</h2>

        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {refCode && (
            <p className={styles.referralNotice}>
              Referral code applied: <b>{refCode}</b>
            </p>
          )}

          <button
            type="submit"
            className={`${styles.btn} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className={styles.loginLink}>
            Already have an account?{" "}
            <Link href="/login">Login here</Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Register;
