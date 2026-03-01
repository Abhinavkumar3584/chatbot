import React, { useState } from "react";
import { motion } from "framer-motion";

const FeatureSection = () => {

  const [activeFeature, setActiveFeature] = useState("pratiyogita-yogya");

  const features = [
    {
      id: "pratiyogita-yogya",
      title: "Pratiyogita Yogya",
      description:
        "An eligibility calculator tool that helps you discover exams perfectly matched to your qualifications and aspirations.",
      details: [
        "Personalized exam recommendations based on your profile",
        "Filter exams by subject, difficulty, and career path",
        "Stay updated with the latest exam eligibility criteria",
        "Save your favorite exams for future reference",
      ],
      icon: (
        <img src="/logos/py.png" alt="Pratiyogita Yogya" className="w-8 h-8 object-contain" />
      ),
      imageSrc: "/logos/py.png",
      color: "indigo",
    },
    {
      id: "pratiyogita-marg",
      title: "Pratiyogita Marg",
      description:
        "A comprehensive roadmap and mindmap for your course preparation, guiding you through the entire learning journey.",
      details: [
        "Visual learning paths for different subjects and exams",
        "Interactive mindmaps to understand complex topics",
        "Customizable study plans based on your schedule",
        "Progress tracking and milestone achievements",
      ],
      icon: (
        <img src="/logos/pm.png" alt="Pratiyogita Marg" className="w-8 h-8 object-contain" />
      ),
      imageSrc: "/logos/pm.png",
      color: "purple",
    },
    {
      id: "pratiyogita-gyan",
      title: "Pratiyogita Gyan",
      description:
        "An intelligent NCERT chatbot that assists in your preparation by answering questions, explaining concepts, and providing study materials.",
      details: [
        "24/7 access to NCERT-based knowledge assistance",
        "Instant answers to your academic questions",
        "Detailed explanations for complex concepts",
        "Study material recommendations for deeper learning",
      ],
      icon: (
        <img src="/logos/pg.png" alt="Pratiyogita Gyan" className="w-8 h-8 object-contain" />
      ),
      imageSrc: "/logos/pg.png",
      color: "emerald",
    },
  ];

  const getFeatureDetail = (id) =>
    features.find((feature) => feature.id === id);
  const activeFeatureData = getFeatureDetail(activeFeature);

  return (
    <section
      id="features"
      className="py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.h2>
        </div>

        {/* Feature Selector Tabs */}
        <motion.div
          className="flex flex-row justify-center gap-2 lg:gap-4 mb-6 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-2xl text-xs md:text-base font-semibold transition-all duration-300 flex items-center gap-2 md:gap-3 ${
                activeFeature === feature.id
                  ? "bg-orange-500/20 text-white ring-2 ring-orange-500"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <span className="whitespace-nowrap">{feature.title}</span>
            </button>
          ))}
        </motion.div>

        {/* Feature Detail */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          key={activeFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Feature Description */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {" "}
            <div className="flex flex-row justify-left">
              <div className={"basis-2/3 flex flex-col justify-center"}>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {activeFeatureData.title}
                </h3>
              </div>
            </div>
            <p className="text-base text-gray-200 mb-6">
              {activeFeatureData.description}
            </p>
            <ul className="space-y-3">
              {activeFeatureData.details.map((detail, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                >
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-200">
                    {detail}
                  </span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={`#try-${activeFeatureData.id}`}
                className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Try {activeFeatureData.title} Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Feature Image */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className="relative rounded-xl overflow-hidden shadow-xl p-1 bg-white/5 border border-orange-500 max-w-md"
            >
              <img
                src={activeFeatureData.imageSrc}
                alt={activeFeatureData.title}
                className="rounded-lg w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400/${
                    activeFeatureData.color
                  }/white?text=${encodeURIComponent(activeFeatureData.title)}`;
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
