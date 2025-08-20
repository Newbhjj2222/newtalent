import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { FaShareAlt } from 'react-icons/fa';
import './PostDetails.css';
import { useTheme } from './Theme';
import Bible from './Bible';
import { Helmet } from 'react-helmet';

// Function yo gutoranya title, season, episode muri head
const extractSeriesAndEpisode = (head) => {
    if (!head) return { title: null, season: null, episode: null };

    const cleanedHead = head
        .replace(/[/-_:.]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();

    const allSeasons = [...cleanedHead.matchAll(/SEASON\s0?(\d+)|S\s0?(\d+)/ig)]
        .map(m => parseInt(m[1] || m[2], 10))
        .filter(Boolean);

    let season = allSeasons.length ? Math.min(...allSeasons) : null;

    let episode = null;
    const episodeMatch = cleanedHead.match(/EPISODE\s0?(\d+)|EP\s0?(\d+)|E\s*0?(\d+)/i);
    if (episodeMatch) {
        episode = parseInt(episodeMatch[1] || episodeMatch[2] || episodeMatch[3], 10);
    }

    const isFinal = /FINAL(LY)?/.test(cleanedHead);
    if (isFinal) {
        episode = 999;
        if (!season) season = 1;
    } else if (!episode && allSeasons.length > 1) {
        const maxSeason = Math.max(...allSeasons);
        if (!season || maxSeason > season) {
            season = maxSeason;
            episode = 1;
        }
    } else if (!episode) {
        episode = 1;
    }

    const title = cleanedHead
        .replace(/SEASON\s0?\d+/ig, '')
        .replace(/S\s0?\d+/ig, '')
        .replace(/EPISODE\s0?\d+/ig, '')
        .replace(/EP\s0?\d+/ig, '')
        .replace(/E\s*0?\d+/ig, '')
        .replace(/FINAL(LY)?/ig, '')
        .trim();

    return { title, season, episode };
};

const PostDetails = () => {
    const { darkMode, setDarkMode, fontSize, setFontSize, fontStyle, setFontStyle } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const db = getFirestore();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [nextPostId, setNextPostId] = useState(null);
    const [prevPostId, setPrevPostId] = useState(null);

    useEffect(() => {
        const handlePaywall = async (postData, username) => {
            try {
                const isAuthor = username === postData.author;
                const isNewTalentsg = username.toLowerCase() === 'newtalentsg';
                if (isNewTalentsg || isAuthor) return;

                const depositerRef = doc(db, 'depositers', username);
                const depositerSnap = await getDoc(depositerRef);
                if (!depositerSnap.exists()) {
                    alert('Account yawe ntabwo tuyibona mubaguze NeS. Tugiye kukujyana aho uzigurira.');
                    navigate('/balance');
                    return;
                }
                const currentNes = Number(depositerSnap.data().nes) || 0;
                if (currentNes < 1) {
                    alert('Nta NeS ufite zihagije zo gusoma iyi nkuru. Tugiye kukujyana aho uzigurira.');
                    navigate('/balance');
                    return;
                }
                await updateDoc(depositerRef, { nes: currentNes - 1 });
                if (username !== postData.author) {
                    const authorRef = doc(db, 'authors', postData.author);
                    const authorSnap = await getDoc(authorRef);
                    if (authorSnap.exists()) {
                        const currentAuthorNes = Number(authorSnap.data().nes) || 0;
                        await updateDoc(authorRef, { nes: currentAuthorNes + 1 });
                    }
                }
            } catch (error) {
                console.error('Error updating NES fields:', error);
            }
        };

        const fetchPostAndComments = async () => {
            try {
                const storedUsername = localStorage.getItem('username');
                if (!storedUsername) {
                    navigate('/login');
                    return;
                }
                setCurrentUser(storedUsername);
                const postRef = doc(db, 'posts', id);
                const postSnap = await getDoc(postRef);
                if (!postSnap.exists()) {
                    alert('Post not found.');
                    navigate('/');
                    return;
                }
                const postData = { id: postSnap.id, ...postSnap.data() };
                setPost(postData);

                const commentsRef = collection(db, 'posts', id, 'comments');
                const querySnap = await getDocs(commentsRef);
                setComments(querySnap.docs.map((d) => d.data()));

                await findAdjacentPosts(postData);
                await handlePaywall(postData, storedUsername);
            } catch (error) {
                console.error('Error fetching post and comments:', error);
            }
        };

        const findAdjacentPosts = async (currentPost) => {
try {
const allPostsSnap = await getDocs(collection(db, 'posts'));
const allPosts = allPostsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

const current = extractSeriesAndEpisode(currentPost.head);  
    if (!current.title || current.episode === null) {  
      console.warn("Could not extract title/episode from head:", currentPost.head);  
      return;  
    }  

    const sameSeriesPosts = allPosts  
      .map((p) => ({ ...p, ...extractSeriesAndEpisode(p.head) }))  
      .filter(  
        (p) => p.title === current.title && p.season === current.season && p.episode !== null  
      )  
      .sort((a, b) => a.episode - b.episode);  

    const currentIndex = sameSeriesPosts.findIndex((p) => p.id === currentPost.id);  

    setPrevPostId(currentIndex > 0 ? sameSeriesPosts[currentIndex - 1].id : null);  
    setNextPostId(currentIndex < sameSeriesPosts.length - 1 ? sameSeriesPosts[currentIndex + 1].id : null);  
  } catch (error) {  
    console.error("Error finding adjacent posts:", error);  
  }  
};
        const recordView = async () => {
            try {
                const readerRef = collection(db, 'readers', id, 'views');
                await addDoc(readerRef, { viewedAt: new Date().toISOString() });
            } catch (error) {
                console.error('Failed to record view', error);
            }
        };

        const runAll = async () => {
            await fetchPostAndComments();
            await recordView();
        };
        runAll();

    }, [id, navigate, db]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            const commentRef = collection(db, 'posts', id, 'comments');
            await addDoc(commentRef, {
                text: newComment,
                author: currentUser,
                createdAt: new Date().toISOString(),
            });
            setNewComment('');
            const updated = await getDocs(commentRef);
            setComments(updated.docs.map((d) => d.data()));
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    const handleShare = async () => {
        try {
            const postUrl = window.location.href;
            const cleanText = post.story
                .replace(/<[^>]+>/g, '')
                .replace(/\u00A0/g, ' ')
                .trim()
                .slice(0, 650);

            const shareText = `${post.head}\n\n${cleanText}...\n\nRead more: ${postUrl}`;
            if (navigator.canShare && navigator.canShare({ files: [] })) {
                const response = await fetch(post.imageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'post-image.jpg', { type: blob.type });
                await navigator.share({
                    title: post.head,
                    text: shareText,
                    url: postUrl,
                    files: [file],
                });
            } else if (navigator.share) {
                await navigator.share({ title: post.head, text: shareText, url: postUrl });
            } else {
                await navigator.clipboard.writeText(shareText);
                alert('Browser yawe ntishyigikira Web Share API; yashyizwe kuri clipboard.');
            }
        } catch (err) {
            console.error(err);
            alert(`Sharing yanze: ${err.message}`);
        }
    };

    if (!post) return <div>Loading...</div>;

    const postDescription = post.story.replace(/<[^>]+>/g, '').slice(0, 160);

    return (
        <div className="post-details" style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
            <Helmet>
                <title>{post.head}</title>
                <meta name="description" content={postDescription} />
                <meta property="og:description" content={postDescription} />
                {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
                <meta name="twitter:card" content={post.imageUrl ? "summary_large_image" : "summary"} />
                <meta name="twitter:description" content={postDescription} />
                {post.imageUrl && <meta name="twitter:image" content={post.imageUrl} />}
            </Helmet>

            {post.imageUrl && (
                <img src={post.imageUrl} alt={post.head} style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 20 }} />
            )}
            <h2>{post.head}</h2>
            <Bible />
            <div className="post-story" dangerouslySetInnerHTML={{ __html: post.story }} style={{ lineHeight: 1.7, marginTop: 10 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                <small>By: {post.author}</small>
                <button onClick={handleShare} style={{ backgroundColor: '#2196f3', border: 'none', padding: '8px 16px', borderRadius: 8, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaShareAlt /> Share
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                <button disabled={!prevPostId} onClick={() => navigate(`/post/${prevPostId}`)} style={{ padding: '8px 16px', backgroundColor: prevPostId ? '#4caf50' : '#eee', color: prevPostId ? 'white' : 'black', border: '1px solid #ccc', borderRadius: 6, cursor: prevPostId ? 'pointer' : 'not-allowed' }}>
                    ⬅ Previous Episode
                </button>
                <button disabled={!nextPostId} onClick={() => navigate(`/post/${nextPostId}`)} style={{ padding: '8px 16px', backgroundColor: nextPostId ? '#4caf50' : '#eee', color: nextPostId ? 'white' : 'black', border: '1px solid #ccc', borderRadius: 6, cursor: nextPostId ? 'pointer' : 'not-allowed' }}>
                    Next Episode ➡
                </button>
            </div>
            <h3 style={{ marginTop: 25 }}>Comments</h3>
            {currentUser ? (
                <div style={{ marginBottom: 15 }}>
                    <textarea placeholder="Write your comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }} />
                    <button onClick={handleCommentSubmit} style={{ marginTop: 10, padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                        Post Comment
                    </button>
                </div>
            ) : (
                <p style={{ marginBottom: 10 }}>
                    <b>Only logged-in users can comment.</b>
                    <button onClick={() => navigate('/login')} style={{ backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: 5, padding: '6px 12px', cursor: 'pointer', marginLeft: 10 }}>
                        Login
                    </button>
                </p>
            )}
            {comments.length ? (
                comments.map((c, i) => (
                    <div key={i} className="comment" style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <p>{c.text}</p>
                        <small>By: {c.author}</small>
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
};

export default PostDetails;
