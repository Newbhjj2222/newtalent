// components/Footer.js
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <h4>Quick Links</h4>
        <ul className={styles.linkList}>
          <li>
            <Link href="/">Home</Link>
          </li>
         <li>
            <Link href="/profile">Your Profile</Link>
          </li>
           <li>
            <Link href="/tv">Newtalentg Tv</Link>
          </li>
          <li>
            <Link href="/web">Web market Rwanda</Link>
          </li>
         <li>
            <Link href="/chat">Private Chat</Link>
          </li>
          <li>
            <Link href="/balance">Your Balance</Link>
          </li>
           <li>
            <Link href="/Ibiciro">Ibiciro byinkuru</Link>
          </li>
          <li>
            <Link href="/About">About</Link>
          </li>
          <li>
            <Link href="/news">Amakuru</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/poll">RQA game</Link>
          </li>
           <li>
            <Link href="/netweb">Koresha website na Netweb Rwanda</Link>
          </li>
          <li>
            <Link href="/Monitize">Monitization</Link>
          </li>
          <li>
            <Link href="/privacy">Privacy and policy</Link>
          </li>
           <li>
            <Link href="/terms">Terms and conditions</Link>
          </li>
        </ul>
      </div>

      <div className={styles.footerSection}>
        <h4>About Us</h4>
        <p>
          NewtalentsG is a creative platform for young talents. It is a library of different stories. welcome and read more stories.
        </p>
      </div>

      <div className={styles.footerBottom}>
        <p>
  © {new Date().getFullYear()} NewtalentsG. All rights reserved. Designed by NetWeb Rwanda 
</p>
      </div>
    </footer>
  );
};

export default Footer;
