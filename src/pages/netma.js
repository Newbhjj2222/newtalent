'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/netma.module.css';
import { db } from '@/components/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';

export default function NetMa() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order
  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
    setDeletingId(null);
  };

  return (
    <>
      <Head>
        <title>NetWeb Orders - NetMa</title>
        <meta name="description" content="View all website orders submitted through NetWeb Rwanda. Admin can manage, review and delete any order." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>

      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>All Website Orders</h1>

        {loading ? (
          <p className={styles.loading}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className={styles.noOrders}>No orders yet.</p>
        ) : (
          <div className={styles.orderList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <h2>{order.siteName}</h2>
                <p><strong>User:</strong> {order.username}</p>
                <p><strong>Website Type:</strong> {order.siteType}</p>
                <p><strong>Pages:</strong> {order.pages.join(', ')}</p>
                <p><strong>Components:</strong> {order.components.join(', ')}</p>
                <p><strong>Budget:</strong> {order.budget} Rwf</p>
                <p><strong>WhatsApp:</strong> {order.whatsapp}</p>
                <p><strong>Deadline:</strong> {order.deadline}</p>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(order.id)}
                  disabled={deletingId === order.id}
                >
                  {deletingId === order.id ? 'Deleting...' : 'Delete'}
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
