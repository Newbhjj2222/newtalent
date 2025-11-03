import { useState, useEffect } from "react";
import styles from "../components/nesgain.module.css";
import { db } from "../components/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function NesGain() {
  const [username, setUsername] = useState("");
  const [num, setNum] = useState(0);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  // Fata username muri localStorage (ntabwo iyibika)
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      setMessage("⚠️ Nta username ibonetse muri localStorage!");
    }
  }, []);

  // Tangiza umukino
  const startGame = () => {
    if (!username) {
      alert("Shyira username muri localStorage mbere yo gukina!");
      return;
    }
    setScore(0);
    setPlaying(true);
    generateQuestion();
  };

  // Kora ikibazo gishya
  const generateQuestion = () => {
    const randomNum = Math.floor(Math.random() * (50000 - 2 + 1)) + 2; // kuva kuri 2 kugeza kuri 50000
    const correct = randomNum * randomNum;

    // Kora amahitamo
    const answers = [
      correct,
      correct + Math.floor(Math.random() * 2000) + 1,
      correct - Math.floor(Math.random() * 2000) - 1,
      correct + Math.floor(Math.random() * 10000) + 500,
    ].sort(() => Math.random() - 0.5);

    setNum(randomNum);
    setChoices(answers);
    setTimeLeft(5);
  };

  // Timer (amasegonda 5)
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

  // Function yo gusubiza
  const handleAnswer = async (ans) => {
    const correct = num * num;

    if (ans === correct) {
      setScore((prev) => prev + 5);
      setMessage("✅ Ni byo! +5 points");
      await updateFirestore(15); // ongera kuri nes
    } else {
      setScore((prev) => (prev >= 5 ? prev - 5 : 0));
      setMessage("❌ Sibyo! -5 points");
    }

    // Reba niba amanota yujuje 100
    if (score + 5 >= 100) {
      setMessage("🏆 Wujuje amanota 100! Umukino urarangiye.");
      setPlaying(false);
      return;
    }

    setTimeout(() => {
      setMessage("");
      generateQuestion();
    }, 1000);
  };

  // Firestore logic
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
    <div className={styles.container}>
      <h1 className={styles.title}>🧮 NesGain Game</h1>

      {!playing ? (
        <button className={styles.startBtn} onClick={startGame}>
          Tangira Gukina
        </button>
      ) : (
        <div className={styles.gameBox}>
          <p className={styles.username}>Username: {username}</p>
          <p className={styles.score}>Score: {score}</p>
          <p className={styles.timer}>⏳ {timeLeft} sec</p>

          <h2 className={styles.question}>
            Ikubo rya <span>{num}</span> ni irihe?
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
  );
}
