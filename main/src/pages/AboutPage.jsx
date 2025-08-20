// src/pages/AboutPage.jsx
import React from "react";
import { BookOpen, FileText, Layers, Users, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

export default function AboutPage() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />,
      title: "Access Notes & PYQs",
      description:
        "Find semester-wise notes, previous year question papers, assignments, and syllabus in one place.",
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600 dark:text-green-300" />,
      title: "Easy Downloads",
      description: "Quickly download any resource with one click for offline study.",
    },
    {
      icon: <Layers className="w-8 h-8 text-pink-600 dark:text-pink-300" />,
      title: "Organized & Filtered",
      description:
        "Browse by program, semester, or subject. Use filters to quickly find what you need.",
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />,
      title: "Verified Resources",
      description:
        "All resources are verified and uploaded by admins or trusted contributors.",
    },
  ];

  // ---- JSON-LD Structured Data ----
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "DavNotes",
    "url": "https://davnotes.vercel.app",
    "logo": "https://davnotes.vercel.app/logo.png",
    "sameAs": [
      "https://github.com/ashu-sCode",
      "https://www.linkedin.com/in/ashutosh452",
      "https://portfolio-ashutoshh.netlify.app/"
    ],
    "description": "DavNotes is a student-focused platform providing semester-wise notes, previous year question papers, assignments, and syllabus for easy access and organized studying.",
    "founder": {
      "@type": "Person",
      "name": "Ashutosh",
      "url": "https://portfolio-ashutoshh.netlify.app/"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "DavNotes Features",
      "itemListElement": features.map((f) => ({
        "@type": "ListItem",
        "name": DOMPurify.sanitize(f.title),
        "description": DOMPurify.sanitize(f.description)
      }))
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is DavNotes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DavNotes is a student-focused platform that provides organized access to semester-wise notes, previous year question papers, assignments, and syllabus."
        }
      },
      {
        "@type": "Question",
        "name": "Who can use DavNotes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Any student looking for structured educational resources, especially BCA students, can use DavNotes for free."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download resources for offline study?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all resources including notes, PYQs, assignments, and syllabus can be downloaded for offline use with a single click."
        }
      },
      {
        "@type": "Question",
        "name": "Are the resources verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all resources are verified and uploaded either by admins or trusted contributors."
        }
      }
    ]
  };

  // ---- HowTo Structured Data ----
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to find and download resources on DavNotes",
    "description": "Step-by-step guide to browse and download notes, PYQs, assignments, and syllabus on DavNotes.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Program",
        "text": "Choose your program (e.g., BCA or BBA) from the programs page."
      },
      {
        "@type": "HowToStep",
        "name": "Select Semester",
        "text": "Pick your semester to view available subjects."
      },
      {
        "@type": "HowToStep",
        "name": "Choose Subject",
        "text": "Select the subject you want to explore to see all resources."
      },
      {
        "@type": "HowToStep",
        "name": "Filter Resources",
        "text": "Use filter buttons to find notes, PYQs, assignments, or syllabus quickly."
      },
      {
        "@type": "HowToStep",
        "name": "Download Resources",
        "text": "Click on the download button to save the resource for offline study."
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

      {/* SEO Tags */}
      <title>About DavNotes | Organized Study Resources</title>
      <meta
        name="description"
        content="Learn more about DavNotes – a platform built by students for students to easily access notes, PYQs, assignments, and syllabus in one place."
      />
      <meta
        name="keywords"
        content="About DavNotes, student platform, BCA notes, college resources, semester notes, previous year question papers, assignments, syllabus"
      />
      <meta property="og:title" content="About DavNotes | Student Resource Platform" />
      <meta
        property="og:description"
        content="DavNotes is designed to help students access verified notes, PYQs, assignments, and syllabus easily."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://davnotes.vercel.app/about" />
      <meta property="og:site_name" content="DavNotes" />
      <script type="application/ld+json">{JSON.stringify(jsonLdOrganization)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold dark:text-gray-50 mb-4">
          About DavNotes
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          DavNotes is a student-focused platform designed to help students easily access notes, previous year question papers, assignments, and syllabus. Our goal is to make studying organized, simple, and effective.
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-bold mb-2 dark:text-gray-50">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* About the Creator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-50">About the Creator</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This platform is created by <span className="font-medium">Ashutosh</span>, a BCA 3rd-year student (2025-26 batch), passionate about building educational tools for students.
          The goal is to make learning resources easily accessible and well-organized.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="https://portfolio-ashutoshh.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1"
          >
            Portfolio <BookOpen className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/ashu-sCode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 dark:text-gray-50 hover:underline flex items-center gap-1"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ashutosh452"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            LinkedIn <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
