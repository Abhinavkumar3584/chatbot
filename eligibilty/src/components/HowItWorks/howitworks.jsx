"use client";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  CheckCircle2, 
  Map, 
  Brain, 
  Trophy,
  Sparkles
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pariksha Yogya",
    subtitle: "Check Your Eligibility",
    description: "Instantly discover which exams you qualify for from 3000+ options.",
    icon: CheckCircle2,
    color: "from-[#3A7CA5] to-[#6B7C93]",
    bgColor: "bg-[#F6F7F9]",
    borderColor: "border-[#E3E7ED]",
    features: ["Age Check", "Education", "Category", "Attempts"]
  },
  {
    number: "02",
    title: "Pariksha Marg",
    subtitle: "Get Your Roadmap",
    description: "Personalized, topic-wise syllabus roadmap for your target exam.",
    icon: Map,
    color: "from-[#3A7CA5] to-[#6B7C93]",
    bgColor: "bg-[#F6F7F9]",
    borderColor: "border-[#E3E7ED]",
    features: ["Study Plan", "Topics", "Timeline", "Milestones"]
  },
  {
    number: "03",
    title: "Gyan Setu",
    subtitle: "Learn with AI",
    description: "AI assistant trained on NCERT to master concepts & PYQs.",
    icon: Brain,
    color: "from-[#3A7CA5] to-[#6B7C93]",
    bgColor: "bg-[#F6F7F9]",
    borderColor: "border-[#E3E7ED]",
    features: ["AI Learning", "PYQs", "Concepts", "Doubts"]
  },
  {
    number: "04",
    title: "Achieve Success",
    subtitle: "Clear Your Exam",
    description: "Track progress and clear your dream government exam.",
    icon: Trophy,
    color: "from-[#3A7CA5] to-[#6B7C93]",
    bgColor: "bg-[#F6F7F9]",
    borderColor: "border-[#E3E7ED]",
    features: ["Progress", "Analytics", "Mocks", "Success"]
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-white via-[#F6F7F9] to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#e9f1f6] to-[#edf1f5] border border-[#E3E7ED] mb-3"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3 h-3 text-[#3A7CA5]" />
            <span className="text-xs font-semibold text-[#3A7CA5]">Simple Process</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2933] mb-2">
            How It <span className="bg-gradient-to-r from-[#3A7CA5] to-[#6B7C93] bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-sm text-[#52616B] max-w-lg mx-auto">
            Four simple steps to transform your exam preparation journey
          </p>
        </motion.div>

        {/* Desktop - Horizontal Layout */}
        <div className="hidden lg:block">
          {/* Connecting Line with Beam */}
          <div className="relative mb-6">
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#E3E7ED] rounded-full transform -translate-y-1/2 overflow-hidden">
              {/* Sharp Snake Beam */}
              <motion.div
                className="absolute top-0 h-full w-16 bg-gradient-to-r from-[#3A7CA5] via-[#6B7C93] to-[#3A7CA5] rounded-full"
                animate={{
                  left: ["-10%", "110%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            {/* Connection Dots */}
            <div className="flex justify-between px-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full bg-gradient-to-br ${step.color} z-10 relative`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 items-stretch">
            {steps.map((step, index) => (
              <CompactCard
                key={index}
                step={step}
                index={index}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet - Timeline View */}
        <div className="lg:hidden">
          <MobileTimeline steps={steps} />
        </div>
      </div>
    </section>
  );
}

// Compact Card Component for Desktop
function CompactCard({ step, index, isActive, onClick }) {
  const Icon = step.icon;
  
  return (
    <motion.div
      className={`relative flex-1 cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
        isActive 
          ? `${step.borderColor} ${step.bgColor} shadow-md` 
          : 'border-[#E3E7ED] bg-white hover:border-[#3A7CA5]/40 hover:shadow-sm'
      }`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Step Number */}
      <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-xs">{step.number}</span>
      </div>

      {/* Icon */}
      <motion.div 
        className={`p-2 rounded-lg bg-gradient-to-br ${step.color} shadow-md w-fit mb-3`}
        animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>

      {/* Content */}
      <h3 className={`text-sm font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
        {step.title}
      </h3>
      <p className="text-[#52616B] font-medium text-xs mt-0.5">{step.subtitle}</p>
      <p className="text-[#6B7C93] text-xs mt-2 line-clamp-2">{step.description}</p>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mt-3">
        {step.features.map((feature, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium bg-white border ${step.borderColor} text-[#52616B]`}
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full bg-gradient-to-r ${step.color}`}
          layoutId="activeIndicator"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        />
      )}
    </motion.div>
  );
}

// Mobile Timeline Component
function MobileTimeline({ steps }) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E3E7ED] rounded-full overflow-hidden">
        {/* Sharp Snake Beam for Mobile */}
        <motion.div
          className="absolute left-0 w-full h-10 bg-gradient-to-b from-[#3A7CA5] via-[#6B7C93] to-[#3A7CA5] rounded-full"
          animate={{
            top: ["-40px", "100%"]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              className="relative pl-14"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Timeline Node */}
              <motion.div 
                className={`absolute left-2 w-7 h-7 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md z-10`}
                whileInView={{ scale: [0, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <span className="text-white font-bold text-[10px]">{step.number}</span>
              </motion.div>

              {/* Card */}
              <motion.div
                className={`rounded-xl border ${step.borderColor} ${step.bgColor} p-3 shadow-sm`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${step.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      {step.title}
                    </h3>
                    <p className="text-[#52616B] text-[10px]">{step.subtitle}</p>
                  </div>
                </div>
                <p className="text-[#6B7C93] text-xs leading-relaxed">{step.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {step.features.map((feature, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-medium bg-white border ${step.borderColor} text-[#52616B]`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
