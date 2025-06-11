"use client";

import { useState, useEffect } from "react";

import "../globals.css";

interface SitemapUrl {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

export default function SitemapView() {
  const [xmlContent, setXmlContent] = useState<string>("");

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch("/sitemap.xml");
        const xmlText = await response.text();
        setXmlContent(xmlText);

        // Parse básico do XML para extrair URLs
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const urls = xmlDoc.getElementsByTagName("url");

        const parsedData: SitemapUrl[] = [];
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          const loc = url.getElementsByTagName("loc")[0]?.textContent || "";
          const lastmod =
            url.getElementsByTagName("lastmod")[0]?.textContent || "";
          const changefreq =
            url.getElementsByTagName("changefreq")[0]?.textContent || "";
          const priority = parseFloat(
            url.getElementsByTagName("priority")[0]?.textContent || "0"
          );

          parsedData.push({
            url: loc,
            lastModified: lastmod,
            changeFrequency: changefreq,
            priority: priority,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar sitemap:", error);
      }
    };

    fetchSitemap();
  }, []);
  return (
    <div>
      <pre>{xmlContent}</pre>
    </div>
  );
}
