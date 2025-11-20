// FULL UPDATED BALANCE PAGE WITH AUTO USSD DIAL // Auto-submit → Save to Firestore → Auto-dial 1867777*amount# immediately

'use client';

import { useEffect, useState } from "react"; 
import { db } from "../components/firebase"; 
import { doc, onSnapshot, setDoc } from "firebase/firestore"; 
import { useRouter } from "next/navigation"; 
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 
import styles from "../components/Balance.module.css";

export default function Balance() { const router = useRouter(); const [username, setUsername] = useState(null); const [nes, setNes] = useState(0); const [message, setMessage] = useState(""); const [amount, setAmount] = useState(0); const [submitting, setSubmitting] = useState(false); const [copied, setCopied] = useState(false);

const [formData, setFormData] = useState({ names: "", phone: "", plan: "", paymentMethod: "", });

// PRICE MAP const planPrices = { onestory: 20, Local: 100, Daily: 150, weekly: 200, limited: 300, monthly: 600, bestreader: 1200, };

const baseUSSD = "*182*1*1*0780786300";

const isMobile = () => { if (typeof navigator === "undefined") return false; return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent); };

const makeTelHref = (ussd) => ussd.replace(/#/g, "%23");

const dialUSSD = async () => { if (!amount) return;

const ussd = `${baseUSSD}*${amount}#`;
const telHref = `tel:${makeTelHref(ussd)}`;

try {
  if (isMobile()) {
    window.location.href = telHref;
  } else {
    await navigator.clipboard.writeText(ussd);
    setCopied(true);
  }
} catch (err) {
  try {
    await navigator.clipboard.writeText(ussd);
    setCopied(true);
  } catch (e) {
    alert("USSD ni: " + ussd);
  }
}

};

// Get username useEffect(() => { const storedUsername = localStorage.getItem("username"); if (!storedUsername) { router.push("/login"); return; } setUsername(storedUsername); }, [router]);

// Listen to Firestore useEffect(() => { if (!username) return;

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

// Handle form changes const handleChange = (e) => { const { name, value } = e.target;

setFormData((prev) => ({ ...prev, [name]: value }));

if (name === "plan") {
  setAmount(planPrices[value] || 0);
}

};

// Handle form submit const handleSubmit = async (e) => { e.preventDefault();

setSubmitting(true);
setMessage("Kohereza ubusabe...");

try {
  await setDoc(
    doc(db, "depositers", username),
    {
      ...formData,
      amount,
      timestamp: new Date(),
    },
    { merge: true }
  );

  setMessage("Ubusabe bwawe bwakiriwe! Turimo gufungura USSD ngo wemeze ubwishyu...");

  // AUTO DIAL
  setTimeout(() => {
    dialUSSD();
  }, 1200);
} catch (error) {
  setMessage("Habaye ikibazo, ongera ugerageze.");
} finally {
  setSubmitting(false);
}

};

if (!username) { return <div className={styles.noUser}>Ntutangiye session. Injira mbere yo gukoresha Balance.</div>; }

return ( <> <Header /> <div className={styles.formContainer}> <div className={styles.nesCard}>Your NeS Points: <span>{nes}</span></div>

{message && <div className={styles.successMessage}>{message}</div>}

    <form onSubmit={handleSubmit} className={styles.balanceForm}>
      <input
        type="text"
        name="names"
        placeholder="Amazina ari kuri Mobile Money"
        value={formData.names}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Nimero ukoresha kwishyura"
        value={formData.phone}
        onChange={handleChange}
        required
      />

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

      {amount > 0 && (
        <div className={styles.amountBox}>Uzishyura: <strong>{amount} RWF</strong></div>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Kohereza..." : "Ohereza Ubusabe"}
      </button>
    </form>

    {copied && (
      <div className={styles.copied}>USSD Copied: *182*1*1*0780786300*{amount}#</div>
    )}
  </div>
  <Footer />
</>

); }

