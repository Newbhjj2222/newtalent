'use client'; // Muri Next.js 13 App Router, menyesha ko iyi ari client component

import { useState } from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <h1>
          <span className={styles.animate}>New</span>
          <span className={styles.animate}>talents</span>
          <span className={styles.animate}>G</span>
        </h1>
      </div>

      {/* Menu toggle for mobile */}
      <div className={styles.menuToggle} onClick={toggleMenu}>
        <FaBars size={24} />
      </div>

      {/* Navigation links */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
        <li><Link href="/">Homepage</Link></li>
        <li><Link href="/About">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><Link href="/Ibiciro">Ibiciro byinkuru</Link></li>
        <li><Link href="/balance">your Balance</Link></li>
        <li><Link href="/tv">NewtalentsG Tv</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/news">News/fashions</Link></li>
        <li><Link href="/lyrics">Songs and lyrics</Link></li>
        <li><Link href="/Nesgain">Nesgain game</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </header>
  );
};

export default Header;
