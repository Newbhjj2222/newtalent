import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "../components/Theme"; // ✅ fata darkMode na theme variables hano
import "./Profile.css"; // ✅ fata CSS

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
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem("username") || "";
  const [username, setUsername] = useState(storedUsername);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referredCount, setReferredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useTheme(); // ✅ darkMode ivuye muri Theme.js

  const handleLogout = () => {
    setUsername("");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const goToLogin = () => {
    navigate("/login");
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
      <div className="card">
        <h2>You are not logged in</h2>
        <button onClick={goToLogin} className="loginButton">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Welcome, {username}</h2>
      <button onClick={handleLogout} className="button">
        Logout
      </button>

      {loading ? (
        <p>Loading referral info...</p>
      ) : (
        <div className="referralSection">
          <h3>Your Referral Info</h3>
          <p>
            <strong>Referral Code:</strong> {referralCode}
          </p>
          <p>
            <strong>Referral Link:</strong>{" "}
            <a href={referralLink} className="refLink" target="_blank" rel="noopener noreferrer">
              {referralLink}
            </a>
          </p>
          <p>
            <strong>People registered through you:</strong> {referredCount}
          </p>
          <button
            className="copyButton"
            onClick={() => navigator.clipboard.writeText(referralLink)}
          >
            Copy Referral Link
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
