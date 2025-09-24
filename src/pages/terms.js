// pages/terms.js
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TermsAndConditions from "../components/TermsAndConditions";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <TermsAndConditions />
      </main>
      <Footer />
    </>
  );
}
