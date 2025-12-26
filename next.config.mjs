/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      // Sitemap index (nyamukuru)
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap-index',
      },
      // Static pages sitemap
      {
        source: '/sitemap-static.xml',
        destination: '/api/sitemap/static',
      },
      // Posts sitemap
      {
        source: '/sitemap-posts.xml',
        destination: '/api/sitemap/posts',
      },
      // News sitemap
      {
        source: '/sitemap-news.xml',
        destination: '/api/sitemap/news',
      },
    ];
  },
};

export default nextConfig;
