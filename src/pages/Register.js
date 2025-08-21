import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './style.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('ref');
    if (code) setRefCode(code);
  }, [location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2️⃣ Save user in 'userdate'
      const userDocRef = doc(db, "userdate", uid);
      const newUserData = {
        fName: username,
        email: email,
        referralCode: generateReferralCode(),
        referredBy: refCode || null
      };
      await setDoc(userDocRef, newUserData);

      // 3️⃣ Save nes for the new user in 'depositers'
      const depositerRef = doc(db, 'depositers', username);
      await setDoc(depositerRef, { nes: 5 }); // new user gets 5 nes

      // 4️⃣ If referral code exists, give 10 nes to referrer
      if (refCode) {
        // Search for user with this referral code
        const usersSnapshot = await getDocs(collection(db, 'userdate'));
        let referrerUsername = null;
        usersSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data.referralCode === refCode) {
            referrerUsername = data.fName;
          }
        });

        if (referrerUsername) {
          const referrerDepositRef = doc(db, 'depositers', referrerUsername);
          const refSnap = await getDoc(referrerDepositRef);
          if (refSnap.exists()) {
            const currentNes = refSnap.data().nes || 0;
            await updateDoc(referrerDepositRef, { nes: currentNes + 10 });
          } else {
            await setDoc(referrerDepositRef, { nes: 10 });
          }
        }
      }

      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to generate referral code
  const generateReferralCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input 
        type="text" 
        placeholder="Username" 
        onChange={(e) => setUsername(e.target.value)} 
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      {refCode && <p>Referral code applied: {refCode}</p>}
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </form>
  );
}

export default Register;
