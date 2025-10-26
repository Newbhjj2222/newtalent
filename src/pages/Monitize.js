"use client";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../components/Monitize.module.css";
import {
  FaEye,
  FaComments,
  FaBookOpen,
  FaUserCircle,
  FaShieldAlt,
  FaPenNib,
  FaAward,
  FaUsers,
  FaMedal,
  FaCreditCard,
  FaEnvelope,
} from "react-icons/fa";

export default function MonitizePage() {
  const requirements = [
    { icon: <FaEye />, title: "Views 500", desc: "Kuba ufite views nibura 500 mu nkuru zawe zose." },
    { icon: <FaComments />, title: "Comments 60", desc: "Kuba ufite nibura comments 60 mu nkuru zawe zose." },
    { icon: <FaBookOpen />, title: "Inkuru 5 zifite amagambo 1000+", desc: "Kwandika nibura inkuru 5 zose zifite amagambo 1000 cyangwa arenga." },
    { icon: <FaUserCircle />, title: "Konti yuzuye", desc: "Kuba ufite konti ifite amafoto n’amakuru yuzuye y’umwanditsi." },
    { icon: <FaShieldAlt />, title: "Kubahiriza amategeko 25", desc: "Inkuru zawe zigomba kubahiriza amategeko agenga imyitwarire y’urubuga." },
    { icon: <FaPenNib />, title: "Original Content", desc: "Wandika inkuru zawe mu buryo bwawe bwihariye, utibye iz’abandi." },
    { icon: <FaAward />, title: "Igihembo cy’inkuru yambere", desc: "Kuba byibura warigeze guhabwa igihembo cy’inkuru yasomwe cyane." },
    { icon: <FaUsers />, title: "Abasomyi 30 kuri referral yawe", desc: "Kuba ufite byibura abasomyi 30 binyuze kuri referral code yawe." },
    { icon: <FaMedal />, title: "Badge ya High Level", desc: "Kuba ufite badge ya High Level kuri Netchat influencer." },
    { icon: <FaCreditCard />, title: "Konti y’ubwishyu yemewe", desc: "Kuba ufite Mobile Money, Mpesa cyangwa konti ya Bank yo kwishyurwaho." },
  ];

  return (
    <>
      <Header />
      <main className={styles.container}>
        <section className={styles.header}>
          <h1>🪙 IBINTU 10 BISABWA NGO WEMERERWE MONITIZATION</h1>
          <p>
            Uzuza ibisabwa byose ubashe kubona inyungu mu nkuru zawe kuri{" "}
            <b>New Talents Stories Group</b>.  
            Niba ubirangije, twoherereza email kuri{" "}
            <a href="mailto:admin@newtalentsg.co.rw">admin@newtalentsg.co.rw</a>{" "}
            usabe link yo kohereza ho monitization request.
          </p>
        </section>

        <section className={styles.grid}>
          {requirements.map((req, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.icon}>{req.icon}</div>
              <div>
                <h3>{index + 1}. {req.title}</h3>
                <p>{req.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.footer}>
          <p>📨 Mugihe wujuje ibyo byose, twoherereza email kuri:</p>
          <a href="mailto:admin@newtalentsg.co.rw" className={styles.button}>
            <FaEnvelope /> Kohereza Monitization Request
          </a>
          <p className={styles.note}>
            Ba umwanditsi wemewe ubona inyungu mu bihangano bye kuri{" "}
            <b>New Talents Stories Group</b>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
