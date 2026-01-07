'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/netweb.module.css';
import { db } from '@/components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NetWeb() {
  const [username, setUsername] = useState('');
  const [siteType, setSiteType] = useState('');
  const [pages, setPages] = useState([]);
  const [components, setComponents] = useState([]);
  const [siteName, setSiteName] = useState('');
  const [budget, setBudget] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     FATA USERNAME MURI LOCALSTORAGE
  ========================= */
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  /* =========================
     OPTIONS
  ========================= */
  const pageOptions = [
    'Home',
    'About',
    'Services',
    'Blog',
    'Contact',
    'Portfolio',
    'Shop',
    'Login',
    'Register',
    'Dashboard',
    'FAQ',
    'newslaters',
    'Stories',
    'Testimonials',
    'Gallery',
    'Pricing',
    'Store',
    'Support',
  ];

  const componentOptions = [
    'Navbar',
    'Footer',
    'Hero Section',
    'Slider',
    'Contact Form',
    'Chat Widget',
    'Search',
    'Newsletter',
    'Map',
    'Sidebar',
    'Sponsor',
    'subscribe',
    'Pricing Cards',
  ];

  /* =========================
     MULTI SELECT HANDLER
  ========================= */
  const toggleSelect = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  /* =========================
     SUBMIT ORDER → FIRESTORE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        username,
        siteType,
        pages,
        components,
        siteName,
        budget,
        whatsapp,
        deadline,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      alert('Order yawe yoherejwe neza ✅');

      setSiteType('');
      setPages([]);
      setComponents([]);
      setSiteName('');
      setBudget('');
      setWhatsapp('');
      setDeadline('');
    } catch (error) {
      console.error(error);
      alert('Habaye ikibazo, ongera ugerageze ❌');
    }

    setLoading(false);
  };

  return (
    <>
    <Head>
        <title>NetWeb Rwanda</title>
        <meta name="description" content="Order your professional website with NetWeb Rwanda. Choose your pages, components, budget, and delivery date easily. Build a stunning website that boosts your business online." />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>
    <Header />
    <div className={styles.container}>
      <h1 className={styles.title}>NetWeb Rwanda – Website Order</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* USERNAME */}
        <div className={styles.field}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* WEBSITE TYPE */}
        <div className={styles.field}>
          <label>Ubwoko bwa Website</label>
          <input
            type="text"
            placeholder="Business, Blog, Ecommerce..."
            value={siteType}
            onChange={(e) => setSiteType(e.target.value)}
            required
          />
        </div>

        {/* PAGES */}
        <div className={styles.field}>
          <label>Pages wifuza (hitamo nyinshi)</label>
          <div className={styles.options}>
            {pageOptions.map((page) => (
              <span
                key={page}
                className={pages.includes(page) ? styles.active : ''}
                onClick={() => toggleSelect(page, pages, setPages)}
              >
                {page}
              </span>
            ))}
          </div>
        </div>

        {/* COMPONENTS */}
        <div className={styles.field}>
          <label>Components wifuza</label>
          <div className={styles.options}>
            {componentOptions.map((comp) => (
              <span
                key={comp}
                className={components.includes(comp) ? styles.active : ''}
                onClick={() => toggleSelect(comp, components, setComponents)}
              >
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* WEBSITE NAME */}
        <div className={styles.field}>
          <label>Izina rya Website</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />
        </div>

        {/* BUDGET */}
        <div className={styles.field}>
          <label>Budget/ Rwf</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>

        {/* WHATSAPP */}
        <div className={styles.field}>
          <label>WhatsApp Number</label>
          <input
            type="tel"
            placeholder="+2507..."
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
        </div>

        {/* DEADLINE */}
        <div className={styles.field}>
          <label>Igihe wifuza ko website igera</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        {/* SUBMIT */}
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Kohereza...' : 'Ohereza Order'}
        </button>
      </form>
    </div>
<Footer />
          </>
  );
}
