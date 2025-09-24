// components/PrivacyPolicy.js

import React from "react";
import styles from "./Privacy.module.css";

const PrivacyPolicy = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Politiki y&apos;Ubwiru (Privacy Policy)</h1>
      <p>Itariki yo kuvugurura: Nzeri 23, 2025</p>

      <section>
        <h2>Intangiriro</h2>
        <p>
          tukugirira ibanga ku makuru yawe kandi twiyemeje kurinda amakuru yawe bwite muburyo bwizewe. 
          ubu buryo kukubikira amakuru, bisobanuye ko amakuru dukusanya, dukoresha, byose bimenywa nawe nyirayo na system iyakoresha gusa. ntawundi umenya amakuru yawe. niyo mpamvu ukwiye kwizera <strong>newtalentsg.co.rw</strong>.
        </p>
      </section>

      <section>
        <h2>Amakuru Dukusanya n&apos;aya akurikira</h2>
        <ul>
          <li>Amakuru uduha ( izina, email, nimero ya telephone).</li>
          <li>Amakuru dukusanya mu buryo bwikora (nka cookies, IP address, ubwoko bwa browser).</li>
          <li>Amakuru aturuka ku maservice y&apos;inyongera uhuza n’urubuga rwacu.</li>
        </ul>
      </section>

      <section>
        <h2>Uko Dukoresha Amakuru Yawe</h2>
        <ul>
          <li>izina, email, na telephone nibyo byibanze bikenerwa ngo urubuga rukwemerere gusoma cyangwa kwandika.</li>
          <li>Kuvugana nawe ku bijyanye n’amaraporo, promotions, cyangwa ubufasha.</li>
          <li>Gusesengura uburyo urubuga rukoreshejwe kugira ngo turwubake neza.</li>
        </ul>
      </section>

      <section>
        <h2>Gusangira Amakuru Yawe</h2>
        <p>
          Ntitugurisha amakuru yawe bwite. Ariko dushobora gusangira amakuru hamwe n’abatanga serivisi badufasha gutunganya urubuga cyangwa kubahiriza amategeko. biryo amakuru mutanga hari igihe tuyifashisha.
        </p>
      </section>

      
      <section>
        <h2>Umutekano w&apos;Amakuru</h2>
        <p>
          turinda amakuru yawe, twifashishije password mukoresha. bityo amakuru yanyu ntawayabona atazi passward yanyu. ikindi urubuga rukumira umuntu uwariwe wese ushaka kwinjirira konti zabandi.
        </p>
      </section>

      <section>
        <h2>Impinduka kuri Politiki y&apos;Ubwiru</h2>
        <p>
          Dushobora kuvugurura iyi Politiki y&apos;Ubwiru igihe cyose. Impinduka zose zizashyirwa kuri uru rubuga hamwe n’itariki y’ivugururwa muzajya mubimenyeshwa mbere yuko biba..
        </p>
      </section>

      <section>
        <h2>Twandikire</h2>
        <p>
          Niba ufite ikibazo cyangwa igitekerezo ku bijyanye n’iyi Politiki y&apos;Umutekano, twandikire kuri: 
          <a href="mailto:admin@newtalentsg.co.rw">admin@newtalentsg.co.rw</a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
