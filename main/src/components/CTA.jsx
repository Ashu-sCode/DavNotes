import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 px-6 bg-indigo-600 text-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to Start Learning Smarter?
      </h2>
      <p className="mb-8 text-lg max-w-xl mx-auto text-indigo-100">
        Access curated notes, assignments, PYQs, and more — trusted by your classmates.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/programs"
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Browse Resources
        </Link>
        <Link
          to="/contact"
          className="bg-indigo-500 border border-indigo-200 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-indigo-400 transition"
        >
          Become an Uploader
        </Link>
      </div>
    </section>
  );
};

export default CTA;
