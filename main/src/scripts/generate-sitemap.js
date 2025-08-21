import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import 'dotenv/config';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Base URL of your deployed site
const BASE_URL = "https://davnotes.netlify.app";

// Utility to create XML entry
const createUrl = (loc, lastmod = new Date().toISOString(), changefreq = "weekly", priority = "0.8") => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;

async function generateSitemap() {
  const urls = [];

  // ✅ Static pages
  const staticPages = ["/", "/about", "/contact"];
  staticPages.forEach((page) => urls.push(createUrl(BASE_URL + page)));

  // ✅ Fetch programs, semesters, subjects
  const resourcesCol = collection(db, "resources");
  const snapshot = await getDocs(resourcesCol);

  const data = snapshot.docs.map((doc) => doc.data());

  const programsSet = new Set(data.map((d) => d.program));
  for (let program of programsSet) {
    urls.push(createUrl(`${BASE_URL}/programs/${encodeURIComponent(program)}/semesters`));

    const semestersSet = new Set(data.filter((d) => d.program === program).map((d) => d.semester));
    for (let sem of semestersSet) {
      urls.push(createUrl(`${BASE_URL}/programs/${encodeURIComponent(program)}/semesters/${encodeURIComponent(sem)}/subjects`));

      const subjectsSet = new Set(
        data.filter((d) => d.program === program && d.semester === sem).map((d) => d.subject)
      );
      for (let sub of subjectsSet) {
        urls.push(createUrl(`${BASE_URL}/programs/${encodeURIComponent(program)}/semesters/${encodeURIComponent(sem)}/subjects/${encodeURIComponent(sub)}/resources`));
      }
    }
  }

  // Wrap in <urlset>
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  // ✅ Write to public folder
  const filePath = path.resolve("./public/sitemap.xml");
  fs.writeFileSync(filePath, sitemap);
  console.log("✅ sitemap.xml generated successfully!");
}

generateSitemap();
