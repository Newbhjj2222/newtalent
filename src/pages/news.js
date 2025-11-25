"use client";
import { useState, useEffect } from "react";
import { db } from "@/components/firebase";
import Header from "@/components/Header";
import Channel from "@/components/Channel";
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

// ---- Clean HTML Function ----
function cleanContent(text) {
    if (!text) return "";

    let t = text;

    // keep line breaks
    t = t.replace(/<br\s*\/?>/gi, "\n");
    t = t.replace(/<\/p>/gi, "\n\n");
    t = t.replace(/<p[^>]*>/gi, "");

    // Bold / italic / underline
    t = t.replace(/<b[^>]*>(.*?)<\/b>/gi, "<span style='font-weight:bold'>$1</span>");
    t = t.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "<span style='font-weight:bold'>$1</span>");
    t = t.replace(/<i[^>]*>(.*?)<\/i>/gi, "<span style='font-style:italic'>$1</span>");
    t = t.replace(/<em[^>]*>(.*?)<\/em>/gi, "<span style='font-style:italic'>$1</span>");
    t = t.replace(/<u[^>]*>(.*?)<\/u>/gi, "<span style='text-decoration:underline'>$1</span>");

    // Remove unwanted tags
    t = t.replace(/<(?!\/?span)[^>]+>/g, "");

    return t.trim();
}

export default function NewsPage({ initialNews }) {
    const [newsList, setNewsList] = useState(
        initialNews.map(n => ({
            ...n,
            cleanContent: cleanContent(n.content),
            comments: n.comments || [],
            expanded: false
        }))
    );

    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [username, setUsername] = useState("");

    // Get or set username
    useEffect(() => {
        let storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            storedUsername = prompt("Andika izina ryawe") || "Anonymous";
            localStorage.setItem("username", storedUsername);
        }
        setUsername(storedUsername);
    }, []);

    // Real-time listeners (run ONCE)
    useEffect(() => {
        const unsubscribes = initialNews.map(news => {
            const newsRef = doc(db, "news", news.id);

            // Listen to likes, commentsCount, views
            const unsub1 = onSnapshot(newsRef, snapshot => {
                const updated = snapshot.data();
                setNewsList(prev =>
                    prev.map(n => (n.id === news.id ? { ...n, ...updated } : n))
                );
            });

            // Listen to comments
            const commentsRef = collection(db, "news", news.id, "comments");
            const unsub2 = onSnapshot(commentsRef, snapshot => {
                const comments = snapshot.docs.map(doc => doc.data());
                setNewsList(prev =>
                    prev.map(n => (n.id === news.id ? { ...n, comments } : n))
                );
            });

            return () => {
                unsub1();
                unsub2();
            };
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, []); // no dependency loop

    // Increment views ONCE
    useEffect(() => {
        initialNews.forEach(async news => {
            const ref = doc(db, "news", news.id);
            await updateDoc(ref, { views: increment(1) });
        });
    }, []);

    const toggleExpand = index => {
        setNewsList(prev =>
            prev.map((n, i) =>
                i === index ? { ...n, expanded: !n.expanded } : n
            )
        );
    };

    const handleLike = async id => {
        const ref = doc(db, "news", id);
        await updateDoc(ref, { likes: increment(1) });
    };

    const handleComment = async id => {
        if (!commentText.trim()) return;

        const commentsRef = collection(db, "news", id, "comments");
        const commentDoc = doc(commentsRef);

        await setDoc(commentDoc, {
            text: commentText,
            author: username,
            timestamp: serverTimestamp()
        });

        const ref = doc(db, "news", id);
        await updateDoc(ref, { commentsCount: increment(1) });

        setCommentText("");
        setActiveCommentId(null);
    };

    const handleShare = news => {
        const summary = news.cleanContent.substring(0, 200);
        const textToCopy = `${news.title}\n${summary}\n${window.location.href}`;
        navigator.clipboard.writeText(textToCopy);
        alert("Copied!");
    };

    return (
        <>
            <Header />
            <Channel />

            <div className={styles.container}>
                {newsList.map((news, index) => (
                    <div key={news.id} className={styles.newsCard}>

                        <p className={styles.author}>{news.author}</p>
                        <h2 className={styles.title}>{news.title}</h2>

                        <div className={styles.content}>
                            <div
                                style={{ whiteSpace: "pre-wrap" }}
                                dangerouslySetInnerHTML={{
                                    __html: news.expanded
                                        ? news.cleanContent
                                        : news.cleanContent.slice(0, 200) + (news.cleanContent.length > 200 ? "..." : "")
                                }}
                            />

                            {news.cleanContent.length > 200 && (
                                <button
                                    className={styles.expandBtn}
                                    onClick={() => toggleExpand(index)}
                                >
                                    {news.expanded ? "Show Less" : "Read More"}
                                </button>
                            )}

                            {news.imageUrl && (
                                <img
                                    src={news.imageUrl}
                                    alt={news.title}
                                    className={styles.image}
                                />
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
                                    onKeyDown={e => e.key === "Enter" && handleComment(news.id)}
                                />
                                <button onClick={() => handleComment(news.id)}>Send</button>
                            </div>
                        )}

                        {news.comments && news.comments.length > 0 && (
                            <div className={styles.commentsList}>
                                {news.comments.map((c, i) => (
                                    <div key={i} className={styles.commentItem}>
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

// SERVER SIDE
export async function getServerSideProps() {
    const snap = await getDocs(collection(db, "news"));

    const newsData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        comments: []
    }));

    return { props: { initialNews: newsData } };
}
