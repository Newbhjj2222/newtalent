'use client';

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <>
      {/* ================= META TAGS ================= */}
      <Head>
        <title>Refund Policy | NewTalentsG</title>
        <meta
          name="description"
          content="Menya amabwiriza ya NewTalentsG ajyanye no gusubizwa amafaranga (Refund Policy) ku bagura NES na services zitandukanye."
        />
        <meta
          name="keywords"
          content="NewTalentsG refund policy, gusubizwa amafaranga, NES, payment policy"
        />
        <meta name="author" content="NewTalentsG" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="Refund Policy | NewTalentsG" />
        <meta
          property="og:description"
          content="Soma amabwiriza yo gusubizwa amafaranga kuri NewTalentsG."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.newtalentsg.co.rw/refund" />
        <meta property="og:site_name" content="NewTalentsG" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Refund Policy | NewTalentsG" />
        <meta
          name="twitter:description"
          content="Amabwiriza ya NewTalentsG ajyanye no gusubizwa amafaranga."
        />
      </Head>

      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= MAIN CONTENT ================= */}
      <main className="container">
        <article className="card">
          <h1>Refund Policy</h1>
          <p className="updated">
            Iheruka kuvugururwa: <strong>2026</strong>
          </p>

          <section>
            <h2>1. Ibisobanuro rusange</h2>
            <p>
              Iyi <strong>Refund Policy</strong> igena uko <strong>NewTalentsG</strong>
              ifata ibisabwa byo gusubizwa amafaranga yishyuwe kuri serivisi
              zacu. Iyo ukoresheje uru rubuga, uba wemeye aya mabwiriza yose.
            </p>
          </section>

          <section>
            <h2>2. Serivisi zitemererwa gusubizwa amafaranga</h2>
            <ul>
              <li>Kugura NES</li>
              <li>Kwiyandikisha kuri plans (Single, Daily, Weekly, BestReader)</li>
              <li>Serivisi zitangwa ako kanya (instant services)</li>
            </ul>
            <p className="note">
              Izi serivisi ntizisubizwa amafaranga nyuma yo gutangwa.
            </p>
          </section>

          <section>
            <h2>3. Igihe refund ishobora kwemerwa</h2>
            <ul>
              <li>Iyo habayeho ikosa rya system ryatumye wishyurwa inshuro ebyiri</li>
              <li>Iyo serivisi utigeze uyihabwa kubera ikosa rya NewTalentsG</li>
              <li>Iyo hishyuwe amafaranga atari yo bitewe n’ikosa rya platform</li>
            </ul>
          </section>

          <section>
            <h2>4. Igihe cyo gusaba refund</h2>
            <p>
              Gusaba refund bigomba gukorwa mu <strong>masaha 24</strong> uhereye
              igihe wishyuriye. Nyuma y’icyo gihe, nta refund yemerwa.
            </p>
          </section>

          <section>
            <h2>5. Uko wasaba refund</h2>
            <p>Ohereza ibisobanuro bikurikira:</p>
            <ul>
              <li>Username ukoresha kurubuga</li>
              <li>Igihe wishyuriye</li>
              <li>Umubare w’amafaranga wishyuye</li>
              <li>Impamvu usaba refund</li>
            </ul>
            <p className="contact">
              📩 <strong>Email:</strong> Admin@newtalentsg.co.rw <br />
              🌐 <strong>Website:</strong> www.newtalentsg.co.rw
            </p>
          </section>

          <section>
            <h2>6. Igihe cyo gusubizwa amafaranga</h2>
            <p>
              Iyo refund yemewe, amafaranga asubizwa mu gihe kiri hagati
              y’iminsi <strong>2–7 y’akazi</strong>, bitewe n’uburyo bwo kwishyura
              bwakoreshejwe.
            </p>
          </section>

          <section>
            <h2>7. Impinduka kuri iyi Policy</h2>
            <p>
              NewTalentsG ifite uburenganzira bwo guhindura iyi Refund Policy
              igihe icyo ari cyo cyose. Impinduka zizatangira gukurikizwa
              zimaze gushyirwa kuri website.
            </p>
          </section>
        </article>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= CSS ================= */}
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 40px 16px;
          background: linear-gradient(135deg, #f9fafb, #eef2f7);
          display: flex;
          justify-content: center;
        }

        .card {
          max-width: 900px;
          width: 100%;
          background: #ffffff;
          padding: 32px;
          border-radius: 18px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }

        h1 {
          text-align: center;
          font-size: 2.1rem;
          color: #111827;
          margin-bottom: 8px;
        }

        .updated {
          text-align: center;
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 32px;
        }

        section {
          margin-bottom: 26px;
        }

        h2 {
          font-size: 1.25rem;
          margin-bottom: 10px;
          color: #1f2937;
        }

        p {
          font-size: 1rem;
          line-height: 1.75;
          color: #374151;
        }

        ul {
          padding-left: 22px;
          margin-top: 8px;
        }

        li {
          margin-bottom: 6px;
          color: #374151;
        }

        .note {
          margin-top: 10px;
          color: #dc2626;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .contact {
          margin-top: 10px;
          font-size: 0.95rem;
        }

        @media (max-width: 600px) {
          .card {
            padding: 22px;
          }

          h1 {
            font-size: 1.6rem;
          }

          h2 {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </>
  );
}
