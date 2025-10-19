import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NeTDownloader from "../components/Net";

export default function Tool() {
  return (
    <>
      <Head>
        <title>NeT Downloader Tool</title>
        <meta
          name="description"
          content="Download audio or extract sound from supported URLs safely and quickly"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">NeT Downloader</h1>

        <p className="text-center mb-8 text-gray-600">
          Andika cyangwa shyiramo <b>direct audio URL</b> (mp3/wav/ogg) cyangwa{" "}
          <b>URL y'urupapuro</b>. Iyi tool izagerageza kuyikurura (download)
          mu buryo bwemewe kandi bwihuse.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <NeTDownloader />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
