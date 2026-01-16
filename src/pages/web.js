import Head from "next/head";
import { db } from "../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  FaEye,
  FaShoppingCart,
  FaShareAlt,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "./web.module.css";
import Net from "../components/Net";

const WHATSAPP_NUMBER = "250722319367";

export default function Web({ websites }) {
  const buyWebsite = (site) => {
    const message = `Ndashaka iyi website:
Izina: ${site.name}
Igiciro: ${site.price.toLocaleString()} RWF
Link: ${site.previewUrl}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const shareWebsite = (site) => {
  const shareText = `${site.name}

${site.description}

Igiciro: ${site.price.toLocaleString()} RWF

Reba hano:
https://www.newtalentsg.co.rw/web

Preview:
${site.previewUrl}`;

  navigator.clipboard.writeText(shareText);
  alert("Link na description byakopiwe 📋");
};

  return (
    <>
      <Head>
  <title>Website Zigurishwa | Web Market Rwanda</title>

  <meta
    name="description"
    content="Reba website zigurishwa, urebe preview, ugure byoroshye kuri WhatsApp."
  />
  <meta name="robots" content="index, follow" />

  {/* Favicon */}
  <link rel="icon" href="/net.png" />

  {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
  <meta property="og:title" content="Website Zigurishwa | Web Market Rwanda" />
  <meta
    property="og:description"
    content="Reba website zigurishwa, urebe preview, ugure byoroshye kuri WhatsApp."
  />
  <meta property="og:image" content="/net.png" />
  <meta property="og:type" content="website" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="/net.png" />
</Head>
<Net />
      <main className={styles.container}>
        <h1 className={styles.heading}>NetWeb Rwanda</h1>

        <div className={styles.grid}>
          {websites.map((site) => (
            <div key={site.id} className={styles.card}>
              {/* MAIN IMAGE */}
              <img
                src={site.image}
                alt={site.name}
                className={styles.image}
              />

              {/* GALLERY */}
              {site.images && site.images.length > 1 && (
                <div className={styles.gallery}>
                  {site.images.slice(1).map((img, i) => (
                    <img key={i} src={img} alt="preview" />
                  ))}
                </div>
              )}

              <div className={styles.content}>
                <h2>{site.name}</h2>
                <p className={styles.description}>{site.description}</p>

                <p className={styles.price}>
                  {site.price.toLocaleString()} RWF
                </p>

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
                    onClick={() => buyWebsite(site)}
                  >
                    <FaShoppingCart /> Buy
                  </button>

                  <button
                    className={styles.shareBtn}
                    onClick={() => shareWebsite(site)}
                  >
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating WhatsApp */}
        <button
          className={styles.whatsappFloating}
          onClick={() =>
            window.open(
              `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Mwaramutse, nshaka ubundi busobanuro kuri website"
              )}`,
              "_blank"
            )
          }
          aria-label="WhatsApp Chat"
        >
          <FaWhatsapp size={26} />
        </button>
      </main>
    </>
  );
}

/* ======================
   SERVER SIDE RENDERING
====================== */
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
    console.error("SSR Error:", error);
    return {
      props: { websites: [] },
    };
  }
}
