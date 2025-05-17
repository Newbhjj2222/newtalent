import React, { useState, useEffect } from 'react';
import './Footer.css';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useUser } from '../contexts/UserContext';

const Footer = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localUsername, setLocalUsername] = useState('');
  const [user, setUser] = useState(null);

  const { username, setUsername } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'userdata', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const name = docSnap.data().username;
          setUsername(name);
          localStorage.setItem('username', name);
        }
      }
    });
    return () => unsubscribe();
  }, [setUsername]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'userdata', userCredential.user.uid), {
        username: localUsername,
        email,
      });
      setUsername(localUsername);
      localStorage.setItem('username', localUsername);
      setIsRegistering(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/balance">Your Balance</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>About Us</h4>
        <p>NewtalentsG is a creative platform for young talents. is libary of differents Stories</p>
      </div>

      {!user && (
        <div className="footer-section">
          <h4>{isRegistering ? 'Register' : 'Login'}</h4>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <input
                type="text"
                placeholder="Username"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                required
              />
            )}
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
            <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
          </form>
          <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: 'pointer', marginTop: '10px' }}>
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </p>
        </div>
      )}

      <div className="footer-bottom">
        <p>© 2025 NewtalentsG. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
