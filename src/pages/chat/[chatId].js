import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../components/firebase";
import { uploadToCloudinary } from "../../utils/cloudinary";
import styles from "../../styles/chat.module.css";
import {
  FiCopy,
  FiImage,
  FiMic,
  FiStopCircle,
  FiSend,
} from "react-icons/fi";

export default function Chat() {
  const { chatId } = useRouter().query;
  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username")
      : null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!chatId || !username) return;

    const chatRef = doc(db, "chats", chatId);

    getDoc(chatRef).then(async (snap) => {
      if (!snap.exists()) return alert("Chat expired");

      const data = snap.data();
      if (!data.users.includes(username)) {
        if (data.users.length >= 2) return alert("Chat full");
        await updateDoc(chatRef, {
          users: [...data.users, username],
        });
      }
    });

    const unsub = onSnapshot(
      collection(db, "chats", chatId, "messages"),
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    );

    return () => unsub();
  }, [chatId]);

  const sendText = async () => {
    if (!text) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      type: "text",
      text,
      sender: username,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  const sendImage = async (file) => {
    const url = await uploadToCloudinary(file, "image");
    await addDoc(collection(db, "chats", chatId, "messages"), {
      type: "image",
      mediaUrl: url,
      sender: username,
      createdAt: serverTimestamp(),
    });
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];
      const url = await uploadToCloudinary(blob, "audio");

      await addDoc(collection(db, "chats", chatId, "messages"), {
        type: "audio",
        mediaUrl: url,
        sender: username,
        createdAt: serverTimestamp(),
      });
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setRecording(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied ❤️");
  };

  const endChat = async () => {
    const msgs = await getDocs(
      collection(db, "chats", chatId, "messages")
    );
    msgs.forEach((m) => deleteDoc(m.ref));
    await deleteDoc(doc(db, "chats", chatId));
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.copyBtn} onClick={copyLink}>
          <FiCopy /> Copy Link
        </button>
        <button onClick={endChat}>End Chat ❌</button>
      </div>

      <div className={styles.messages}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.msg} ${
              m.sender === username ? styles.me : styles.other
            }`}
          >
            {m.type === "text" && <p>{m.text}</p>}
            {m.type === "image" && (
              <img src={m.mediaUrl} className={styles.image} />
            )}
            {m.type === "audio" && <audio controls src={m.mediaUrl} />}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <label className={styles.iconBtn}>
          <FiImage />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => sendImage(e.target.files[0])}
          />
        </label>

        <button
          className={styles.iconBtn}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? <FiStopCircle /> : <FiMic />}
        </button>

        <button className={styles.iconBtn} onClick={sendText}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
