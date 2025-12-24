import Head from "next/head";
import { db } from "../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaWhatsapp, FaEye, FaShoppingCart } from "react-icons/fa";
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
        {/* Primary SEO */}
        <title>Gura Website Ziteguye | Web Market Rwanda</title>
        <meta
          name="description"
          content="Gura website ziteguye gukoreshwa: business, e-commerce, portfolio. Preview mbere yo kugura, uduhamagare kuri WhatsApp."
        />
        <meta
          name="keywords"
          content="gura website, website rwanda, website zigurishwa, ecommerce rwanda, business website, website"
        />
        <meta name="author" content="Web Market Rwanda" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook / WhatsApp) */}
        <meta property="og:title" content="Gura Website Ziteguye | Web Market Rwanda" />
        <meta
          property="og:description"
          content="Reba website ziteguye, urebe preview, ugure byoroshye ukoresheje WhatsApp."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/seo-preview.jpg" />
        <meta property="og:url" content="https://yourdomain.com/web" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gura Website Ziteguye" />
        <meta
          name="twitter:description"
          content="Website ziteguye gukoreshwa mu Rwanda. Preview & Buy via WhatsApp."
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
                  className={styles.previewBtn}
                >
                  <FaEye /> Preview
                </a>

                <button
                  className={styles.buyBtn}
                  onClick={() => buyWebsite(site.name)}
                >
                  <FaShoppingCart /> Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating WhatsApp */}
        <button
          className={styles.whatsappFloating}
          onClick={contactWhatsApp}
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={26} />
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
      props: { websites },
    };
  } catch (error) {
    console.error("SSR Firebase Error:", error);
    return {
      props: { websites: [] },
    };
  }
}
