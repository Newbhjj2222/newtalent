import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

export default function Chat() {
  const { chatId } = useRouter().query;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username")
      : null;

  useEffect(() => {
    if (!chatId || !username) return;

    const chatRef = doc(db, "chats", chatId);

    getDoc(chatRef).then(async (snap) => {
      if (!snap.exists()) return alert("Chat expired");

      const data = snap.data();
      if (!data.users.includes(username)) {
        if (data.users.length >= 2) {
          return alert("Chat is full");
        }
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

  const sendMessage = async () => {
    if (!text) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      sender: username,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  const endChat = async () => {
    const msgs = await getDocs(
      collection(db, "chats", chatId, "messages")
    );
    msgs.forEach(async (m) => await deleteDoc(m.ref));
    await deleteDoc(doc(db, "chats", chatId));
    alert("Chat ended");
    window.location.href = "/";
  };

  return (
    <>
      <div>
        {messages.map((m) => (
          <p key={m.id}>
            <b>{m.sender}:</b> {m.text}
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={endChat}>End Chat ❌</button>
    </>
  );
}
