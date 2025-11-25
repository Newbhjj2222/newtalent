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


// ------------------ CLEAN CONTENT FUNCTION (FACEBOOK STYLE) ------------------
function cleanContent(html) {
    if (!html) return "";

    let t = html;

    // Keep <p> and style it later
    t = t.replace(/<p[^>]*>/gi, "<p class='fbParagraph'>");
    t = t.replace(/<\/p>/gi, "</p>");

    // Convert <br> to line breaks
    t = t.replace(/<br\s*\/?>/gi, "<br />");

    // Text styling
    t = t.replace(/<b[^>]*>(.*?)<\/b>/gi, "<strong>$1</strong>");
    t = t.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "<strong>$1</strong>");
    t = t.replace(/<i[^>]*>(.*?)<\/i>/gi, "<em>$1</em>");
    t = t.replace(/<em[^>]*>(.*?)<\/em>/gi, "<em>$1</em>");
    t = t.replace(/<u[^>]*>(.*?)<\/u>/gi, "<span style='text-decoration:underline'>$1</span>");

    // Remove unknown tags
    t = t.replace(/<(?!\/?(p|br|strong|em|span)[> ])[^>]+>/g, "");

    // Convert double line breaks to real paragraphs if needed
    t = t.replace(/\n{2,}/g, "</p><p class='fbParagraph'>");

    return t.trim();
}



// ------------------ COMPONENT ------------------
export default function NewsPage({ initialNews }) {
    const [newsList, setNewsList] = useState(
        initialNews.map(n => ({
            ...n,
            cleanContent: cleanContent(n.content),
            expanded: false,
            comments: []
        }))
    );

    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [username, setUsername] = useState("");


    // Username
    useEffect(() => {
        let saved = localStorage.getItem("username");
        if (!saved) {
            saved = prompt("Andika izina ryawe") || "Anonymous";
            localStorage.setItem("username", saved);
        }
        setUsername(saved);
    }, []);


    // Real-time Firestore updates
    useEffect(() => {
        const unsubscribes = initialNews.map(news => {
            const ref = doc(db, "news", news.id);

            // Listen to post updates
            const unsub1 = onSnapshot(ref, snap => {
                const data = snap.data();
                setNewsList(prev =>
                    prev.map(n => (n.id === news.id ? { ...n, ...data } : n))
                );
            });

            // Listen to comments
            const comRef = collection(db, "news", news.id, "comments");
            const unsub2 = onSnapshot(comRef, shoots => {
                const cs = shoots.docs.map(d => d.data());
                setNewsList(prev =>
                    prev.map(n => (n.id === news.id ? { ...n, comments: cs } : n))
                );
            });

            return () => {
                unsub1();
                unsub2();
            };
        });

        return () => unsubscribes.forEach(u => u());
    }, []);


    // Increment views once
    useEffect(() => {
        initialNews.forEach(async n => {
            await updateDoc(doc(db, "news", n.id), {
                views: increment(1)
            });
        });
    }, []);


    const toggleExpand = index => {
        setNewsList(prev =>
            prev.map((n, i) => (i === index ? { ...n, expanded: !n.expanded } : n))
        );
    };

    const likePost = async id => {
        await updateDoc(doc(db, "news", id), { likes: increment(1) });
    };

    const sendComment = async id => {
        if (!commentText.trim()) return;

        const cRef = collection(db, "news", id, "comments");
        const cDoc = doc(cRef);

        await setDoc(cDoc, {
            author: username,
            text: commentText,
            timestamp: serverTimestamp()
        });

        await updateDoc(doc(db, "news", id), {
            commentsCount: increment(1)
        });

        setCommentText("");
        setActiveCommentId(null);
    };

    // Share post function
const sharePost = n => {
    // Clean summary from HTML
    const summary = cleanText(n.cleanContent).slice(0, 350); // first 200 characters
    const textToCopy = `${n.title}\n\n${summary}${n.cleanContent.length > 200 ? "..." : ""}\n${window.location.href}`;

    navigator.clipboard.writeText(textToCopy);
    alert("News copied to clipboard!");
};


    // ------------------ UI ------------------
    return (
        <>
            <Header />
            <Channel />

            <div className={styles.container}>
                {newsList.map((n, index) => (
                    <div key={n.id} className={styles.card}>

                        {/* AUTHOR */}
                        <p className={styles.author}>{n.author}</p>

                        {/* TITLE */}
                        <h2 className={styles.title}>{n.title}</h2>

                        {/* CONTENT */}
                        <div className={styles.textBox}>
                            <div
                                className="fbText"
                                dangerouslySetInnerHTML={{
                                    __html: n.expanded
                                        ? n.cleanContent
                                        : n.cleanContent.slice(0, 300) +
                                        (n.cleanContent.length > 300 ? "..." : "")
                                }}
                            />

                            {n.cleanContent.length > 300 && (
                                <button className={styles.readMoreBtn} onClick={() => toggleExpand(index)}>
                                    {n.expanded ? "Show Less" : "Read More"}
                                </button>
                            )}

                            {n.imageUrl && (
                                <img src={n.imageUrl} alt="" className={styles.image} />
                            )}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className={styles.actions}>
                            <button onClick={() => likePost(n.id)}>
                                <FiHeart /> {n.likes || 0}
                            </button>

                            <button onClick={() => setActiveCommentId(n.id)}>
                                <FiMessageCircle /> {n.commentsCount || 0}
                            </button>

                            <button onClick={() => sharePost(n)}>
                                <FiShare2 />
                            </button>

                            <span className={styles.views}>{n.views || 0} views</span>
                        </div>

                        {/* COMMENT INPUT */}
                        {activeCommentId === n.id && (
                            <div className={styles.commentBox}>
                                <input
                                    type="text"
                                    placeholder="Andika comment..."
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendComment(n.id)}
                                />
                                <button onClick={() => sendComment(n.id)}>Send</button>
                            </div>
                        )}

                        {/* COMMENTS */}
                        {n.comments && n.comments.length > 0 && (
                            <div className={styles.commentsList}>
                                {n.comments.map((c, i) => (
                                    <div key={i} className={styles.commentItem}>
                                        <strong>{c.author}</strong> {c.text}
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


// ------------------ SERVER SIDE ------------------
export async function getServerSideProps() {
    const snap = await getDocs(collection(db, "news"));

    const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        comments: []
    }));

    return { props: { initialNews: data } };
}
