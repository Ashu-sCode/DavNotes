import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 px-6 bg-indigo-600 text-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="mb-8 text-lg max-w-xl mx-auto">
        Join thousands of students sharing and accessing resources every day. Let’s make learning easier together.
      </p>
      <Link
        to="/resources"
        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
      >
        Start Browsing
      </Link>
    </section>
  );
};

export default CTA;
