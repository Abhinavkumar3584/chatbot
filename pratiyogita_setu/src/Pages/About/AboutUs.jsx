import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Team Members Data
  const teamMembers = [
    {
      role: "FOUNDER",
      image: "./Aboutusimages/Abhi.jpg",
      name: "Abhinav Kumar",
      socials: [
        { type: "linkedin", url: "https://www.linkedin.com/in/abhinav-kumar-0ba731239/" },
        { type: "github", url: "https://github.com/Abhinavkumar3584" },
        { type: "instagram", url: "https://instagram.com/" },
        { type: "twitter", url: "https://x.com/ABHINAV11555548" },
      ],
    },
    {
      role: "CO-FOUNDER",
      image: "./Aboutusimages/Manu.jpg",
      name: "Manu Dev",
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "github", url: "https://github.com/" },
        { type: "instagram", url: "https://instagram.com/" },
      ],
    },
    {
      role: "CTO",
      image: "./Aboutusimages/Abhishek.jpg",
      name: "Abhishek Kumar",
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "github", url: "https://github.com/" },
        { type: "twitter", url: "https://twitter.com/" },
      ],
    },
    {
      role: "MARKETING AND R&D",
      image: "./Aboutusimages/Rahul.jpg",
      name: "Rahul Mishra",
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "facebook", url: "https://facebook.com/" },
        { type: "instagram", url: "https://instagram.com/" },
      ],
    },
  ];

  // Social media icon mapping
  const socialIcons = {
    linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/linkedin.svg",
    github: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/github.svg",
    instagram: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/instagram.svg",
    facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/facebook.svg",
    twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/twitter.svg",
  };

  const highlightedText = (text) => (
    <span className={`font-semibold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
      {text}
    </span>
  );

  // Badge colors - lighter gradients
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "FOUNDER":
        return isDark
          ? { background: "linear-gradient(45deg, #FFB380, #FFA07A)", boxShadow: "0 4px 15px rgba(255, 140, 0, 0.4)" }
          : { background: "linear-gradient(45deg, #FFC8A0, #FFBB99)", boxShadow: "0 4px 15px rgba(255, 140, 0, 0.2)" };
      case "CO-FOUNDER":
        return isDark
          ? { background: "linear-gradient(45deg, #87CEFA, #ADD8E6)", boxShadow: "0 4px 15px rgba(65, 105, 225, 0.4)" }
          : { background: "linear-gradient(45deg, #B0E0FF, #C6E6FF)", boxShadow: "0 4px 15px rgba(65, 105, 225, 0.2)" };
      case "CTO":
        return isDark
          ? { background: "linear-gradient(45deg, #90EE90, #98FB98)", boxShadow: "0 4px 15px rgba(50, 205, 50, 0.4)" }
          : { background: "linear-gradient(45deg, #C1FFC1, #CCFFCC)", boxShadow: "0 4px 15px rgba(50, 205, 50, 0.2)" };
      default:
        return isDark
          ? { background: "linear-gradient(45deg, #DDA0DD, #E6E6FA)", boxShadow: "0 4px 15px rgba(153, 50, 204, 0.4)" }
          : { background: "linear-gradient(45deg, #E6C3E6, #F0E6FF)", boxShadow: "0 4px 15px rgba(153, 50, 204, 0.2)" };
    }
  };

  // Renders a team member card (used for both mobile and desktop)
  const TeamMemberCard = ({ member, index, isMobile }) => (
    <motion.div
      key={index}
      className={`${isMobile ? "p-4" : ""} ${
        isDark ? "bg-gray-800/30" : isMobile ? "bg-white" : ""
      } flex flex-col items-center text-center ${isMobile ? "" : "flex-shrink-0 w-64"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      {/* Role Badge */}
      <div className="role-badge" style={getRoleBadgeStyle(member.role)}>
        {member.role}
      </div>

      {/* Profile Image */}
      <div className={`w-32 h-40 sm:w-40 sm:h-48 rounded-lg overflow-hidden border-2 ${
        isDark ? "border-gray-700" : "border-gray-200"
      } mb-4 shadow-md`}>
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/160x192?text=Team+Member";
          }}
        />
      </div>

      {/* Member Name */}
      <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
        {member.name}
      </h3>

      {/* Social Media Icons */}
      <div className="flex justify-center space-x-2 mt-2">
        {member.socials.map((social, i) => (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-7 h-7 rounded-full ${
              isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
            } flex items-center justify-center transition-colors`}
          >
            <img
              src={socialIcons[social.type]}
              alt={social.type}
              className={`w-4 h-4 ${isDark ? "invert" : ""}`}
            />
          </a>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ABOUT US SECTION */}
        <div className="max-w-5xl mx-auto mb-16">
          <motion.h1
            className={`text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-8 text-center relative`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Us
            <span className={`block h-1 w-24 mx-auto mt-2 ${isDark ? "bg-blue-400" : "bg-blue-600"} rounded-full`}></span>
          </motion.h1>

          <motion.div
            className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Introduction Section */}
            <div className={`p-6 mb-8 rounded-lg border-l-4 ${
              isDark ? "bg-gray-800 border-blue-500" : "bg-white border-blue-600"
            } shadow-md`}>
              <p className="text-lg mb-4">
                We, {highlightedText("Abhinav Kumar")} and{" "}
                {highlightedText("Manu Dev")}, welcome you to our platform{" "}
                {highlightedText("Pratiyogita Setu")}, which we have created to
                help aspirants and students to crack their targeted exams.
              </p>
              <p className="mb-4">
                In INDIA every year, on average, about{" "}
                {highlightedText("10 million students")} and aspirants prepare
                for more than {highlightedText("3000+ competitive exams")} for
                different forces, posts, groups, and departments.
              </p>
            </div>

            {/* Our Solution Section */}
            <h2 className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4 border-b ${
              isDark ? "border-gray-600" : "border-gray-300"
            } pb-2`}>
              Our Solution
            </h2>
            <div className={`p-6 mb-8 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-50"} shadow-sm`}>
              <p className="mb-4">
                To solve a very major issue of many freshers aspirants and
                preparing candidates, we have created this platform with three
                core features:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{highlightedText("Pratiyogita Yogya")} - checking eligibility and attempts of the targeting exam</li>
                <li>{highlightedText("Pratiyogita Marg")} - preparing in an organized topic and subtopic wise manner with clear explanations</li>
                <li>{highlightedText("Pratiyogita Gyan")} - practicing PYQs with detailed explanations using our AI chatbot</li>
              </ul>
            </div>

            {/* Key Benefits Section */}
            <h2 className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4 border-b ${
              isDark ? "border-gray-600" : "border-gray-300"
            } pb-2`}>
              Key Benefits
            </h2>

            {/* Benefits */}
            <div className={`p-5 mb-6 rounded-lg border-l-4 ${
              isDark ? "bg-gray-800/30 border-purple-500" : "bg-white border-purple-600"
            } shadow-md`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-purple-300" : "text-purple-600"}`}>
                Eligibility Assessment
              </h3>
              <p className="mb-2">
                Many aspirants do not know about their eligibility and remaining
                attempts at their target exam. With our platform, candidates
                with fewer attempts will be motivated to start studying
                immediately, and receive suggestions for related exams with
                similar syllabi where they have more attempts available.
              </p>
            </div>

            <div className={`p-5 mb-6 rounded-lg border-l-4 ${
              isDark ? "bg-gray-800/30 border-green-500" : "bg-white border-green-600"
            } shadow-md`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-green-300" : "text-green-600"}`}>
                Structured Learning Path
              </h3>
              <p className="mb-2">
                Second, many aspirants find difficulties in getting a precise
                and structured syllabus with detailed in-depth topics and
                subtopics, with personalization of the importance of each topic
                and chapter.
              </p>
            </div>

            <div className={`p-5 mb-6 rounded-lg border-l-4 ${
              isDark ? "bg-gray-800/30 border-amber-500" : "bg-white border-amber-600"
            } shadow-md`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-amber-300" : "text-amber-600"}`}>
                Interactive Practice
              </h3>
              <p className="mb-2">
                After successfully checking their eligibility and studying for
                their targeted exam, aspirants can practice with our developed
                AI chatbot featuring topics, questions & answers, and specified
                PYQs related to that topic, gaining clear insights into the
                topic's importance for their targeted exam.
              </p>
            </div>
          </motion.div>
        </div>

        {/* TEAM MEMBERS SECTION */}
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className={`text-2xl md:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-8 text-center relative`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meet Our Team
            <span className={`block h-1 w-24 mx-auto mt-2 ${isDark ? "bg-blue-400" : "bg-blue-600"} rounded-full`}></span>
          </motion.h2>

          {/* CSS for team section */}
          <style jsx>{`
            .role-badge {
              padding: 4px 8px;
              border-radius: 10px;
              color: ${isDark ? "black" : "black"};
              font-weight: bold;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: 1px solid rgba(0, 0, 0, 0.1);
            }

            @media (min-width: 768px) {
              .team-row-container {
                overflow-x: auto;
                scrollbar-width: thin;
                -ms-overflow-style: none;
                padding-bottom: 10px;
              }
              .team-row-container::-webkit-scrollbar {
                height: 6px;
              }
              .team-row-container::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.5);
                border-radius: 20px;
              }
            }
          `}</style>

          <motion.div
            className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mt-6">
              {/* Mobile Layout: 2 columns grid (2 members per row) */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {teamMembers.map((member, index) => (
                  <div key={index} className={` ${isDark ? "bg-gray-800/30" : ""} `}>
                    <TeamMemberCard member={member} index={index} isMobile={true} />
                  </div>
                ))}
              </div>

              {/* Desktop Layout: Horizontal Scrollable Row */}
              <div className="hidden md:block team-row-container">
                <div className="flex flex-row space-x-4">
                  {teamMembers.map((member, index) => (
                    <TeamMemberCard key={index} member={member} index={index} isMobile={false} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;