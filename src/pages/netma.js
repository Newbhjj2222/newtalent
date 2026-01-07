import Head from 'next/head';
import styles from '@/styles/netma.module.css';
import { db } from '@/components/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query
} from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/* =========================
   PAGE COMPONENT
========================= */
export default function NetMa({ orders }) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order?'
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'orders', id));
      window.location.reload(); // refresh SSR page
    } catch (error) {
      console.error(error);
      alert('Failed to delete order');
    }
  };

  return (
    <>
      <Head>
        <title>NetWeb Admin – Orders</title>
        <meta
          name="description"
          content="Admin dashboard for viewing and managing all website orders submitted through NetWeb Rwanda."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>Website Orders</h1>

        {orders.length === 0 ? (
          <p className={styles.empty}>No orders found.</p>
        ) : (
          <div className={styles.grid}>
            {orders.map((order) => (
              <div key={order.id} className={styles.card}>
                <h2 className={styles.site}>{order.siteName}</h2>

                <p><b>User:</b> {order.username}</p>
                <p><b>Type:</b> {order.siteType}</p>
                <p><b>Pages:</b> {order.pages.join(', ')}</p>
                <p><b>Components:</b> {order.components.join(', ')}</p>
                <p><b>Budget:</b> {order.budget} Rwf</p>
                <p><b>WhatsApp:</b> {order.whatsapp}</p>
                <p><b>Deadline:</b> {order.deadline}</p>

                <button
                  className={styles.delete}
                  onClick={() => handleDelete(order.id)}
                >
                  Delete Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

/* =========================
   SSR: FETCH ORDERS
========================= */
export async function getServerSideProps() {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        orders: [],
      },
    };
  }
}
