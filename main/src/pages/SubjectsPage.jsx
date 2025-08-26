// src/pages/SubjectsPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import SubjectCard from "../components/cards/SubjectCard";
import { Search, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import Breadcrumb from "../components/BreadCrumb";
import useMeta from "../hooks/useMeta";

const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes
const domain = "https://davnotes.netlify.app";

export default function SubjectsPage() {
  const { programName, semester } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  const safeProgramName = useMemo(() => DOMPurify.sanitize(programName || ""), [programName]);
  const safeSemester = useMemo(() => DOMPurify.sanitize(semester || ""), [semester]);

  const cacheKey = `subjects_${safeProgramName}_${safeSemester}`;

  // ---- OG image (dynamic per program/semester) ----
  const ogImage = `${domain}/api/og?title=${encodeURIComponent(
    `Semester ${safeSemester}`
  )}&subtitle=${encodeURIComponent(safeProgramName)}&type=semester`;

  // ---- Meta / SEO ----
  useMeta({
    title: `${safeProgramName} - Semester ${safeSemester} | DavNotes`,
    description: `Explore subjects of ${safeProgramName} Semester ${safeSemester} on DavNotes. Access notes, previous year papers, syllabus, and assignments.`,
    ogImage,
    url: `${domain}/programs/${encodeURIComponent(safeProgramName)}/semesters/${encodeURIComponent(safeSemester)}/subjects`,
  });

  // ---- Fetch subjects with caching ----
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      const now = Date.now();

      // Cached subjects
      const cached = localStorage.getItem(cacheKey);
      let cachedData = null;
      if (cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < CACHE_EXPIRY) {
          cachedData = parsed.data;
          setSubjects(parsed.data);
          setLoading(false);
        }
      }

      try {
        const q = query(
          collection(db, "resources"),
          where("program", "==", safeProgramName),
          where("semester", "==", safeSemester)
        );
        const snapshot = await getDocs(q);

        const subjectSet = new Set();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.subject) subjectSet.add(data.subject.trim());
        });

        const subjectList = Array.from(subjectSet).sort();

        if (!cachedData || JSON.stringify(subjectList) !== JSON.stringify(cachedData)) {
          setSubjects(subjectList);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: subjectList, timestamp: now })
          );
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        alert("Failed to load subjects. Please refresh or try later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [safeProgramName, safeSemester, cacheKey]);

  const openSubject = (subject) => {
    const sanitizedSubject = encodeURIComponent(subject);
    navigate(
      `/programs/${encodeURIComponent(safeProgramName)}/semesters/${encodeURIComponent(safeSemester)}/subjects/${sanitizedSubject}/resources`
    );
  };

  const sanitizedSearch = useMemo(() => DOMPurify.sanitize(search), [search]);
  const filteredSubjects = useMemo(
    () =>
      subjects.filter((sub) =>
        sub.toLowerCase().includes(sanitizedSearch.toLowerCase())
      ),
    [subjects, sanitizedSearch]
  );

  // ---- JSON-LD structured data ----
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${safeProgramName} Semester ${safeSemester} Subjects`,
    description: `DavNotes provides ${safeProgramName} Semester ${safeSemester} students with notes, previous year papers, syllabus, and assignments from DAV College & Punjab University.`,
    provider: {
      "@type": "EducationalOrganization",
      name: "DavNotes",
      sameAs: domain,
    },
    hasCourseInstance: subjects.map((sub) => ({
      "@type": "CourseInstance",
      name: `${safeProgramName} Semester ${safeSemester} - ${sub}`,
      courseMode: "online",
      url: `${domain}/programs/${encodeURIComponent(safeProgramName)}/semesters/${encodeURIComponent(safeSemester)}/subjects/${encodeURIComponent(sub)}/resources`,
    })),
  };

  // ---- Animations ----
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
        <Breadcrumb />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-gray-50">
            {safeProgramName} - Semester {safeSemester}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose a subject to explore resources.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <Search
            className="absolute left-3 top-3 dark:text-white text-gray-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(DOMPurify.sanitize(e.target.value))}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-indigo-500"
            aria-label="Search subjects"
          />
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen size={48} className="text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No subjects found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
              No subjects listed for{" "}
              <span className="font-medium">
                {safeProgramName} - Semester {safeSemester}
              </span>
              . Try adjusting your search or check back later.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={sanitizedSearch}
          >
            <AnimatePresence>
              {filteredSubjects.map((sub) => (
                <motion.div
                  key={sub}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SubjectCard
                    subject={DOMPurify.sanitize(sub)}
                    onClick={() => openSubject(sub)}
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
