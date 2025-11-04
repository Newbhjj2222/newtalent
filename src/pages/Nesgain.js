'use client';
import { useState, useEffect } from "react";
import styles from "../components/nesgain.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../components/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function NesGain() {
  const [username, setUsername] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [nesBalance, setNesBalance] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  // === Fata username & score muri localStorage ===
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedScore = localStorage.getItem("nesgain_score");

    if (storedUser) {
      setUsername(storedUser);
      fetchNes(storedUser);
    } else {
      setMessage("⚠️ Nta username ibonetse muri localStorage!");
    }

    if (storedScore) {
      setScore(parseInt(storedScore));
    }
  }, []);

  // === Bika amanota muri localStorage ===
  useEffect(() => {
    localStorage.setItem("nesgain_score", score);
  }, [score]);

  // === Fata amakuru ya Firestore ===
  const fetchNes = async (user) => {
    try {
      const userRef = doc(db, "depositers", user);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setNesBalance(snap.data().nes || 0);
      } else {
        setNesBalance(0);
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  // === Tangiza umukino ===
  const startGame = () => {
    if (!username) {
      alert("Emeza ko winjiye mbere yo gutangira umukino!");
      return;
    }
    setPlaying(true);
    generateQuestion();
    setMessage("");
  };

  // === Kora ikibazo gishya (Division ÷) ===
  const generateQuestion = () => {
    const divisor = Math.floor(Math.random() * 98) + 2; // hagati ya 2–100
    const quotient = Math.floor(Math.random() * 98) + 2; // hagati ya 2–100
    const dividend = divisor * quotient;

    const correct = quotient;

    const answers = [
      correct,
      correct + Math.floor(Math.random() * 10) + 1,
      correct - Math.floor(Math.random() * 10) - 1,
      correct + Math.floor(Math.random() * 15) + 2,
    ].sort(() => Math.random() - 0.5);

    setNum1(dividend);
    setNum2(divisor);
    setChoices(answers);
    setTimeLeft(10);
  };

  // === Timer logic ===
  useEffect(() => {
    if (!playing) return;

    if (timeLeft <= 0) {
      setMessage("⏰ Time out! -5 points");
      setScore((prev) => (prev >= 5 ? prev - 5 : 0));
      setTimeout(() => generateQuestion(), 1200);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, playing]);

  // === Function yo gusubiza ===
  const handleAnswer = async (ans) => {
    const correct = num1 / num2;

    if (ans === correct) {
      const newScore = score + 5;
      setScore(newScore);
      setMessage("✅ Ni byo! +5 points");

      // Iyo amanota ageze kuri 100 → ahawe nes 5 gusa
      if (newScore >= 100) {
        setMessage("🏆 Wujuje amanota 100! Uhawe nes 5!");
        await updateFirestore(5);
        await fetchNes(username);

        // Reset umukino
        setTimeout(() => {
          setScore(0);
          localStorage.setItem("nesgain_score", "0");
          setPlaying(false);
          setMessage("🔄 Umukino watangiye bundi bushya!");
        }, 2500);
        return;
      }
    } else {
      setScore((prev) => (prev >= 5 ? prev - 5 : 0));
      setMessage("❌ Sibyo! -5 points");
    }

    setTimeout(() => {
      setMessage("");
      generateQuestion();
    }, 1200);
  };

  // === Firestore update logic (ijye iteranya kuri balance) ===
  const updateFirestore = async (addAmount) => {
    if (!username) return;
    try {
      const userRef = doc(db, "depositers", username);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const current = snap.data().nes || 0;
        const newBalance = current + addAmount;
        await updateDoc(userRef, { nes: newBalance });
      } else {
        await setDoc(userRef, { nes: addAmount });
      }
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>➗ NesGain Division Game</h1>

        {!playing && (
          <div className={styles.rules}>
            <h2>📜 Amabwiriza y&apos;Umukino</h2>
            <ol>
              <li>👉 Ukina ariko winjiye <b>kurubuga</b>.</li>
              <li>👉 Uhabwa ikibazo cyo kugabanya (division) nka: 144 ÷ 12.</li>
              <li>👉 Ufite amasegonda 10 yo gusubiza buri kibazo.</li>
              <li>✅ Usubije neza: +5 points.</li>
              <li>❌ Usubije nabi: -5 points.</li>
              <li>🏆 Iyo ugeze ku manota 100: uhabwa nes 5, umukino utangire bushya.</li>
            </ol>
          </div>
        )}

        {!playing ? (
          <button className={styles.startBtn} onClick={startGame}>
            🎮 Tangira Gukina
          </button>
        ) : (
          <div className={styles.gameBox}>
            <p className={styles.username}>👤 Username: {username}</p>
            <p className={styles.score}>🏅 Score: {score}</p>
            <p className={styles.balance}>💰 Nes Balance: {nesBalance}</p>
            <p className={styles.timer}>⏳ {timeLeft} sec</p>

            <h2 className={styles.question}>
              {num1.toLocaleString()} ÷ {num2.toLocaleString()} = ?
            </h2>

            <div className={styles.answers}>
              {choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(c)}
                  className={styles.answerBtn}
                >
                  {c.toLocaleString()}
                </button>
              ))}
            </div>

            {message && <p className={styles.message}>{message}</p>}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
