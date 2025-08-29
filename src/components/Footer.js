// components/Footer.js
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <h4>Quick Links</h4>
        <ul className={styles.linkList}>
          <li><a href="/">Home</a></li>
          <li><a href="/balance">Your Balance</a></li>
          <li><a href="/About">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className={styles.footerSection}>
        <h4>About Us</h4>
        <p>
          NewtalentsG is a creative platform for young talents. It is a library of different stories.
        </p>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2025 NewtalentsG. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
