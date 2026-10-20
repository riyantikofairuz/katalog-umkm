export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://katalog-umkm-ecru.vercel.app");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
