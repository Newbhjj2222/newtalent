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

  // Fata referral code niba iri muri URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('ref');
    if (code) setRefCode(code);
  }, [location]);

  // Function yo gukora referral code nshya
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

    try {
      // 1️⃣ Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2️⃣ Fata document ya "data" muri userdate
      const dataDocRef = doc(db, "userdate", "data");
      const dataDocSnap = await getDoc(dataDocRef);
      let existingData = {};
      if (dataDocSnap.exists()) {
        existingData = dataDocSnap.data();
      }

      // 3️⃣ Shyiramo user nshya muri document ya data
      const referralCode = generateReferralCode();
      const newUserData = {
        fName: username,
        email: email,
        referralCode: referralCode,
        referredBy: refCode || null
      };
      const updatedData = {
        ...existingData,
        [uid]: newUserData
      };
      await setDoc(dataDocRef, updatedData);

      // 4️⃣ NES for new user
      const depositerRef = doc(db, 'depositers', username);
      await setDoc(depositerRef, { nes: 5 }); // new user gets 5 NES

      // 5️⃣ NES for referrer
      if (refCode) {
        const usersSnapshot = await getDocs(collection(db, 'userdate'));
        let referrerUsername = null;

        usersSnapshot.forEach(docSnap => {
          const data = docSnap.data();
          const allUsers = data?.data || data; // document data
          for (const uid in allUsers) {
            if (allUsers[uid].referralCode === refCode) {
              referrerUsername = allUsers[uid].fName;
              break;
            }
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
