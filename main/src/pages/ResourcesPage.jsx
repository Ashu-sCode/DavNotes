// src/pages/ResourcesPage.jsx
import { BookOpen, RefreshCcw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, analytics } from "../api/firebase";
import ResourceCard from "../components/cards/ResourceCard";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { logEventUtil } from "../utils/LogEventUtil";

const domain = "https://davnotes.netlify.app";

export default function ResourcesPage() {
  const { programName, semester, subject } = useParams();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const CACHE_KEY = `resources_${programName}_${semester}_${subject}`;
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  const safeProgramName = useMemo(
    () => DOMPurify.sanitize(programName || ""),
    [programName]
  );
  const safeSemester = useMemo(
    () => DOMPurify.sanitize(semester || ""),
    [semester]
  );
  const safeSubject = useMemo(
    () => DOMPurify.sanitize(subject || ""),
    [subject]
  );
  const sanitizedFilterType = DOMPurify.sanitize(filterType);

  const categories = [
    { key: "all", label: "All" },
    { key: "notes", label: "Notes" },
    { key: "pyq", label: "PYQ" },
    { key: "assignment", label: "Assignments" },
    { key: "syllabus", label: "Syllabus" },
  ];

  // ---- Dynamic Head Tags ----
  useEffect(() => {
    const title = `${safeSubject} Resources - ${safeProgramName} Semester ${safeSemester} | DavNotes`;
    document.title = title;

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
      `Explore ${safeSubject} resources for ${safeProgramName} Semester ${safeSemester} on DavNotes. Access notes, PYQs, syllabus, and assignments.`
    );
    setMeta(
      "keywords",
      `DavNotes, ${safeProgramName}, Semester ${safeSemester}, ${safeSubject}, notes, PYQs, syllabus, assignments, DAV College, Punjab University`
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
    )}/semesters/${encodeURIComponent(
      safeSemester
    )}/subjects/${encodeURIComponent(safeSubject)}/resources`;

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
    setOG("og:title", title);
    setOG(
      "og:description",
      `Explore ${safeSubject} resources for ${safeProgramName} Semester ${safeSemester} on DavNotes. Notes, PYQs, syllabus, and assignments.`
    );
    setOG("og:type", "website");
    setOG(
      "og:url",
      `${domain}/programs/${encodeURIComponent(
        safeProgramName
      )}/semesters/${encodeURIComponent(
        safeSemester
      )}/subjects/${encodeURIComponent(safeSubject)}/resources`
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
    setTwitter("twitter:title", title);
    setTwitter(
      "twitter:description",
      `Explore ${safeSubject} resources for ${safeProgramName} Semester ${safeSemester} on DavNotes. Notes, PYQs, syllabus, and assignments.`
    );
    setTwitter("twitter:image", `${domain}/preview.png`);
  }, [safeProgramName, safeSemester, safeSubject]);

  // ---- Fetch Resources with caching ----
  useEffect(() => {
    let isMounted = true;

    const loadCached = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          if (isMounted) {
            setResources(data);
            setLoading(false);
          }
        } catch (err) {
          console.warn("Invalid cache", err);
        }
      }
    };

    const fetchResources = async () => {
      try {
        const q = query(
          collection(db, "resources"),
          where("program", "==", programName),
          where("semester", "==", semester),
          where("subject", "==", subject)
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (isMounted) {
          setResources(fetched);
          setLoading(false);
        }

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: fetched, timestamp: Date.now() })
        );
      } catch (err) {
        console.error("Error fetching resources:", err);
        if (isMounted) {
          setError("Failed to load resources. Please try again.");
          setLoading(false);
        }
      }
    };

    loadCached();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) fetchResources();
    } else {
      fetchResources();
    }

    return () => {
      isMounted = false;
    };
  }, [programName, semester, subject, CACHE_KEY]);

  // ---- Handle Download ----
  const handleDownload = (id, url) => {
    try {
      const safeUrl = DOMPurify.sanitize(url);
      if (safeUrl && safeUrl.startsWith("http")) {
        logEventUtil(analytics, "file_download", {
          file_id: id,
          file_url: safeUrl,
          timestamp: new Date().toISOString(),
        });
        setTimeout(() => {
          window.open(safeUrl, "_blank", "noopener,noreferrer");
        }, 500);
      } else alert("Invalid file URL.");
    } catch (err) {
      console.error("Download failed:", err);
      alert("Unable to download file.");
    }
  };

  const filteredResources = useMemo(() => {
    return sanitizedFilterType === "all"
      ? resources
      : resources.filter((r) => r.category === sanitizedFilterType);
  }, [resources, sanitizedFilterType]);

  const categoryLabel =
    categories.find((cat) => cat.key === sanitizedFilterType)?.label ||
    "resources";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // ---- JSON-LD structured data ----
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${safeSubject} Resources`,
    educationalLevel: `${safeProgramName} Semester ${safeSemester}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "DavNotes",
      sameAs: domain,
    },
    hasPart: filteredResources.map((r) => ({
      "@type": "CreativeWork",
      name: DOMPurify.sanitize(r.title),
      url: r.url,
      educationalUse: r.category,
      potentialAction: {
        "@type": "DownloadAction",
        target: r.url,
        actionStatus: "PotentialActionStatus",
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50">
          {safeSubject} Resources
        </h1>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-start gap-3 mb-6">
          {categories.map((cat) => {
            const isActive = sanitizedFilterType === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setFilterType(cat.key)}
                className={`px-4 py-2 rounded-full border text-sm transition-all flex-1 min-w-[90px] text-center ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-pressed={isActive}
                aria-label={`Filter by ${cat.label}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="status"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <ResourceCard key={i} skeleton />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-6">
              <RefreshCcw className="w-10 h-10 text-red-600 dark:text-red-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && filteredResources.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              No {categoryLabel.toLowerCase()} found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              {sanitizedFilterType === "all"
                ? "There are no resources for this subject yet. Try checking back later."
                : `There are no ${categoryLabel.toLowerCase()} available for this subject yet.`}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Resource Grid */}
        {!loading && !error && filteredResources.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={sanitizedFilterType}
          >
            <AnimatePresence>
              {filteredResources.map((res) => (
                <motion.div
                  key={res.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ResourceCard
                    resource={{
                      ...res,
                      subject: DOMPurify.sanitize(res.subject),
                      category: DOMPurify.sanitize(res.category),
                      title: DOMPurify.sanitize(res.title),
                    }}
                    onDownload={handleDownload}
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
