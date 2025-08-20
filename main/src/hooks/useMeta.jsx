// src/hooks/useMeta.js
import { useEffect } from "react";

export default function useMeta({ title, description, ogImage, url }) {
  useEffect(() => {
    document.title = title || "DavNotes";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description || "");

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImg = document.querySelector('meta[property="og:image"]');

    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDesc) ogDesc.setAttribute("content", description);
    if (ogUrl) ogUrl.setAttribute("content", url);
    if (ogImg) ogImg.setAttribute("content", ogImage);
  }, [title, description, ogImage, url]);
}
