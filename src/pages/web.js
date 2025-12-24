import Head from "next/head";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./web.module.css";

const WHATSAPP_NUMBER = "250722319367";

export default function Web({ websites }) {
  const buyWebsite = (name) => {
    const message = `Ndashaka iyi website: ${name}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const contactWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Mwaramutse, nshaka ubundi busobanuro kuri website"
      )}`,
      "_blank"
    );
  };

  return (
    <>
      <Head>
        <title>Gura Website</title>
        <meta
          name="description"
          content="Website zigurishwa zakozwe mu buryo bw'umwuga"
        />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.heading}>Website Zigurishwa</h1>

        <div className={styles.grid}>
          {websites.map((site) => (
            <div key={site.id} className={styles.card}>
              <img
                src={site.image}
                alt={site.name}
                className={styles.image}
              />

              <h2 className={styles.title}>{site.name}</h2>
              <p className={styles.description}>{site.description}</p>

              <div className={styles.buttons}>
                <a
                  href={site.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className={styles.previewBtn}>Preview</button>
                </a>

                <button
                  className={styles.buyBtn}
                  onClick={() => buyWebsite(site.name)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating WhatsApp Button */}
        <button
          className={styles.whatsappFloating}
          onClick={contactWhatsApp}
          aria-label="Chat on WhatsApp"
        >
          WhatsApp
        </button>
      </main>
    </>
  );
}

/* =========================
   SERVER SIDE RENDERING
========================= */
export async function getServerSideProps() {
  try {
    const snapshot = await getDocs(collection(db, "websites"));

    const websites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        websites,
      },
    };
  } catch (error) {
    console.error("SSR Error:", error);
    return {
      props: {
        websites: [],
      },
    };
  }
}
