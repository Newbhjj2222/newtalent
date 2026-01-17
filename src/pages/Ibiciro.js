"use client";
import styles from "../components/Ibiciro.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Ibiciro() {
  return (
    <>
      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>
          💎 TANGIRA GUSOMA INKURU NAWE KURUBUGA RWACU 💎
        </h1>

        <p className={styles.intro}>
          Urubuga rwa <strong>New Talents Stories Group</strong> rukenera <b>NeS Point</b> kugira ngo usome.
          <br />
          NeS point ni inota ryashyizweho ngo rihe agaciro ibihangano by’abanditsi.
        </p>

        <p className={styles.desc}>
          Dore igiciro wishyura kugira ngo uyihabwe bundi utangire gusoma inkuru ushaka 👇
        </p>

        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div key={index} className={styles.card}>
              <h2>{plan.title}</h2>
              <p className={styles.price}>{plan.price}</p>
              <p className={styles.details}>{plan.details}</p>
              <p className={styles.extra}>{plan.extra}</p>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          <h3>📢 N.B:</h3>
          <p>
            Urubuga rwacu rugira <b>Referral Program</b> aho utumira inshuti yakwiyandikisha inyuze kuri link yawe,
            igahita ihabwa <b>NeS 5</b> z’inkuru 5. Nawe uhabwa NeS nk’izo ukoresha usoma.
          </p>
          <p>
            Urasanga <b>link yawe kuri profile yawe</b> — niyo utanga.
          </p>
        </div>

        <div className={styles.footer}>
          <p>
            ✨ Nawe wasoma inkuru buri uko ushaka kuri buri plan wishimiye.
            <br />
            <a
              href="https://www.newtalentsg.co.rw"
              target="_blank"
              rel="noopener noreferrer"
            >
              👉 Kanda hano winjire mu ishuri rigari ryigisha ubuzima 🌍
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

const plans = [
  {
    title: "🟢 NeS 1 – 10 RWF",
    price: "10 RWF",
    details: "Umusomyi yishyura 10 RWF kugira ngo asome igice kimwe cy’inkuru imwe (NeS 1).",
    extra: "Ni igiciro gito kandi gikwiye nk’icyo “pay-per-read”. Ni byiza ku bashaka gusoma igice kimwe gusa.",
  },
  
  {
    title: "🟢 Umunsi NeS 15 – 150 RWF",
    price: "150 RWF / umunsi",
    details: "Umusomyi yishyura 150 RWF ku munsi, agasoma ibice 15 cyangwa munsi yayo mu masaha 24.",
    extra: "Ni “Daily Access Plan”. Iyo umunsi ushize utazikoresheje zirarangira.",
  },
  {
    title: "🟢 Icyumweru NeS 25 – 250 RWF",
    price: "250 RWF / icyumweru",
    details: "Umusomyi yishyura 250 RWF ku cyumweru, agasoma ibice 25 mu minsi 7.",
    extra: "Igice kimwe gihwanye na 10 RWF. Iyo icyumweru kirangiye utazikoresheje zirarangira.",
  },
  {
    title: "🟢 Bestreader– 400 RWF",
    price: "400 RWF / ukwezi",
    details: "Umusomyi yishyura 400 RWF agahabwa uburenganzira busesuye bwo gusoma inkuru zose.",
    extra: "Ni “VIP Plan” (All Access). Iyo ukwezi gushize irahagarara.",
  },
];
