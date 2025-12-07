"use client";

import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PayComponent from "../components/pay"; // renamed import to PascalCase
import styles from "../components/Balance.module.css";

export default function Pay() {
    const router = useRouter();
    const [username, setUsername] = useState(null);
    const [nes, setNes] = useState(0);

    // Get username
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            router.push("/login");
            return;
        }
        setUsername(storedUsername);
    }, [router]);

    // Firestore realtime
    useEffect(() => {
        if (!username) return;

        const unsub = onSnapshot(doc(db, "depositers", username), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setNes(data.nes || 0);
            } else {
                setNes(0);
            }
        });

        return () => unsub();
    }, [username]);

    if (!username) {
        return <div>Injira mbere yo gukomeza.</div>;
    }

    return (
        <>
        <Header />
            <div className={styles.formContainer}>
                <div className={styles.nesCard}>
                    Your NeS Points: <span>{nes}</span>
                </div>

                {/* Only show Pay component */}
                <PayComponent />
            </div>
        <Footer />
        </>
    );
}
