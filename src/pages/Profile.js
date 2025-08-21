import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

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
  const { username, setUsername } = useUser();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referredCount, setReferredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Logout function
  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('username');
  };

  // Go to login page
  const goToLogin = () => {
    navigate('/login');
  };

  // Fetch referral info + generate if missing
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, 'userdate', user.uid); // doc id = uid
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          let userData = userSnapshot.data();

          // Generate referral code niba itarimo
          if (!userData.referralCode) {
            const newCode = generateReferralCode();
            await updateDoc(userDocRef, { referralCode: newCode });
            userData.referralCode = newCode;
          }

          setReferralCode(userData.referralCode);
          setReferralLink(`https://www.newtalentsg.co.rw/register?ref=${userData.referralCode}`);

          // Count referred users
          const q = query(
            collection(db, 'userdate'),
            where('referredBy', '==', userData.referralCode)
          );
          const querySnapshot = await getDocs(q);
          setReferredCount(querySnapshot.size);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching referral data:', error);
        setLoading(false);
      }
    };

    if (username) fetchReferralData();
  }, [username]);

  if (!username) {
    return (
      <div style={styles.card}>
        <h2>You are not logged in</h2>
        <button onClick={goToLogin} style={styles.loginButton}>Login</button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2>Welcome, {username}</h2>
      <button onClick={handleLogout} style={styles.button}>Logout</button>

      {loading ? (
        <p>Loading referral info...</p>
      ) : (
        <div style={styles.referralSection}>
          <h3>Your Referral Info</h3>
          <p><strong>Referral Code:</strong> {referralCode}</p>
          <p>
            <strong>Referral Link:</strong> 
            <a href={referralLink} target="_blank" rel="noopener noreferrer">{referralLink}</a>
          </p>
          <p><strong>People registered through you:</strong> {referredCount}</p>
          <button style={styles.copyButton} onClick={() => navigator.clipboard.writeText(referralLink)}>
            Copy Referral Link
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    margin: '80px auto',
    padding: '30px',
    width: '350px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
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
    backgroundColor: '#fafafa'
  },
  copyButton: {
    marginTop: '10px',
    padding: '8px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Profile;
