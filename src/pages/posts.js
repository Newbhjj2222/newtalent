import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../components/firebase";
import PostsSection from "../components/PostsSection";

export async function getServerSideProps() {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const postsData = snapshot.docs.map((doc) => {
      const data = doc.data();
      const summary = data.story
        ? data.story.replace(/<[^>]+>/g, "").split(" ").slice(0, 50).join(" ") + "..."
        : "";
      return {
        id: doc.id,
        image: data.imageUrl || "",
        title: data.head || "Untitled",
        summary,
        author: data.author || "Unknown",
        category: data.category || "General",
      };
    });

    return {
      props: { initialPosts: postsData },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { props: { initialPosts: [] } };
  }
}

export default function AllPostsPage({ initialPosts }) {
  return <PostsSection initialPosts={initialPosts} />;
}
