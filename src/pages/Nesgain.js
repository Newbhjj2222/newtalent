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

  // === Bika amanota buri gihe ahindutse ===
  useEffect(() => {
    localStorage.setItem("nesgain_score", score);
  }, [score]);

  // === Fungura amakuru ya Firestore ===
  const fetchNes = async (user) => {
    const userRef = doc(db, "depositers", user);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      setNesBalance(snap.data().nes || 0);
    } else {
      setNesBalance(0);
    }
  };

  // === Tangiza umukino ===
  const startGame = () => {
    if (!username) {
      alert("emeza ko winjiye mbere yo gutangira umukino. winjiye!");
      return;
    }
    setPlaying(true);
    generateQuestion();
    setMessage("");
  };

  // === Kora ikibazo gishya ===
  const generateQuestion = () => {
    const random1 = Math.floor(Math.random() * (50000 - 2 + 1)) + 2;
    const random2 = Math.floor(Math.random() * (50000 - 2 + 1)) + 2;

    const correct = random1 * random2;

    const answers = [
      correct,
      correct + Math.floor(Math.random() * 5000) + 10,
      correct - Math.floor(Math.random() * 3000) - 10,
      correct + Math.floor(Math.random() * 10000) + 100,
    ].sort(() => Math.random() - 0.5);

    setNum1(random1);
    setNum2(random2);
    setChoices(answers);
    setTimeLeft(10);
  };

  // === Timer (10 seconds) ===
  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      setMessage("⏰ Time out!");
      setTimeout(() => generateQuestion(), 1000);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, playing]);

  // === Function yo gusubiza ===
  const handleAnswer = async (ans) => {
    const correct = num1 * num2;

    if (ans === correct) {
      const newScore = score + 5;
      setScore(newScore);
      setMessage("✅ Ni byo! +5 points");

      // Iyo yujuje 100 points
      if (newScore >= 100) {
        setMessage("🏆 Wujuje amanota 100! Uhawe nes 15!");
        await updateFirestore(15);
        await fetchNes(username);

        // Reset umukino nyuma gato
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
    }, 1000);
  };

  // === Firestore logic ===
  const updateFirestore = async (addAmount) => {
    if (!username) return;
    const userRef = doc(db, "depositers", username);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const current = snap.data().nes || 0;
      await updateDoc(userRef, { nes: current + addAmount });
    } else {
      await setDoc(userRef, { nes: addAmount });
    }
  };

  return (
    <div>
      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>🧮 NesGain Game</h1>

        {!playing && (
          <div className={styles.rules}>
            <h2>📜 Amabwiriza y'Umukino</h2>
            <ol>
              <li>👉 Ukina ariko winjiye<b>kurubuga</b>.</li>
              <li>👉 Uhabwa ikibazo cyo gukuba imibare ibiri (urugero: 12 × 45).</li>
              <li>👉 Ufite amasegonda 10 yo gusubiza buri kibazo.</li>
              <li>✅ Iyo usubije neza, wongererwa amanota 5.</li>
              <li>🏆 Iyo ugeze ku manota 100, uhabwa <b>nes 15</b> kandi umukino utangire bushya.</li>
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
              {num1.toLocaleString()} × {num2.toLocaleString()} = ?
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
