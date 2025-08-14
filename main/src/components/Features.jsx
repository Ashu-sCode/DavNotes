import React from "react";
import { FileText, GraduationCap, ShieldCheck, Globe } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Verified & Trusted",
      description:
        "All resources are uploaded by verified contributors to ensure accuracy and quality.",
      icon: <ShieldCheck className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Organized for You",
      description:
        "Browse notes, assignments, PYQs, and syllabi by program, semester, and subject.",
      icon: <FileText className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Access Anywhere",
      description:
        "Your academic resources are always available online — anytime, anywhere.",
      icon: <Globe className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Made for Students",
      description:
        "Designed by students for students, with zero cost and maximum convenience.",
      icon: <GraduationCap className="w-10 h-10 text-indigo-600" />,
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Why Choose DavNotes?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          A trusted hub for students to find organized, high-quality academic resources in just a few clicks.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
