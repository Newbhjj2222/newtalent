import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referredCount, setReferredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // ✅ Dark mode state

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const dataDocRef = doc(db, 'userdate', 'data');
        const dataSnap = await getDoc(dataDocRef);
        if (!dataSnap.exists()) {
          setLoading(false);
          return;
        }

        const data = dataSnap.data();

        // Shaka lay aho fName ihuye na username
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
            [`${userKey}.referredBy`]: userData.referredBy || null
          });
          userData.referralCode = newCode;
        }

        setReferralCode(userData.referralCode);
        setReferralLink(`https://www.newtalentsg.co.rw/register?ref=${userData.referralCode}`);

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
        console.error('Error fetching referral data:', error);
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [username]);

  if (!username) {
    return (
      <div style={getStyles(darkMode).card}>
        <h2>You are not logged in</h2>
        <button onClick={goToLogin} style={getStyles(darkMode).loginButton}>Login</button>
        <button onClick={toggleDarkMode} style={getStyles(darkMode).toggleButton}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
    );
  }

  return (
    <div style={getStyles(darkMode).card}>
      <h2>Welcome, {username}</h2>
      <button onClick={handleLogout} style={getStyles(darkMode).button}>Logout</button>
      <button onClick={toggleDarkMode} style={getStyles(darkMode).toggleButton}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      {loading ? (
        <p>Loading referral info...</p>
      ) : (
        <div style={getStyles(darkMode).referralSection}>
          <h3>Your Referral Info</h3>
          <p><strong>Referral Code:</strong> {referralCode}</p>
          <p>
            <strong>Referral Link:</strong> 
            <a href={referralLink} target="_blank" rel="noopener noreferrer">{referralLink}</a>
          </p>
          <p><strong>People registered through you:</strong> {referredCount}</p>
          <button style={getStyles(darkMode).copyButton} onClick={() => navigator.clipboard.writeText(referralLink)}>
            Copy Referral Link
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ Styles function is now dynamic based on darkMode
const getStyles = (darkMode) => ({
  card: {
    margin: '80px auto',
    padding: '30px',
    width: '350px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    background: darkMode ? "#1e1e1e" : "#f9f9f9",
    color: darkMode ? "#fff" : "#000",
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  loginButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  referralSection: {
    marginTop: '30px',
    textAlign: 'left',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    background: darkMode ? "#2a2a2a" : "#fafafa",
  },
  copyButton: {
    marginTop: '10px',
    padding: '8px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  toggleButton: {
    marginTop: '20px',
    padding: '8px 15px',
    backgroundColor: darkMode ? '#888' : '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
});

export default Profile;
