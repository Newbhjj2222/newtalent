"use client";
import { useEffect, useState } from "react";
import { db } from "./firebase"; // make sure ufite configuration ya firebase.js
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Pop() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          orderBy("views", "desc"), // sort descending by views
          limit(5) // ushobora guhindura umubare ushaka
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetched);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500 animate-pulse">
        Loading popular posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nta nkuru zikunzwe zibonetse.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🔥 Inkuru Zikunzwe</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-3 border-b border-gray-200 pb-3 last:border-none hover:bg-gray-50 rounded-lg transition"
          >
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                {post.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                👁 {post.views ?? 0} views
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
