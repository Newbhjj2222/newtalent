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

// ✅ Import theme
import { useTheme } from '../Theme';

const extractSeriesAndEpisode = (head) => {
  if (!head) return { title: null, season: null, episode: null };

  const cleanedHead = head
    .replace(/[\/\\\-_:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

  const seasonMatch = cleanedHead.match(/SEASON\s*(\d+)|S\s*(\d+)/i);
  const season = seasonMatch ? parseInt(seasonMatch[1] || seasonMatch[2], 10) : 1;

  const episodeMatch = cleanedHead.match(/EPISODE\s*(\d+)|EP\s*(\d+)|E\s*(\d+)/i);
  const episode = episodeMatch
    ? parseInt(episodeMatch[1] || episodeMatch[2] || episodeMatch[3], 10)
    : null;

  const title = cleanedHead
    .replace(/SEASON\s*\d+/i, '')
    .replace(/S\s*\d+/i, '')
    .replace(/EPISODE\s*\d+/i, '')
    .replace(/EP\s*\d+/i, '')
    .replace(/E\s*\d+/i, '')
    .trim();

  return { title, season, episode };
};

const PostDetails = () => {
  const { darkMode, fontSize, fontStyle } = useTheme(); // ✅ Use theme
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
        const allPosts = allPostsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        const current = extractSeriesAndEpisode(currentPost.head);
        if (!current.title || current.episode === null) return;

        const sameSeriesPosts = allPosts
          .map((p) => ({ ...p, ...extractSeriesAndEpisode(p.head) }))
          .filter((p) =>
            p.title === current.title &&
            p.season === current.season &&
            p.episode !== null
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

    const handlePaywall = async (postData, username) => {
      // … (paywall code igumaho uko yari imeze)
    };

    const runAll = async () => {
      await fetchPostAndComments();
      await recordView();
    };

    runAll();
  }, [id, navigate, db]);

  const handleCommentSubmit = async () => { /* igumaho */ };
  const handleShare = async () => { /* igumaho */ };

  if (!post) return <div>Loading...</div>;

  return (
    // ✅ Theme applied globally
    <div
      className="post-details"
      style={{
        padding: 20,
        maxWidth: 700,
        margin: '0 auto',
        backgroundColor: darkMode ? '#121212' : '#fff',
        color: darkMode ? '#fff' : '#000',
        fontSize: fontSize,
        fontFamily: fontStyle,
        transition: 'all 0.3s ease',
      }}
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
        style={{
          lineHeight: 1.7,
          fontSize: fontSize,
          fontFamily: fontStyle,
          marginTop: 10,
        }}
      />

      {/* Buttons & Comments */}
      {/* … shyiramo style zose za buttons na comments na darkMode/ fontSize/ fontStyle */}

    </div>
  );
};

export default PostDetails;
