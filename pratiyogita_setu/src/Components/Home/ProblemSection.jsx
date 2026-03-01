import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Highlighter } from "../../components/ui/highlighter";

const IndiaMap = () => {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch("/india.svg")
      .then((res) => res.text())
      .then((text) => {
        // Remove XML declaration if present
        const cleaned = text.replace(/<\?xml[^?]*\?>\s*/, "");
        setSvgContent(cleaned);
      });
  }, []);

  return (
    <div
      className="india-map-container w-full mx-auto drop-shadow-[0_0_30px_rgba(249,115,22,0.12)]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

// ─── Exam logos for infinite carousel ─────────────────────────────────────────

const examLogos = [
  { src: "/infinityimages/upsc.png", alt: "UPSC" },
  { src: "/infinityimages/railways.png", alt: "Railways" },
  { src: "/infinityimages/airforce.png", alt: "Air Force" },
  { src: "/infinityimages/bsf.png", alt: "BSF" },
  { src: "/infinityimages/csir.png", alt: "CSIR" },
  { src: "/infinityimages/delhimetro.png", alt: "Delhi Metro" },
  { src: "/infinityimages/air_authority.png", alt: "Air Authority" },
  { src: "/infinityimages/uppolice.png", alt: "UP Police" },
];

const examScrollStyles = `
  @keyframes examScrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
  }
  .animate-exam-scroll {
    animation: examScrollLeft 12s linear infinite;
    display: flex;
    width: max-content;
  }
`;

const ExamCarousel = () => (
  <div className="w-full overflow-hidden mt-4">
    <style>{examScrollStyles}</style>
    <p className="text-xl text-black font-bold mb-2 mt-8 uppercase tracking-wider">Supported Exams</p>
    <div className="relative overflow-hidden">
      <div className="animate-exam-scroll">
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex items-center gap-16 px-8 flex-none">
            {examLogos.map((logo, i) => (
              <img
                key={`${copy}-${i}`}
                src={logo.src}
                alt={logo.alt}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const paragraphs = [
  {
    text: "Over 10 million Indian aspirants face fragmented, inefficient exam preparation systems. Eligibility confusion, static roadmaps, and unverified AI answers reduce preparation effectiveness.",
  },
  {
    text: "Students start with many possibilities, but without clarity, those possibilities fade over time. What remains is not always the right path — it is just the last visible one.",
  },
  {
    text: "Pratiyogita Setu is an All-in-One AI-powered Solution integrating eligibility intelligence, NCERT-Based learning, adaptive roadmaps, topic-wise PYQ practice, and performance analytics.",
    highlight: true,
  },
  {
    text: "The platform ensures structured, verified, efficient and data-driven preparation across all competitive exams.",
  },
];

const ProblemSection = () => {
  return (
    <section className="relative py-10 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-4xl overflow-hidden mx-auto bg-white max-w-screen-2xl">
        <div className="relative z-10 py-10 sm:py-8 px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left — India Map */}
          <motion.div
            className="w-full lg:w-4/12 shrink-0 flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <IndiaMap />
          </motion.div>

          {/* Right — Text + Exam Carousel */}
          <motion.div
            className="w-full lg:w-8/12 space-y-3 pr-4 lg:pr-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Custom paragraph with Magic UI Highlighter */}
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-black">
              Over 10 million Indian aspirants face fragmented, inefficient exam preparation systems. Eligibility confusion, static roadmaps, and unverified AI answers reduce preparation effectiveness. The{' '}
              <Highlighter action="underline" color="#FF9800">Magic UI Highlighter</Highlighter>{' '}makes important{' '}
              <Highlighter action="highlight" color="#87CEFA">text stand out</Highlighter>{' '}effortlessly.
            </p>
            {/* ...existing code for other paragraphs and carousel... */}
            {paragraphs.slice(1).map((p, i) => (
              <p
                key={i}
                className={`text-sm sm:text-base lg:text-lg leading-relaxed ${
                  p.highlight
                    ? "text-orange-600 font-semibold border-l-4 border-orange-500 pl-4"
                    : "text-black"
                }`}
              >
                {p.text}
              </p>
            ))}
            <ExamCarousel />
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
