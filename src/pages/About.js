// src/pages/about.js
import React from "react";
import Header from "../components/Header";
import styles from "../components/About.module.css"; 
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Header />

      <div className={styles.about}>
        <section className={styles.goal} id="goal">
          <h2>OUR GOALS</h2>
          <p>
            New Talents Stories Group ifite intego yo guteza imbere impano nshya mu kwandika no gusoma, 
            kwigisha abantu uburyo inkuru zubaka zishobora guhindura ubuzima, ndetse no kwihangira imirimo 
            binyuze mu gukoresha ikoranabuhanga rigezweho. Intego yacu ni ugushishikariza urubyiruko n&apos;abakuze 
            kwandika no gusoma inkuru zifite ireme, kubaka umuco wo gusoma, no gusangiza ibitekerezo byubaka 
            amahoro, ubumwe, n’iterambere ry’imiryango.
          </p>
        </section>

        <section className={styles.mission} id="mission">
          <h2>OUR MISSION</h2>
          <p>
            Misiyo ya New Talents Stories Group ni uguteza imbere impano mu kwandika no gusoma, 
            guhindura ubuzima binyuze mu nkuru zubaka, no kubaka umuryango ushingiye ku bumenyi, 
            amahoro, n’iterambere.
          </p>
        </section>

        <section className={styles.vision} id="vision">
          <h2>OUR VISION</h2>
          <p>
            Icyerekezo cya New Talents Stories Group ni ugusiga isi mu mahoro no guteza imbere 
            impano zose binyuze mu nkuru zubaka.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
