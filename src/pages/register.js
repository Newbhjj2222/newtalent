'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../components/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styles from '../styles/Register.module.css';
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get('ref');
    if (code) setRefCode(code);
  }, [searchParams]);

  const generateReferralCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username) return alert("Andika username");

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const dataDocRef = doc(db, "userdate", "data");
      const dataSnap = await getDoc(dataDocRef);
      const existingData = dataSnap.exists() ? dataSnap.data() : {};

      const referralCode = generateReferralCode();
      const newUserData = {
        fName: username,
        email,
        referralCode,
        referredBy: refCode || null,
      };

      const updatedData = { ...existingData, [uid]: newUserData };
      await setDoc(dataDocRef, updatedData);

      await setDoc(doc(db, 'depositers', username), { nes: 5 });

      if (refCode) {
        for (const key in updatedData) {
          if (updatedData[key].referralCode === refCode) {
            const refUsername = updatedData[key].fName;
            const refDoc = doc(db, 'depositers', refUsername);
            const refSnap = await getDoc(refDoc);

            if (refSnap.exists()) {
              await updateDoc(refDoc, {
                nes: (refSnap.data().nes || 0) + 10,
              });
            } else {
              await setDoc(refDoc, { nes: 10 });
            }
            break;
          }
        }
      }

      router.push('/login');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className={styles.container}>
        <h2 className={styles.title}>Register</h2>

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
