"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import { motion, useInView } from "framer-motion";

// ─── Logo Images ──────────────────────────────────────────────────────────────

const LogoImg = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
  />
);

// ─── Animated Beam ────────────────────────────────────────────────────────────

const AnimatedBeamPath = ({
  containerRef,
  fromRef,
  toRef,
  fromEdge = "bottom",
  toEdge = "top",
  curvatureY = 40,
  color = "#f97316",
  duration = 2.5,
  delay = 0,
  pathWidth = 2.5,
  dotSpacing = 8,
}) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [endpoints, setEndpoints] = useState(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      const fr = fromRef.current.getBoundingClientRect();
      const tr = toRef.current.getBoundingClientRect();

      setDims({ w: cr.width, h: cr.height });

      const sx = fr.left - cr.left + fr.width / 2;
      const sy =
        fromEdge === "bottom" ? fr.bottom - cr.top : fr.top - cr.top;

      const ex = tr.left - cr.left + tr.width / 2;
      const ey =
        toEdge === "top" ? tr.top - cr.top : tr.bottom - cr.top;

      const cp1x = sx;
      const cp1y = sy + curvatureY;
      const cp2x = ex;
      const cp2y = ey - curvatureY;

      setPathD(`M ${sx},${sy} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}`);

      // Store actual pixel endpoints for gradient animation
      const gradLen = 60; // gradient highlight length in px
      setEndpoints({
        startY: sy - gradLen,
        endY: ey + gradLen,
        sy,
        ey,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef, fromRef, toRef, fromEdge, toEdge, curvatureY]);

  if (!pathD || !endpoints) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      fill="none"
    >
      {/* Background dashed path */}
      <path
        d={pathD}
        stroke="rgba(249,115,22,0.25)"
        strokeWidth={pathWidth}
        strokeDasharray={`${dotSpacing} ${dotSpacing}`}
        strokeLinecap="round"
        fill="none"
      />
      {/* Animated traveling beam */}
      <motion.path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth * 1.8}
        strokeLinecap="round"
        strokeDasharray={`${dotSpacing} ${dotSpacing}`}
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay }}
      />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: 0,
            x2: 0,
            y1: endpoints.startY,
            y2: endpoints.sy,
          }}
          animate={{
            x1: [0, 0],
            x2: [0, 0],
            y1: [endpoints.startY, endpoints.ey],
            y2: [endpoints.sy, endpoints.endY],
          }}
          transition={{
            delay,
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={color} stopOpacity="0" />
          <stop stopColor={color} />
          <stop offset="32.5%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

const StepCard = React.forwardRef(({ icon, title, description, index }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative z-10 flex items-center gap-2 sm:gap-3 bg-white rounded-xl
                 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg shadow-orange-900/5 border border-orange-100/50
                 max-w-[420px] sm:max-w-[480px] w-full"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-base sm:text-lg font-bold text-black mb-0.5">
          {title}
        </h3>
        <p className="text-sm sm:text-[15px] text-black/70 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
});

// ─── Steps Data ───────────────────────────────────────────────────────────────

const steps = [
  {
    icon: <LogoImg src="/logos/py.png" alt="Pratiyogita Yogya" />,
    title: "Yogya → Marg",
    description:
      "Check eligibility first, then plan syllabus only for exams you qualify for.",
  },
  {
    icon: <LogoImg src="/logos/pm.png" alt="Pratiyogita Marg" />,
    title: "Marg → Gyan",
    description:
      "Stuck on a topic in your roadmap? Ask the AI chatbot and practice PYQs instantly.",
  },
  {
    icon: <LogoImg src="/logos/pg.png" alt="Pratiyogita Gyan" />,
    title: "Yogya → Gyan",
    description:
      "Yogya filters which exams, Gyan helps you prepare for them.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const HowItWorksNew = () => {
  const containerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const cardRefs = [card1Ref, card2Ref, card3Ref];
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8 md:mb-10"
      >
        HOW IT WORKs
      </motion.h2>

      {/* Container for cards + beams */}
      <div
        ref={containerRef}
        className="relative max-w-3xl mx-auto flex flex-col gap-14 sm:gap-16 md:gap-20"
      >
        {/* Card 1 — center on mobile, left on md+ */}
        <div className="flex justify-center md:justify-start">
          <StepCard
            ref={card1Ref}
            icon={steps[0].icon}
            title={steps[0].title}
            description={steps[0].description}
            index={0}
          />
        </div>

        {/* Card 2 — center on mobile, right on md+ */}
        <div className="flex justify-center md:justify-end">
          <StepCard
            ref={card2Ref}
            icon={steps[1].icon}
            title={steps[1].title}
            description={steps[1].description}
            index={1}
          />
        </div>

        {/* Card 3 — center on mobile, left on md+ */}
        <div className="flex justify-center md:justify-start">
          <StepCard
            ref={card3Ref}
            icon={steps[2].icon}
            title={steps[2].title}
            description={steps[2].description}
            index={2}
          />
        </div>

        {/* Beam: bottom of Card 1 → top of Card 2 */}
        {isInView && (
          <>
            <AnimatedBeamPath
              containerRef={containerRef}
              fromRef={card1Ref}
              toRef={card2Ref}
              fromEdge="bottom"
              toEdge="top"
              curvatureY={40}
              duration={3}
              delay={0.6}
            />
            {/* Beam: bottom of Card 2 → top of Card 3 */}
            <AnimatedBeamPath
              containerRef={containerRef}
              fromRef={card2Ref}
              toRef={card3Ref}
              fromEdge="bottom"
              toEdge="top"
              curvatureY={40}
              duration={3}
              delay={1.2}
            />
          </>
        )}
      </div>

      {/* Bottom legend */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center text-sm sm:text-base text-gray-400 mt-6 sm:mt-8 italic"
      >
        Yogya = Can I? &nbsp;→&nbsp; Marg = What to study? &nbsp;→&nbsp; Gyan =
        Teach me.
      </motion.p>
    </section>
  );
};

export default HowItWorksNew;
