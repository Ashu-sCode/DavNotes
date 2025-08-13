import React from "react";



const Features = () => {
  const features = [
    {
      title: "Upload & Share",
      description: "Easily upload notes, resources, and study materials for others to access.",
      icon: "📤",
    },
    {
      title: "Organized Resources",
      description: "Find exactly what you need with our structured categories and filters.",
      icon: "📂",
    },
    {
      title: "Access Anywhere",
      description: "Your notes are always available online — anytime, anywhere.",
      icon: "🌐",
    },
    {
      title: "Free to Use",
      description: "We believe education should be accessible to everyone, at no cost.",
      icon: "💡",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose DavNotes?</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          We make learning collaborative and accessible, giving you the tools to succeed in your studies.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
