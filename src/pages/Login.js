import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Injira muri Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fata document 'data' ibitse users bose
      const docRef = doc(db, "userdate", "data");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let found = false;

        // Shaka aho email yinjijwe ihuye n’iyo ibitse muri database
        for (const key in data) {
          const userData = data[key];
          if (userData.email === email) {
            const fName = userData.fName || "Unknown";
            localStorage.setItem("username", fName);
            found = true;
            break;
          }
        }

        if (found) {
          setMessage("Winjiye neza!");
          navigate("/home");
        } else {
          setMessage("Email ntiyabonywe muri Firestore.");
        }
      } else {
        setMessage("Nta document 'data' ibonetse muri Firestore.");
      }

    } catch (error) {
      setMessage("Injira ntibishobotse: " + error.message);
    }
  };

  return (
    <div className="container">
     <h2>Sign in</h2>
      <form onSubmit={handleLogin}>
        {message && <div className="messageDiv">{message}</div>}
        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">Sign In</button>
      </form>

      <div className="register-link">
        <p>
          Nta konti ufite?{" "}
          <Link to="/Register">Iyandikishe hano</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
