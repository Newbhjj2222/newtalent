import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();

  const launchChat = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("Username missing");

    const chatRef = doc(collection(db, "chats"));
    await setDoc(chatRef, {
      users: [username],
      active: true,
      createdAt: serverTimestamp(),
    });

    router.push(`/chat/${chatRef.id}`);
  };

  return (
    <>
    <Header />
    <div style={{ padding: 40 }}>
      <h2>Love Connection Chat ❤️</h2>
      <button onClick={launchChat}>Launch Chat</button>
    </div>
<Footer/>
  </>
  );
}
