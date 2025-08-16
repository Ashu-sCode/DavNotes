// src/pages/AboutPage.jsx
import React from "react";
import { BookOpen, FileText, Layers, Users, Linkedin } from "lucide-react";
import { motion } from "framer-motion";



export default function AboutPage() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />,
      title: "Access Notes & PYQs",
      description: "Find semester-wise notes, previous year question papers, assignments, and syllabus in one place.",
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600 dark:text-green-300" />,
      title: "Easy Downloads",
      description: "Quickly download any resource with one click for offline study.",
    },
    {
      icon: <Layers className="w-8 h-8 text-pink-600 dark:text-pink-300" />,
      title: "Organized & Filtered",
      description: "Browse by program, semester, or subject. Use filters to quickly find what you need.",
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />,
      title: "Verified Resources",
      description: "All resources are verified and uploaded by admins or trusted contributors.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
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
          <a href="https://portfolio-ashutoshh.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1">
            Portfolio <BookOpen className="w-5 h-5" />
          </a>
          <a href="https://github.com/ashu-sCode" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-50 hover:underline flex items-center gap-1">
            GitHub 
            {/* <GitHub className="w-5 h-5" /> */}
          </a>
          <a href="https://www.linkedin.com/in/ashutosh452" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            LinkedIn <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
