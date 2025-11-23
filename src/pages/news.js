// pages/news.js
import { useState, useEffect } from "react";
import { db } from "@/components/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/news.module.css";
import { 
    collection, 
    doc, 
    getDocs, 
    updateDoc, 
    increment, 
    setDoc, 
    serverTimestamp, 
    onSnapshot 
} from "firebase/firestore";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";

export default function NewsPage({ initialNews }) {
    const [newsList, setNewsList] = useState(initialNews);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");

    // Realtime updates for likes, commentsCount, views
    useEffect(() => {
        const unsubscribers = newsList.map(news => {
            const newsRef = doc(db, "news", news.id);
            return onSnapshot(newsRef, snapshot => {
                const updatedData = snapshot.data();
                setNewsList(prev =>
                    prev.map(n =>
                        n.id === news.id
                            ? {
                                  ...n,
                                  likes: updatedData.likes || 0,
                                  commentsCount: updatedData.commentsCount || 0,
                                  views: updatedData.views || 0
                              }
                            : n
                    )
                );
            });
        });

        return () => unsubscribers.forEach(unsub => unsub());
    }, [newsList.map(n => n.id).join(",")]); // dependency: list of ids

    // Increment views once per user session
    useEffect(() => {
        const incrementViews = async () => {
            newsList.forEach(async news => {
                const newsRef = doc(db, "news", news.id);
                await updateDoc(newsRef, { views: increment(1) });
            });
        };
        incrementViews();
    }, []);

    const toggleExpand = index => {
        setNewsList(prev =>
            prev.map((news, i) =>
                i === index ? { ...news, expanded: !news.expanded } : news
            )
        );
    };

    const handleLike = async id => {
        const newsRef = doc(db, "news", id);
        await updateDoc(newsRef, { likes: increment(1) });
        // State will auto-update via onSnapshot
    };

    const handleComment = async id => {
        if (!commentText.trim()) return;

        const commentsRef = collection(db, "news", id, "comments");
        const commentDocRef = doc(commentsRef);
        await setDoc(commentDocRef, {
            text: commentText,
            timestamp: serverTimestamp()
        });

        const newsRef = doc(db, "news", id);
        await updateDoc(newsRef, { commentsCount: increment(1) });

        setCommentText("");
        setActiveCommentId(null);
        // commentsCount auto-update via onSnapshot
    };

    const handleShare = news => {
        const summary = news.content.substring(0, 200);
        const textToCopy = `${news.title}\n${summary}\n${window.location.href}`;
        navigator.clipboard.writeText(textToCopy);
        alert("News copied to clipboard!");
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {newsList.map((news, index) => (
                    <div key={news.id} className={styles.newsCard}>
                        <p className={styles.author}>{news.author}</p>
                        <h2 className={styles.title}>{news.title}</h2>
                        {news.imageUrl && (
                            <img src={news.imageUrl} alt={news.title} className={styles.image} />
                        )}
                        <div className={styles.content}>
                            <p>
                                {news.expanded
                                    ? news.content
                                    : `${news.content.substring(0, 200)}...`}
                            </p>
                            {news.content.length > 200 && (
                                <button className={styles.expandBtn} onClick={() => toggleExpand(index)}>
                                    {news.expanded ? "Show Less" : "Read More"}
                                </button>
                            )}
                        </div>
                        <div className={styles.actions}>
                            <button onClick={() => handleLike(news.id)}>
                                <FiHeart /> {news.likes || 0}
                            </button>
                            <button onClick={() => setActiveCommentId(news.id)}>
                                <FiMessageCircle /> {news.commentsCount || 0}
                            </button>
                            <button onClick={() => handleShare(news)}>
                                <FiShare2 />
                            </button>
                            <span className={styles.views}>{news.views || 0} views</span>
                        </div>

                        {activeCommentId === news.id && (
                            <div className={styles.commentBox}>
                                <input
                                    type="text"
                                    placeholder="Andika comment..."
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") handleComment(news.id);
                                    }}
                                />
                                <button onClick={() => handleComment(news.id)}>Send</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}

// SSR
export async function getServerSideProps() {
    const snapshot = await getDocs(collection(db, "news"));
    const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expanded: false
    }));

    return { props: { initialNews: newsData } };
}
