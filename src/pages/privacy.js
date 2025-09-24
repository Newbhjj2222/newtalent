// pages/privacy.js
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrivacyPolicy from "../components/PrivacyPolicy";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}
