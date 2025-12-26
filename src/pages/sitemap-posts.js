// pages/api/sitemap-posts.js
import { db } from "@/components/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const domain = "https://www.newtalentsg.co.rw";

    // Fata posts zose
    const postsSnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"))
    );

    const postsXml = postsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const lastmod = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString();

      return `
        <url>
          <loc>${domain}/post/${doc.id}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `;
    }).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postsXml}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating posts sitemap.");
  }
}
