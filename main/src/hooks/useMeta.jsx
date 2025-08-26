// src/hooks/useMeta.js
import { useEffect } from "react";

export default function useMeta({ 
  title = "DavNotes - Student Portal", 
  description = "Access notes, PYQs, syllabus and assignments for BCA & BBA at DAV College.", 
  ogImage = "/og-img.png", 
  url = window.location.href 
}) {
  useEffect(() => {
    // Page title
    document.title = title;

    // Helper to update or create meta tags
    const setMeta = (selector, attr, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property")) {
          element.setAttribute("property", selector.match(/"([^"]+)"/)[1]);
        } else {
          element.setAttribute("name", selector.match(/"([^"]+)"/)[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // Standard meta
    setMeta('meta[name="description"]', "content", description);

    // Open Graph meta
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", ogImage);

    // Twitter meta (extra, improves previews on Twitter/X)
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", ogImage);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");

  }, [title, description, ogImage, url]);
}
