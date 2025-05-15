import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchPostAndComments = async () => {
      const postRef = doc(db, 'posts', id);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        setPost(postSnap.data());
      }

      const commentsRef = collection(db, 'posts', id, 'comments');
      const querySnap = await getDocs(commentsRef);
      const commentsData = querySnap.docs.map(doc => doc.data());
      setComments(commentsData);
    };

    const recordView = async () => {
      try {
        const readerRef = collection(db, 'readers', id, 'views');
        await addDoc(readerRef, {
          viewedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Failed to record view", error);
      }
    };

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setCurrentUser(storedUsername);
      console.log("Logged in as:", storedUsername);
    }

    fetchPostAndComments();
    recordView();
  }, [id, db]);

  const handleShare = async () => {
  try {
    const postUrl = window.location.href;

    const plainTextStory = post.story
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ');

    const excerpt = plainTextStory.length > 150
      ? plainTextStory.slice(0, 150) + '...'
      : plainTextStory;

    const shareText = `${post.head}\n\n${excerpt}\n\nRead more here: ${postUrl}`;

    await navigator.clipboard.writeText(shareText);

    if (post.imageUrl) {
      const imageResponse = await fetch(post.imageUrl);
      const imageBlob = await imageResponse.blob();
      const imageURL = URL.createObjectURL(imageBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = imageURL;
      downloadLink.download = 'post-image.jpg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(imageURL);
    }

    alert("Post info copied to clipboard and image downloaded!");
  } catch (error) {
    alert("Failed to share post: " + error.message);
  }
};



  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;
    try {
      const commentRef = collection(db, 'posts', id, 'comments');
      await addDoc(commentRef, {
        text: newComment,
        author: currentUser,
        createdAt: new Date().toISOString()
      });
      setNewComment('');

      const newCommentsSnap = await getDocs(commentRef);
      const newComments = newCommentsSnap.docs.map(doc => doc.data());
      setComments(newComments);
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <Banner />
      <div className="post-details" style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.head}
            style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '20px' }}
          />
        )}
        <h2>{post.head}</h2>
        <div
          className="post-story"
          dangerouslySetInnerHTML={{ __html: post.story }}
          style={{ lineHeight: '1.7', fontSize: '1.05rem', marginTop: '10px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <small>By: {post.author}</small>
          <button
            onClick={handleShare}
            style={{
              backgroundColor: '#2196f3',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaShareAlt /> Share
          </button>
        </div>

        <h3 style={{ marginTop: '25px' }}>Comments</h3>

        {currentUser ? (
          <div style={{ marginBottom: '15px' }}>
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                resize: 'vertical'
              }}
            />
            <button
              onClick={handleCommentSubmit}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Post Comment
            </button>
          </div>
        ) : (
          <p style={{ marginBottom: '10px' }}>
            <b>Only logged in users can comment.</b>{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '6px 12px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Login
            </button>
          </p>
        )}

        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment" style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <p>{comment.text}</p>
              <small>By: {comment.author}</small>
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
