// src/pages/SemestersPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import { GraduationCap, FolderOpen } from "lucide-react";
import SemesterCard from "../components/cards/SemesterCard";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";

const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const domain = "https://davnotes.netlify.app";

export default function SemestersPage() {
  const { programName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);

  const safeProgramName = useMemo(
    () => DOMPurify.sanitize(programName || ""),
    [programName]
  );

  // ---- Update document head dynamically ----
  useEffect(() => {
    document.title = `${safeProgramName} - Semesters | DavNotes`;

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta(
      "description",
      `Explore ${safeProgramName} semesters on DavNotes. Access notes, previous year papers, syllabus, and assignments for each semester.`
    );

    setMeta(
      "keywords",
      `DavNotes, ${safeProgramName}, DAV College, DavCollege Notes, Punjab University notes, syllabus, previous year papers, exams, assignments`
    );

    // Canonical
    let linkCanonical = document.querySelector("link[rel='canonical']");
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = `${domain}/programs/${encodeURIComponent(
      safeProgramName
    )}/semesters`;

    // Open Graph
    const setOG = (property, content) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setOG("og:title", `${safeProgramName} - Semesters | DavNotes`);
    setOG(
      "og:description",
      `Explore ${safeProgramName} semesters on DavNotes with notes, PYQs, syllabus, and assignments.`
    );
    setOG("og:type", "website");
    setOG(
      "og:url",
      `${domain}/programs/${encodeURIComponent(safeProgramName)}/semesters`
    );
    setOG("og:image", `${domain}/preview.png`);

    // Twitter
    const setTwitter = (name, content) => {
      let tag = document.querySelector(`meta[name='${name}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTwitter("twitter:card", "summary_large_image");
    setTwitter("twitter:title", `${safeProgramName} - Semesters | DavNotes`);
    setTwitter(
      "twitter:description",
      `Explore ${safeProgramName} semesters on DavNotes with notes, PYQs, syllabus, and assignments.`
    );
    setTwitter("twitter:image", `${domain}/preview.png`);
  }, [safeProgramName]);

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      const cacheKey = `semesters-${safeProgramName}`;
      const now = Date.now();

      let cachedData = null;
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached.timestamp && now - cached.timestamp < CACHE_DURATION) {
          cachedData = cached.data;
          setSemesters(cached.data);
          setLoading(false);
        }
      }

      try {
        const q = query(
          collection(db, "resources"),
          where("program", "==", safeProgramName)
        );
        const snapshot = await getDocs(q);

        const semesterSet = new Set();
        snapshot.forEach((doc) => {
          const sem = DOMPurify.sanitize(doc.data()?.semester || "");
          if (sem) semesterSet.add(sem);
        });

        const semesterList = Array.from(semesterSet).sort(
          (a, b) => Number(a) - Number(b)
        );

        if (!cachedData || JSON.stringify(semesterList) !== JSON.stringify(cachedData)) {
          setSemesters(semesterList);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: semesterList, timestamp: now })
          );
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        toast.error("Failed to load semesters. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, [safeProgramName]);

  const openSemester = (semester) => {
    const safeSemester = DOMPurify.sanitize(String(semester));
    navigate(
      `/programs/${encodeURIComponent(
        safeProgramName
      )}/semesters/${encodeURIComponent(safeSemester)}/subjects`
    );
  };

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${safeProgramName} Courses`,
    description: `DavNotes provides ${safeProgramName} students with notes, previous year papers, syllabus, and assignments from DAV College & Punjab University.`,
    provider: {
      "@type": "EducationalOrganization",
      name: "DavNotes",
      sameAs: domain,
    },
    hasCourseInstance: semesters.map((s) => ({
      "@type": "CourseInstance",
      name: `${safeProgramName} Semester ${s}`,
      courseMode: "online",
      url: `${domain}/programs/${encodeURIComponent(
        safeProgramName
      )}/semesters/${encodeURIComponent(s)}/subjects`,
    })),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="relative h-48 rounded-xl overflow-hidden mb-8">
          <img
            src={`/images/${safeProgramName.toLowerCase().replace(/\s+/g, "-")}.jpg`}
            alt={safeProgramName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {safeProgramName} - Semesters
            </h1>
            <p className="text-gray-200 mt-2">
              Choose a semester to explore subjects and resources.
            </p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : semesters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen size={48} className="text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No semesters found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
              It looks like there are no semesters available for{" "}
              <span className="font-medium">{safeProgramName}</span>. Please check
              back later or contact the admin for updates.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {semesters.map((sem) => (
                <motion.div
                  key={sem}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SemesterCard
                    semester={sem}
                    icon={<GraduationCap size={28} />}
                    onClick={() => openSemester(sem)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}
