import React from "react";

const AboutUs = () => {
  // Team Members Data with social media profiles (add or remove icons as needed per member)
  const teamMembers = [
    { 
      role: "CO-FOUNDER & PRODUCT LEAD", 
      image: "./Aboutusimages/Abhi.jpg", 
      name: "Abhinav Kumar",
      socials: [
        { type: "linkedin", url: "https://www.linkedin.com/in/abhinav-kumar-0ba731239/" },
        { type: "instagram", url: "https://instagram.com/" },
        { type: "facebook", url: "https://facebook.com/" },
        { type: "twitter", url: "https://x.com/ABHINAV11555548" }
      ] 
    },
    { 
      role: "FOUNDING AI ENGINEER", 
      image: "./Aboutusimages/Manu.jpg", 
      name: "Manu Dev",
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "github", url: "https://github.com/" },
        { type: "instagram", url: "https://instagram.com/" }
      ] 
    },
    { 
      role: "DATA & OPERATIONS LEAD", 
      image: "./Aboutusimages/Nitish.jpeg",
      name: "Nitish Yadav", 
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "github", url: "https://github.com/" },
        { type: "twitter", url: "https://twitter.com/" }
      ] 
    }
  ];

  // Social media icon mapping
  const socialIcons = {
    linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/linkedin.svg",
    github: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/github.svg",
    instagram: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/instagram.svg",
    facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/facebook.svg",
    twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/twitter.svg"
  };

  // Badge colors for different roles
  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case "CO-FOUNDER & PRODUCT LEAD":
        return {
          background: "linear-gradient(45deg, #FF8C00, #FF4500)",
          
        };
      case "CO-FOUNDER & TECHNICAL LEAD":
        return {
          background: "linear-gradient(45deg, #4169E1, #1E90FF)",
          
        };
      case "FOUNDING AI ENGINEER":
        return {
          background: "linear-gradient(45deg, #4169E1, #1E90FF)",
          
        };
      case "DATA & OPERATIONS LEAD":
        return {
          background: "linear-gradient(45deg, #32CD32, #008000)",
          
        };
      case "DESIGNER":
        return {
          background: "linear-gradient(45deg, #FF1493, #C71585)",
          
        };
      default:
        return {
          background: "linear-gradient(45deg, #808080, #A9A9A9)",
          
        };
    }
  };

  return (
    <>
      {/* CSS for shining animation - updated for subtle effect */}
      <style jsx>{`
  @keyframes subtleShine {
    0% {
      transform: translateX(-100%) skewX(-15deg);
    }
    100% {
      transform: translateX(200%) skewX(-15deg);
    }
  }

  .role-badge {
    position: relative;
    overflow: hidden;
    padding: 4px 8px;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    /* Border removed */
  }

  /* Removed shine effect by commenting out the ::before pseudo-element */
  /* .role-badge::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%) skewX(-15deg);
    animation: subtleShine 5s infinite;
  } */
`}</style>

<div className="bg-gray-100 py-12 pb-0 px-4 sm:px-6 lg:px-8">
  {/* About Us Section - MODERNIZED */}
  <div className="w-full max-w-[1280px] mx-auto p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white to-gray-50 rounded-[20px] shadow-lg mt-8 relative overflow-hidden">
    {/* Decorative Elements - Modified positioning */}
    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-50 rounded-full opacity-30 -translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-50 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
    
    {/* Heading with Underline */}
    <div className="relative">
      <h2 className="text-center text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
        About Us
      </h2>
      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-3 rounded-full"></div>
    </div>

  {/* Content Wrapper */}
  <div className="mt-2 flex flex-col items-center gap-8 relative">
    <div className="w-full p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500 text-gray-700 text-base sm:text-lg leading-relaxed">
      <p className="mb-4 italic">
        Pratiyogita Setu was built by a small team with the goal of bringing clarity, direction, and confidence to students preparing for competitive examinations. I joined as an early technical contributor and helped develop the core AI and full-stack systems behind the platform.
      </p>
      <p className="mb-4">
        Every year in India, millions of aspirants prepare for thousands of government and competitive exams.
        But despite the effort they put in, many students struggle with one basic problem:
        they don’t clearly know where they stand or what their best path forward is.
      </p>
      <p className="mb-4">
        Some miss opportunities because they are unaware of their eligibility.
        Others spend years preparing for exams they may never qualify for.
        And many feel lost in a system filled with scattered information and uncertainty.
      </p>
      <p className="mb-4 font-semibold text-gray-800">Pratiyogita Setu was built to change that.</p>
      <p className="mb-4">
        We believe that the first step toward success is clear and reliable guidance.
        Our platform helps aspirants understand their real eligibility, plan their preparation with structure,
        and move forward with confidence instead of confusion.
      </p>
      <p className="mb-4">
        Through intelligent analysis, structured roadmaps, and trustworthy learning support,
        we aim to make sure that no genuine effort goes in the wrong direction
        and every student gets a fair chance to reach their goal.
      </p>
      <p className="mb-4">
        This is not just a project for us,
        it is a commitment to support students in one of the most important journeys of their lives.
      </p>

    </div>
  </div>
</div>

        {/* Meet The Team Section */}
        <div className="w-full max-w-[1280px] mx-auto p-4 sm:p-8 lg:p-6 mt-1">
          {/* Heading */}
          <h2 className="text-center text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Meet the Team
          </h2>

          {/* Team Members Grid - Changed to show 2 members per row on mobile */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-6 flex flex-col items-center text-center">
                {/* Role Badge with Subtle Shining Effect */}
                <div 
                  className="role-badge" 
                  style={getRoleBadgeStyle(member.role)}
                >
                  {member.role}
                </div>

                {/* Profile Picture */}
                <div className="w-[200px] h-[250px] bg-gray-300 rounded-[20px] overflow-hidden flex items-center justify-center">
                  <img 
                    src={member.image} 
                    alt={member.role} 
                    className="w-full h-full object-cover rounded-[20px]" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200";
                    }}
                  />
                </div>
                
                {/* Member Name */}
                <h3 className="text-gray-700 text-s sm:text-1xl font-bold leading-7 mt-3">
                  {member.name}
                </h3>

                {/* Social Media Icons */}
                <div className="flex justify-center items-center flex-wrap gap-2 mt-4">
                  {member.socials.map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="w-8 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <img 
                        src={socialIcons[social.type]} 
                        alt={social.type} 
                        className="w-5 h-5 invert-0" 
                      />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
