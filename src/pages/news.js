// pages/news.js "use client";

import { useState, useEffect } from "react"; import { db } from "@/components/firebase"; import Header from "@/components/Header"; import Footer from "@/components/Footer"; import styles from "@/styles/news.module.css"; import { collection, doc, getDocs, updateDoc, increment, serverTimestamp, } from "firebase/firestore"; import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";

export default function NewsPage({ initialNews }) { const [newsList, setNewsList] = useState(initialNews);

useEffect(() => { // Increment views when component mounts newsList.forEach(async (news) => { const newsRef = doc(db, "news", news.id); await updateDoc(newsRef, { views: increment(1) }); }); }, []);

const toggleExpand = (index) => { const updated = [...newsList]; updated[index].expanded = !updated[index].expanded; setNewsList(updated); };

const handleLike = async (id) => { const newsRef = doc(db, "news", id); await updateDoc(newsRef, { likes: increment(1) }); const updated = newsList.map((n) => n.id === id ? { ...n, likes: n.likes + 1 } : n ); setNewsList(updated); };

const handleShare = (news) => { const summary = news.content.substring(0, 200); const textToCopy = ${news.title}\n${summary}\n${window.location.href}; navigator.clipboard.writeText(textToCopy); alert("News copied to clipboard!"); };

return ( <> <Header /> <div className={styles.container}> {newsList.map((news, index) => ( <div key={news.id} className={styles.newsCard}> <p className={styles.author}>{news.author}</p> <h2 className={styles.title}>{news.title}</h2> {news.imageUrl && ( <img src={news.imageUrl} alt={news.title} className={styles.image} /> )} <div className={styles.content}> <p> {news.expanded ? news.content : ${news.content.substring(0,200)}...} </p> {news.content.length > 200 && ( <button className={styles.expandBtn} onClick={() => toggleExpand(index)}> {news.expanded ? "Show Less" : "Read More"} </button> )} </div> <div className={styles.actions}> <button onClick={() => handleLike(news.id)}> <FiHeart /> {news.likes || 0} </button> <button> <FiMessageCircle /> {news.commentsCount || 0} </button> <button onClick={() => handleShare(news)}> <FiShare2 /> </button> <span className={styles.views}>{news.views || 0} views</span> </div> </div> ))} </div> <Footer /> </> ); }

export async function getServerSideProps() { const snapshot = await getDocs(collection(db, "news")); const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), expanded: false }));

return { props: { initialNews: newsData } }; }

