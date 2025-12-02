import { db } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const domain = "https://www.newtalentsg.co.rw";

    let staticPages = `
      <url>
        <loc>${domain}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    `;

    // Get all posts
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));

    let postsXml = posts
      .map((p) => {
        return `
          <url>
            <loc>${domain}/post/${p.id}</loc>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
          </url>
        `;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticPages}
        ${postsXml}
      </urlset>
    `;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap.");
  }
}
