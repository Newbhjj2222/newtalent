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
    const [username, setUsername] = useState("");

    // Get or set username in localStorage
    useEffect(() => {
        let storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            storedUsername = prompt("Andika izina ryawe") || "Anonymous";
            localStorage.setItem("username", storedUsername);
        }
        setUsername(storedUsername);
    }, []);

    // Realtime updates for likes, commentsCount, views and comments
    useEffect(() => {
        const unsubscribers = newsList.map(news => {
            const newsRef = doc(db, "news", news.id);

            // Listen for main news changes
            const unsubNews = onSnapshot(newsRef, snapshot => {
                const updatedData = snapshot.data();
                setNewsList(prev => prev.map(n =>
                    n.id === news.id
                        ? {
                            ...n,
                            likes: updatedData.likes || 0,
                            commentsCount: updatedData.commentsCount || 0,
                            views: updatedData.views || 0
                          }
                        : n
                ));
            });

            // Listen for comments subcollection
            const commentsRef = collection(db, "news", news.id, "comments");
            const unsubComments = onSnapshot(commentsRef, snapshot => {
                const comments = snapshot.docs.map(doc => doc.data());
                setNewsList(prev =>
                    prev.map(n => n.id === news.id ? { ...n, comments } : n)
                );
            });

            return () => {
                unsubNews();
                unsubComments();
            };
        });

        return () => unsubscribers.forEach(unsub => unsub());
    }, [newsList.map(n => n.id).join(",")]);

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
    };

    const handleComment = async id => {
        if (!commentText.trim()) return;

        const commentsRef = collection(db, "news", id, "comments");
        const commentDocRef = doc(commentsRef);
        await setDoc(commentDocRef, {
            text: commentText,
            author: username,
            timestamp: serverTimestamp()
        });

        const newsRef = doc(db, "news", id);
        await updateDoc(newsRef, { commentsCount: increment(1) });

        setCommentText("");
        setActiveCommentId(null);
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

                        {/* Actions row */}
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

                        {/* Comment input */}
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

                        {/* Comments list */}
                        {news.comments && news.comments.length > 0 && (
                            <div className={styles.commentsList}>
                                {news.comments.map((c, idx) => (
                                    <div key={idx} className={styles.commentItem}>
                                        <strong>{c.author}:</strong> {c.text}
                                    </div>
                                ))}
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
