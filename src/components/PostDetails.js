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
import Header from './Header';
import Banner from './Banner';
import './PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const db = getFirestore();

  /* ------------------------------------------------------------------ */
  /*                             FETCH DATA                             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
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

        const postData = postSnap.data();
        setPost(postData);

        const commentsRef = collection(db, 'posts', id, 'comments');
        const querySnap = await getDocs(commentsRef);
        setComments(querySnap.docs.map((d) => d.data()));

        await handlePaywall(postData, storedUsername); // NeS logic
      } catch (error) {
        console.error('Error fetching post and comments:', error);
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

    const handlePaywall = async (postData, username) => {
      try {
        const depositerRef = doc(db, 'depositers', username);
        const depositerSnap = await getDoc(depositerRef);

        if (!depositerSnap.exists()) {
          alert(
            'Ntabwo tubona account yawe. Banza winjire cyangwa wiyandikishe.',
          );
          navigate('/login');
          return;
        }

        const currentNes = Number(depositerSnap.data().nes) || 0;
        if (currentNes < 1) {
          alert(
            'Nta NeS point zihagije ngo wemererwe gusoma iyi nkuru. Tugiye kukujyana aho uzigurira.',
          );
          navigate('/balance');
          return;
        }
        await updateDoc(depositerRef, { nes: currentNes - 1 });

        const authorRef = doc(db, 'authors', postData.author);
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          const currentAuthorNes = Number(authorSnap.data().nes) || 0;
          await updateDoc(authorRef, { nes: currentAuthorNes + 1 });
        }
      } catch (error) {
        console.error('Error updating NES fields:', error);
      }
    };

    (async () => {
      await fetchPostAndComments();
      await recordView();
    })();
  }, [id, navigate, db]);

  /* ------------------------------------------------------------------ */
  /*                          COMMENT HANDLING                          */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*                             SHARE POST                             */
  /* ------------------------------------------------------------------ */
  const handleShare = async () => {
    try {
      const postUrl = window.location.href;

      const cleanText = post.story
        .replace(/<[^>]+>/g, '')     // strip HTML tags
        .replace(/&nbsp;/g, ' ')     // convert HTML entity
        .replace(/\u00A0/g, ' ')     // convert NBSP char
        .trim()
        .slice(0, 650);

      const shareText = `${post.head}\n\n${cleanText}...\n\nRead more: ${postUrl}`;

      const canShareFiles =
        navigator.canShare && navigator.canShare({ files: [] });
      const canShareBasic =
        navigator.canShare && navigator.canShare({ title: '', text: '', url: '' });

      let files = [];

      if (post.imageUrl && canShareFiles) {
        const resp = await fetch(post.imageUrl);
        const blob = await resp.blob();
        const fileName = `post-${Date.now()}.${blob.type.split('/')[1]}`;
        files.push(new File([blob], fileName, { type: blob.type }));
        await navigator.share({ title: post.head, text: shareText, url: postUrl, files });
      } else if (canShareBasic) {
        await navigator.share({ title: post.head, text: shareText, url: postUrl });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Browser yawe ntishyigikira Web Share; text yashyizwe kuri clipboard.');
      }

      alert('Post yoherejwe neza!');
    } catch (err) {
      console.error(err);
      alert(`Sharing yanze: ${err.message}`);
    }
  };

  if (!post) return <div>Loading...</div>;

  /* ------------------------------------------------------------------ */
  /*                               RENDER                               */
  /* ------------------------------------------------------------------ */
  return (
    
    <div
      className="post-details"
      style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}
    >
  
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.head}
          style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 20 }}
        />
      )}

      <h2>{post.head}</h2>

      <div
        className="post-story"
        dangerouslySetInnerHTML={{ __html: post.story }}
        style={{ lineHeight: 1.7, fontSize: '1.05rem', marginTop: 10 }}
      />

      {/* meta & share */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 15,
        }}
      >
        <small>By: {post.author}</small>
        <button
          onClick={handleShare}
          style={{
            backgroundColor: '#2196f3',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <FaShareAlt /> Share
        </button>
      </div>

      {/* comments */}
      <h3 style={{ marginTop: 25 }}>Comments</h3>

      {currentUser ? (
        <div style={{ marginBottom: 15 }}>
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              marginTop: 10,
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p style={{ marginBottom: 10 }}>
          <b>Only logged-in users can comment.</b>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              padding: '6px 12px',
              cursor: 'pointer',
              marginLeft: 10,
            }}
          >
            Login
          </button>
        </p>
      )}

      {comments.length ? (
        comments.map((c, i) => (
          <div
            key={i}
            className="comment"
            style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}
          >
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
