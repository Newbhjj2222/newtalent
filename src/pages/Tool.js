'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NeTDownloader from '../components/NeTDownloader';

export default function Tool() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <NeTDownloader />
      </main>
      <Footer />
    </>
  );
}
