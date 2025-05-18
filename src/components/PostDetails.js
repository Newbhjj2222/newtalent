import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getFirestore, doc, getDoc, collection, addDoc, getDocs, updateDoc
} from 'firebase/firestore';
import { FaShareAlt } from 'react-icons/fa';
import Header from './Header';
import Banner from './Banner';
import './PostDetails.css';

const PostDetails = () => {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const db               = getFirestore();

  const [post, setPost]         = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  /* ------------------------------------------------------------------ */
  /*  SHARE HANDLER (mu scope ya component, *ntabwo* muri JSX)          */
  /* ------------------------------------------------------------------ */
  const handleShare = useCallback(async () => {
    if (!post) return;

    // 1. Igenzura rya support
    const canShareBasic = Boolean(navigator.share);
    const testFile      = new File([], 'x');            // dummy kugira ngo dusuzume
    const canShareFiles = navigator.canShare &&
                          navigator.canShare({ files: [testFile] });

    try {
      const postUrl   = window.location.href;
      const cleanText = post.story
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .slice(0, 650);
      const shareText = `${post.head}\n\n${cleanText}...\n\nRead more: ${postUrl}`;

      let files = [];
      if (post.imageUrl && canShareFiles) {
        const resp  = await fetch(post.imageUrl);
        const blob  = await resp.blob();
        const ext   = blob.type.split('/')[1] || 'jpg';
        const fname = `post-${Date.now()}.${ext}`;
        files.push(new File([blob], fname, { type: blob.type }));
      }

      if (canShareFiles) {
        await navigator.share({ title: post.head, text: shareText, url: postUrl, files });
      } else if (canShareBasic) {
        await navigator.share({ title: post.head, text: shareText, url: postUrl });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Browser ntiyashyigikiye Web Share; text igiye kuri clipboard.');
        return;
      }

      alert('Post yoherejwe neza!');
    } catch (err) {
      console.error(err);
      alert('Sharing yanze: ' + err.message);
    }
  }, [post]);
  /* ------------------------------------------------------------------ */

  /* ----------------------- Fetch & gating logic --------------------- */
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/login');
      return;
    }
    setCurrentUser(storedUsername);

    const fetchPostAndComments = async () => { /* …same code… */ };
    const recordView           = async () => { /* …same code… */ };

    (async () => {
      await fetchPostAndComments();
      await recordView();
    })();
  }, [id, navigate, db]);
  /* ------------------------------------------------------------------ */

  const handleCommentSubmit = async () => { /* …same code… */ };

  if (!post) return <p>Loading…</p>;

  return (
    <>
      <Header />
      <Banner />

      <div className="post-details" style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.head}
               style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 20 }} />
        )}

        <h2>{post.head}</h2>

        <div
          className="post-story"
          dangerouslySetInnerHTML={{ __html: post.story }}
          style={{ lineHeight: 1.7, fontSize: '1.05rem', marginTop: 10 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
          <small>By: {post.author}</small>

          <button onClick={handleShare}
                  style={{
                    backgroundColor: '#2196f3',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
            <FaShareAlt /> Share
          </button>
        </div>

        {/* ------------------------- Comments ------------------------- */}
        <h3 style={{ marginTop: 25 }}>Comments</h3>

        {currentUser ? (
          <>
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              style={{
                width: '100%', padding: 10, borderRadius: 8,
                border: '1px solid #ccc', resize: 'vertical'
              }}
            />
            <button onClick={handleCommentSubmit}
                    style={{
                      marginTop: 10, padding: '8px 16px',
                      backgroundColor: '#4caf50', color: '#fff',
                      border: 'none', borderRadius: 6, cursor: 'pointer'
                    }}>
              Post Comment
            </button>
          </>
        ) : (
          <p style={{ marginBottom: 10 }}>
            <b>Only logged-in users can comment.</b>{' '}
            <button onClick={() => navigate('/login')}
                    style={{
                      backgroundColor: '#4caf50', color: '#fff',
                      border: 'none', borderRadius: 5,
                      padding: '6px 12px', cursor: 'pointer', marginLeft: 10
                    }}>
              Login
            </button>
          </p>
        )}

        {comments.length ? (
          comments.map((c, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <p>{c.text}</p>
              <small>By: {c.author}</small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </>
  );
};

export default PostDetails;
