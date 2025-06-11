import { NextResponse } from 'next/server';

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!--
 created with Free Online Sitemap Generator www.xml-sitemaps.com 
-->
<url>
<loc>https://vertify.com.br/</loc>
<lastmod>2025-05-30T11:22:20+00:00</lastmod>
<priority>1.00</priority>
</url>
<url>
<loc>https://vertify.com.br/sign-in</loc>
<lastmod>2025-05-30T11:22:20+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://vertify.com.br/sign-up</loc>
<lastmod>2025-05-30T11:22:20+00:00</lastmod>
<priority>0.64</priority>
</url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache por 24 horas
    },
  });
} 