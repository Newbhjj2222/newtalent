import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import './style.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const docRef = doc(db, "userdate", "data");
      const docSnap = await getDoc(docRef);
      let existingData = {};

      if (docSnap.exists()) {
        existingData = docSnap.data();
      }

      const newUserData = {
        fName: username,
        email: email
      };

      const updatedData = {
        ...existingData,
        [uid]: newUserData
      };

      await setDoc(docRef, updatedData);

      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </form>
  );
}

export default Register;
