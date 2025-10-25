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
    title: "🟢 NeS 1 – 20 RWF",
    price: "20 RWF",
    details: "Umusomyi yishyura 20 RWF kugira ngo asome igice kimwe cy’inkuru imwe (NeS 1).",
    extra: "Ni igiciro gito kandi gikwiye nk’icyo “pay-per-read”. Ni byiza ku bashaka gusoma igice kimwe gusa.",
  },
  {
    title: "🟢 NeS 7 – 100 RWF",
    price: "100 RWF",
    details: "Umusomyi yishyura 100 RWF kugira ngo abone ibice 7 by’inkuru.",
    extra: "Igice kimwe gihwanye na 14.3 RWF. Ni uburyo bwo guhendukira abashaka gusoma byinshi.",
  },
  {
    title: "🟢 Umunsi NeS 10 – 150 RWF",
    price: "150 RWF / umunsi",
    details: "Umusomyi yishyura 150 RWF ku munsi, agasoma ibice 10 cyangwa munsi yayo mu masaha 24.",
    extra: "Ni “Daily Access Plan”. Iyo umunsi ushize utazikoresheje zirarangira.",
  },
  {
    title: "🟢 Icyumweru NeS 15 – 200 RWF",
    price: "200 RWF / icyumweru",
    details: "Umusomyi yishyura 200 RWF ku cyumweru, agasoma ibice 15 mu minsi 7.",
    extra: "Igice kimwe gihwanye na 13.3 RWF. Iyo icyumweru kirangiye utazikoresheje zirarangira.",
  },
  {
    title: "🟢 Icyumweru NeS 25 – 300 RWF",
    price: "300 RWF / icyumweru",
    details: "Umusomyi yishyura 300 RWF ku cyumweru, agasoma ibice 25.",
    extra: "Igice kimwe gihwanye na 12 RWF. Ni nziza ku bakunda gukurikira inkuru nyinshi.",
  },
  {
    title: "🟢 Ukwezi NeS 60 – 600 RWF",
    price: "600 RWF / ukwezi",
    details: "Umusomyi yishyura 600 RWF ku kwezi, agasoma ibice 60.",
    extra: "Igice kimwe gihwanye na 10 RWF. Ni plan ihendutse cyane ku bakunda gusoma buri munsi.",
  },
  {
    title: "🟢 Ukwezi kose – 1200 RWF",
    price: "1200 RWF / ukwezi",
    details: "Umusomyi yishyura 1200 RWF agahabwa uburenganzira busesuye bwo gusoma inkuru zose.",
    extra: "Ni “VIP Plan” (All Access). Uko kwezi gushize irahagarara.",
  },
];
