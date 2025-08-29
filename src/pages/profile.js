// pages/profile.js
'use client'; // 🔹 Only client-side

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "../components/Profile.module.css"; 
import Header from "../components/Header";
import Footer from "../components/Footer"
// Function yo gukora referral code
const generateReferralCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Profile = () => {
  const router = useRouter();
  const [username, setUsername] = useState(""); // Initially empty
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referredCount, setReferredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /** ✅ Access localStorage only on client */
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    setUsername(storedUsername);
  }, []);

  /** Logout */
  const handleLogout = () => {
    setUsername("");
    localStorage.removeItem("username");
    router.push("/login");
  };

  /** Go to login if not logged in */
  const goToLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const dataDocRef = doc(db, "userdate", "data");
        const dataSnap = await getDoc(dataDocRef);
        if (!dataSnap.exists()) {
          setLoading(false);
          return;
        }

        const data = dataSnap.data();

        // Shaka aho fName ihuye na username
        let userKey = null;
        for (const key in data) {
          if (data[key].fName === username) {
            userKey = key;
            break;
          }
        }

        if (!userKey) {
          console.error("User not found in data document");
          setLoading(false);
          return;
        }

        let userData = data[userKey];

        // Generate referral code niba itarimo
        if (!userData.referralCode) {
          const newCode = generateReferralCode();
          await updateDoc(dataDocRef, {
            [`${userKey}.referralCode`]: newCode,
            [`${userKey}.referredBy`]: userData.referredBy || null,
          });
          userData.referralCode = newCode;
        }

        setReferralCode(userData.referralCode);
        setReferralLink(
          `https://www.newtalentsg.co.rw/register?ref=${userData.referralCode}`
        );

        // Count referred users
        let count = 0;
        for (const key in data) {
          if (data[key].referredBy === userData.referralCode) {
            count++;
          }
        }
        setReferredCount(count);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching referral data:", error);
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [username]);

  if (!username) {
    return (
      <div className={styles.card}>
        <h2>You are not logged in</h2>
        <button onClick={goToLogin} className={styles.loginButton}>
          Login
        </button>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className={styles.card}>
      <h2>Welcome, {username}</h2>
      <button onClick={handleLogout} className={styles.button}>
        Logout
      </button>

      {loading ? (
        <p>Loading referral info...</p>
      ) : (
        <div className={styles.referralSection}>
          <h3>Your Referral Info</h3>
          <p>
            <strong>Referral Code:</strong> {referralCode}
          </p>
          <p>
            <strong>Referral Link:</strong>{" "}
            <a href={referralLink} className={styles.refLink} target="_blank" rel="noopener noreferrer">
              {referralLink}
            </a>
          </p>
          <p>
            <strong>People registered through you:</strong> {referredCount}
          </p>
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard.writeText(referralLink)}
          >
            Copy Referral Link
          </button>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default Profile;
