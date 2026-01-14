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
  query,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../components/firebase";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import styles from "../../styles/chat.module.css";
import {
  FiCopy,
  FiImage,
  FiMic,
  FiStopCircle,
  FiSend,
} from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Chat() {
  const router = useRouter();
  const { chatId } = router.query;

  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username")
      : null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const bottomRef = useRef(null);

  /* ================= JOIN CHAT ================= */
  useEffect(() => {
    if (!chatId || !username) return;

    const chatRef = doc(db, "chats", chatId);

    getDoc(chatRef).then(async (snap) => {
      if (!snap.exists()) {
        alert("Chat expired");
        router.push("/");
        return;
      }

      const data = snap.data();
      if (!data.users.includes(username)) {
        if (data.users.length >= 2) {
          alert("Chat full");
          router.push("/");
          return;
        }
        await updateDoc(chatRef, {
          users: [...data.users, username],
          [`typing.${username}`]: false,
        });
      }
    });

    /* ===== TYPING LISTENER ===== */
    const unsubTyping = onSnapshot(chatRef, (snap) => {
      const data = snap.data();
      if (!data?.typing) return;

      const other = Object.keys(data.typing).find(
        (u) => u !== username && data.typing[u]
      );

      setTypingUser(other || null);
    });

    /* ===== ORDERED MESSAGES ===== */
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubMsgs = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => {
      unsubMsgs();
      unsubTyping();
    };
  }, [chatId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  /* ================= TYPING STATUS ================= */
  const setTyping = async (value) => {
    if (!chatId || !username) return;
    await updateDoc(doc(db, "chats", chatId), {
      [`typing.${username}`]: value,
    });
  };

  /* ================= SEND TEXT ================= */
  const sendText = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      type: "text",
      text,
      sender: username,
      createdAt: serverTimestamp(),
      seenBy: [],
    });

    setText("");
    setTyping(false);
  };

  /* ================= SEND IMAGE ================= */
  const sendImage = async (file) => {
    if (!file) return;

    const url = await uploadToCloudinary(file, "image");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      type: "image",
      mediaUrl: url,
      sender: username,
      createdAt: serverTimestamp(),
      seenBy: [],
    });
  };

  /* ================= AUDIO RECORD ================= */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

      const url = await uploadToCloudinary(blob, "audio");

      await addDoc(collection(db, "chats", chatId, "messages"), {
        type: "audio",
        mediaUrl: url,
        sender: username,
        createdAt: serverTimestamp(),
        seenBy: [],
      });
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setRecording(false);
  };

  /* ================= SEEN ================= */
  const markAsSeen = async (msg) => {
    if (
      msg.sender !== username &&
      !msg.seenBy?.includes(username)
    ) {
      await updateDoc(
        doc(db, "chats", chatId, "messages", msg.id),
        { seenBy: arrayUnion(username) }
      );
    }
  };

  /* ================= COPY LINK ================= */
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied ❤️");
  };

  /* ================= END CHAT ================= */
  const endChat = async () => {
    const msgs = await getDocs(
      collection(db, "chats", chatId, "messages")
    );
    for (const m of msgs.docs) await deleteDoc(m.ref);
    await deleteDoc(doc(db, "chats", chatId));
    router.push("/");
  };

  /* ================= UI ================= */
  return (
    <>
    <Header />
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.copyBtn} onClick={copyLink}>
          <FiCopy /> Copy Link
        </button>
        <button className={styles.endBtn} onClick={endChat}>
          End Chat ❌
        </button>
      </div>

      {/* TYPING */}
      {typingUser && (
        <div className={styles.typing}>
          {typingUser} is typing...
        </div>
      )}

      {/* MESSAGES */}
      <div className={styles.messages}>
        {messages.map((m) => {
          const mine = m.sender === username;
          markAsSeen(m);

          return (
            <div
              key={m.id}
              className={`${styles.msg} ${
                mine ? styles.me : styles.other
              }`}
            >
              {m.type === "text" && <p>{m.text}</p>}

              {m.type === "image" && (
                <img src={m.mediaUrl} className={styles.image} />
              )}

              {m.type === "audio" && (
                <audio controls src={m.mediaUrl} />
              )}

              {mine && (
                <span className={styles.seen}>
                  {m.seenBy?.length ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(true);
          }}
          onBlur={() => setTyping(false)}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
          placeholder="Type a message..."
        />

        <label className={styles.iconBtn}>
          <FiImage />
          <input
            hidden
            type="file"
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
<Footer />
              </>
  );
}
