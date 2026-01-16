'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Toggle menu
  const toggleMenu = () => setIsOpen(prev => !prev);

  // Funga menu iyo ukanze ahandi
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Funga menu iyo ukanze link
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <div className={styles.logo}>
  <img src="/net.png" alt="Net Logo" className={styles.logoImage} />
</div>

      {/* MENU TOGGLE (MOBILE) */}
      <div className={styles.menuToggle} onClick={toggleMenu}>
        <FaBars />
      </div>

      {/* NAVIGATION */}
      <ul
        ref={menuRef}
        className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}
      >
        <li><Link href="/netweb" onClick={closeMenu}>NetWeb Rwanda| koresha website</Link></li>
        <li><Link href="/" onClick={closeMenu}>Soma Inkuru</Link></li>
        <li><Link href="/web" onClick={closeMenu}>Webmarket Rwanda</Link></li>
        <li><Link href="/About" onClick={closeMenu}>About</Link></li>
        <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>
        <li><Link href="/login" onClick={closeMenu}>Login</Link></li>
        <li><Link href="/profile" onClick={closeMenu}>Profile</Link></li>
      </ul>
    </header>
  );
};

export default Header;
