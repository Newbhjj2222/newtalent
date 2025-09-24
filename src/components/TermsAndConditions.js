// components/TermsAndConditions.js
import React from "react";
import Link from "next/link";
import styles from "./Terms.module.css";

const TermsAndConditions = () => {
  return (
    <div className={styles.container}>
      <h1>Terms & Conditions</h1>
      <p className={styles.date}>Itariki yo kuvugurura: ugushyingo 24, 2025</p>

      <section>
        <h2>1. Intangiriro</h2>
        <p>
          Kwinjira no gukoresha urubuga{" "}
          <strong>newtalentsg.co.rw</strong> bisobanura ko wemeye
          gukurikiza aya mategeko n&apos;amabwiriza. Niba utayemera,
          turagusaba kudakoresha uru rubuga.
        </p>
      </section>

      <section>
        <h2>2. Uburyo bwo Gukoresha Urubuga</h2>
        <ul>
          <li>Ntugomba gukoresha urubuga mu bikorwa binyuranyije n’amategeko.</li>
          <li>Ntugomba kugerageza kwinjirira cyangwa guhungabanya umutekano w’urubuga.</li>
          <li>Konti ishobora guhagarikwa igihe wishe aya mategeko kandi wanabiregerwa mu nyiko.</li>
        </ul>
      </section>

      <section>
        <h2>3. Uburenganzira ku Mutungo na copyright.</h2>
        <p>
          Ibiri ku rubuga (logo, inyandiko, amafoto, software n’ibindi)
          byose ni uburenganzira bwa <strong>newtalentsg.co.rw</strong>
          cyangwa abafatanyabikorwa bayo. Kubikoresha bisaba
          uburenganzira bwanditse uhabwa na Admin.
        </p>
      </section>

      <section>
        <h2>4. Amasezerano y&apos;Ubwishyu</h2>
        <p>
          Niba hari serivisi zisaba kwishyurwa nko kwamamaza nizindi, urasabwa kwishyura neza kandi ku gihe.
          Politiki yo gusubizwa amafaranga (refund policy) izaba igengwa n’ayo
          masezerano yihariye uzagirana na Admin.
        </p>
      </section>

      <section>
        <h2>5. Kwirengera n&apos;Imipaka</h2>
        <p>
          Uru rubuga rutangwa &quot;nk’uko ruri&quot; kandi nta buriganya bwo gutanga
          amakuru atuzuye cyangwa afite amakosa.
          <strong> newtalentsg.co.rw </strong> ntiyirengera ibibazo
          biterwa n’ikoreshwa nabi ry’urubuga.
        </p>
      </section>

      <section>
        <h2>6. Politiki y&apos;Ubwiru</h2>
        <p>
          Amakuru bwite yawe arinzwe nk’uko bisobanurwa muri{" "}
          <Link href="/privacy">Politiki y’Ubwiru</Link>.
        </p>
      </section>

      <section>
        <h2>7. Amategeko Agenga</h2>
        <p>
          Aya mategeko agengwa n’amategeko ya Repubulika y’u Rwanda.
          Ikibazo cyose kijyanye n’aya mategeko kizakemurirwa mu nkiko
          zo mu Rwanda.
        </p>
      </section>

      <section>
        <h2>8. Impinduka</h2>
        <p>
          Dufite uburenganzira bwo guhindura aya mategeko igihe cyose.
          Impinduka zose zizashyirwa kuri uru rubuga kandi zizatangira
          gukurikizwa ako kanya.
        </p>
      </section>

      <section>
        <h2>9. Twandikire</h2>
        <p>
          Niba ufite ikibazo cyangwa igitekerezo, twandikire kuri:{" "}
          <a href="mailto:admin@newtalentsg.co.rw">
            admin@newtalentsg.co.rw
          </a>
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
