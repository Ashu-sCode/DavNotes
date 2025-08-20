// src/components/Breadcrumb.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";

export default function Breadcrumb() {
  const { programName, semester, subject } = useParams();

  const crumbs = [
    { name: "Home", path: "/" },
    programName && { name: DOMPurify.sanitize(programName), path: `/program/${encodeURIComponent(programName)}` },
    semester && { name: `Semester ${DOMPurify.sanitize(semester)}`, path: `/programs/${encodeURIComponent(programName)}/semesters/${semester}/subjects` },
    subject && { name: DOMPurify.sanitize(subject), path: `/programs/${encodeURIComponent(programName)}/semesters/${semester}/subjects/${encodeURIComponent(subject)}/resources` },
  ].filter(Boolean);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `https://davnotes.vercel.app${crumb.path}`,
    })),
  };

  // Motion variants for sliding left-right
  const pillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.25, ease: "easeIn" } },
  };

  const sepVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
  };

  // Parent container variant for staggering
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0, // optional delay before starting
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.08,
        staggerDirection: -1, // reverse stagger for exit
      },
    },
  };

  return (
    <>
      <motion.nav
        aria-label="breadcrumb"
        className="flex flex-wrap gap-2 mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <AnimatePresence>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.path}>
                <motion.div
                  key={crumb.path}
                  variants={pillVariants}
                >
                  <Link
                    to={crumb.path}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isLast
                        ? "bg-indigo-600 text-white cursor-default"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700"
                    }`}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.name}
                  </Link>
                </motion.div>

                {!isLast && (
                  <motion.span
                    key={`sep-${crumb.path}`}
                    className="text-gray-400 dark:text-gray-500 mt-1"
                    variants={sepVariants}
                  >
                    /
                  </motion.span>
                )}
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </motion.nav>

      <script type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </script>
    </>
  );
}
