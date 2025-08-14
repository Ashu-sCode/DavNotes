import React from "react";
import { Link } from "react-router-dom";
import { FileText, GraduationCap, UploadCloud } from "lucide-react";

const LandingHero = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Hero */}
      <section className="flex flex-col justify-center items-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
          Your Trusted <span className="text-indigo-600">Academic Resource Hub</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-600 dark:text-gray-300">
          DavNotes helps BCA students easily access curated notes, assignments, PYQs, and syllabi —
          all from verified contributors.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/programs"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            Browse Resources
          </Link>
          <Link
            to="/contact"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Become an Uploader
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white dark:bg-gray-800">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          How DavNotes Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Select Your Subject</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Choose from a wide range of subjects across semesters and programs.
            </p>
          </div>
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Download Resources</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Get access to curated notes, assignments, PYQs, and syllabi instantly.
            </p>
          </div>
          <div className="text-center">
            <UploadCloud className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Join as Contributor</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Apply to become a verified uploader and help other students.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingHero;
