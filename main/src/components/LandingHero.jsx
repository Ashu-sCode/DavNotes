import React from "react";
import { Link } from "react-router-dom";

const LandingHero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to <span className="text-indigo-600">DavNotes</span>
      </h1>
      <p className="text-lg md:text-xl mb-6 max-w-2xl">
        Your one-stop solution for sharing and accessing educational resources, notes, and more!
      </p>
      <Link
        to="/programs"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
      >
        Download
      </Link>
    </section>
  );
};

export default LandingHero;
