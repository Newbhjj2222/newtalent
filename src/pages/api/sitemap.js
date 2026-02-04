import { db } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";
export const runtime = 'edge';
export default async function handler(req, res) {
  try {
    const domain = "https://www.newtalentsg.co.rw";

    /* ===============================
       STATIC PAGES
    ================================ */
    const staticRoutes = [
      "",
      "/About",
      "/Ibiciro",
      "/login",
      "/balance",
      "/terms",
      "/contact",
      "/lyrics",
      "/news",
    ];

    const staticPagesXml = staticRoutes
      .map(
        (route) => `
        <url>
          <loc>${domain}${route}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `
      )
      .join("");

    /* ===============================
       POSTS
    ================================ */
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const postsXml = posts
      .map((post) => {
        const lastmod = post.createdAt?.toDate
          ? post.createdAt.toDate().toISOString()
          : new Date().toISOString();

        return `
        <url>
          <loc>${domain}/post/${post.id}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `;
      })
      .join("");

    /* ===============================
       FINAL SITEMAP
    ================================ */
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
  ${staticPagesXml}
  ${postsXml}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
}
