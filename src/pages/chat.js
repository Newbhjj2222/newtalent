import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const launchChat = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("Set username first");

    const chatRef = doc(collection(db, "chats"));
    await setDoc(chatRef, {
      users: [username],
      active: true,
      createdAt: serverTimestamp(),
    });

    router.push(`/chat/${chatRef.id}`);
  };

  return (
    <button onClick={launchChat}>
      Launch Love Chat ❤️
    </button>
  );
}
