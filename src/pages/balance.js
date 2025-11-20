"use client";

import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../components/Balance.module.css";

export default function Pay() {
    const router = useRouter();
    const [username, setUsername] = useState(null);
    const [nes, setNes] = useState(0);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        names: "",
        phone: "",
        plan: "",
        amount: 0,
        paymentMethod: "",
    });

    // Rwanda phone check
    const isRwandaPhone = (phone) => {
        const regex = /^07\d{8}$/; // 10 digits, starts with 07
        return regex.test(phone);
    };

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

    // Select Amount
    const handlePlanChange = (value) => {
        let amount = 0;
        switch (value) {
            case "onestory": amount = 20; break;
            case "Local": amount = 100; break;
            case "Daily": amount = 150; break;
            case "weekly": amount = 200; break;
            case "limited": amount = 300; break;
            case "monthly": amount = 600; break;
            case "bestreader": amount = 1200; break;
            default: amount = 0;
        }
        setFormData((prev) => ({ ...prev, plan: value, amount }));
    };

    // Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "plan") {
            handlePlanChange(value);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Auto Dial with fixed USSD numbers
    const autoDial = (amount) => {
        let ussd;

        if (formData.paymentMethod === "MTN") {
            ussd = `*182*1*1*0780786300*${amount}#`;
        } else if (formData.paymentMethod === "Airtel") {
            ussd = `*500*1*1*0722319367*${amount}#`;
        } else {
            console.error("Payment method is not selected properly.");
            return;
        }

        const encoded = encodeURIComponent(ussd);
        window.location.href = `tel:${encoded}`;
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!isRwandaPhone(formData.phone)) {
            setMessage("💢 Nimero ya telefone igomba kuba iy’u Rwanda (itangira na 07, ikaba 10 digits).");
            setSubmitting(false);
            return;
        }

        setMessage("Ubusabe bwoherejwe, tegereza USSD...");

        try {
            await setDoc(
                doc(db, "depositers", username),
                { ...formData, timestamp: new Date() },
                { merge: true }
            );

            setMessage("Ubusabe bwoherejwe! Fungura USSD wemeze ubwishyu.");
            setTimeout(() => { autoDial(formData.amount); }, 2000);
            setTimeout(() => { router.push("/"); }, 20000);

        } catch (err) {
            console.error(err);
            setMessage("Habaye ikibazo. Ongera ugerageze.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!username) {
        return <div>Injira mbere yo gukomeza.</div>;
    }

    return (
        <>
            <div className={styles.formContainer}>
                <div className={styles.nesCard}>
                    Your NeS Points: <span>{nes}</span>
                </div>

                {message && <div className={styles.successMessage}>{message}</div>}

                <form onSubmit={handleSubmit} className={styles.balanceForm}>
                    <input type="text" name="names" placeholder="Amazina ari kuri nimero" value={formData.names} onChange={handleChange} required />
                    <input type="tel" name="phone" placeholder="Nimero ya telefone (Rwanda)" value={formData.phone} onChange={handleChange} required />

                    <select name="plan" value={formData.plan} onChange={handleChange} required>
                        <option value="">-- Hitamo Plan --</option>
                        <option value="onestory">NeS 1 - 20 RWF</option>
                        <option value="Local">NeS 7 - 100 RWF</option>
                        <option value="Daily">NeS 10 - 150 RWF</option>
                        <option value="weekly">NeS 15 - 200 RWF</option>
                        <option value="limited">NeS 25 - 300 RWF</option>
                        <option value="monthly">NeS 60 - 600 RWF</option>
                        <option value="bestreader">Ukwezi kose - 1200 RWF</option>
                    </select>

                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                        <option value="">-- Hitamo Uburyo bwo Kwishyura --</option>
                        <option value="MTN">MTN Mobile Money</option>
                        <option value="Airtel">Airtel Money</option>
                    </select>

                    <button type="submit" disabled={submitting}>
                        {submitting ? "Kohereza..." : "Ohereza"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}
