import React from 'react';

// Custom animation styles with adjusted keyframes for true infinite scrolling
const customStyles = `
  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 8px)); }
  }
  
  @keyframes scrollRight {
    0% { transform: translateX(calc(-50% - 8px)); }
    100% { transform: translateX(0); }
  }
  
  .animate-scroll-left {
    animation: scrollLeft 30s linear infinite;
    display: flex;
    width: max-content;
  }
  
  .animate-scroll-right {
    animation: scrollRight 30s linear infinite;
    display: flex;
    width: max-content;
  }
  
  .scroll-container {
    display: flex;
    overflow: hidden;
    width: 100%;
    position: relative;
  }

  .inner-container {
    display: flex;
    flex-shrink: 0;
  }
`;

const InfinityExams = () => {
  // Arrays of exam names for each line
  const line1Exams = ["JEE Main", "NEET", "GATE", "UGC NET", "CAT", "UPSC", "SSC CGL", "IBPS PO", "NDA", "CDS", "CLAT", "JEE Advanced", "NEET", "GATE"];
  const line2Exams = ["IIT JEE Advanced", "AIIMS", "BITSAT", "XAT", "GMAT", "GRE", "TOEFL", "IELTS", "CTET", "MPSC", "IIT JEE", "AIIMS", "BITSAT"];
  const line3Exams = ["CA Foundation", "CS Executive", "NEET PG", "JEST", "CSIR NET", "JIPMER", "AILET", "MAT", "SNAP", "CA Foundation", "CS Executive"];
  
  // Light mode colors
  const colors1 = [
    "bg-white border-[#E3E7ED] text-[#1F2933]",
    "bg-[#edf4f8] border-[#cfe0eb] text-[#3A7CA5]",
    "bg-[#f3f6f9] border-[#d8e1e8] text-[#52616B]",
    "bg-[#edf4f8] border-[#cfe0eb] text-[#3A7CA5]",
    "bg-white border-[#E3E7ED] text-[#1F2933]"
  ];
  
  const colors2 = [
    "bg-[#edf4f8] border-[#cfe0eb] text-[#3A7CA5]",
    "bg-white border-[#E3E7ED] text-[#1F2933]",
    "bg-[#f3f6f9] border-[#d8e1e8] text-[#52616B]",
    "bg-white border-[#E3E7ED] text-[#1F2933]",
    "bg-[#edf4f8] border-[#cfe0eb] text-[#3A7CA5]"
  ];
  
  const colors3 = [
    "bg-[#f3f6f9] border-[#d8e1e8] text-[#52616B]",
    "bg-[#edf4f8] border-[#cfe0eb] text-[#3A7CA5]",
    "bg-white border-[#E3E7ED] text-[#1F2933]",
    "bg-[#edf4f8] border-[#cfe0eb] text-[#3A7CA5]",
    "bg-[#f3f6f9] border-[#d8e1e8] text-[#52616B]"
  ];

  // Function to assign a color to an exam
  const getColor = (index, colors) => {
    return colors[index % colors.length];
  };

  const renderExam = (exam, index, lineNumber, colors) => (
    <div 
      key={`line${lineNumber}-${index}`} 
      className={`flex items-center px-3 py-1.5 rounded-[10px] border text-xs font-medium sm:text-sm max-w-fit mx-1 ${getColor(index, colors)}`}
    >
      {exam}
    </div>
  );

  return (
    <div className="w-full overflow-hidden py-6 bg-[#F6F7F9] border-y border-[#E3E7ED]">
      {/* Inject custom animation styles */}
      <style>{customStyles}</style>
      
      {/* First line - left to right */}
      <div className="scroll-container my-4">
        <div className="animate-scroll-left">
          {/* First set of exams */}
          <div className="inner-container">
            {line1Exams.map((exam, index) => renderExam(exam, index, 1, colors1))}
          </div>
          {/* Second set for seamless loop */}
          <div className="inner-container">
            {line1Exams.map((exam, index) => renderExam(exam, index, "1-dup", colors1))}
          </div>
        </div>
      </div>
      
      {/* Second line - right to left */}
      <div className="scroll-container my-4">
        <div className="animate-scroll-right">
          {/* First set of exams */}
          <div className="inner-container">
            {line2Exams.map((exam, index) => renderExam(exam, index, 2, colors2))}
          </div>
          {/* Second set for seamless loop */}
          <div className="inner-container">
            {line2Exams.map((exam, index) => renderExam(exam, index, "2-dup", colors2))}
          </div>
        </div>
      </div>
      
      {/* Third line - left to right */}
      <div className="scroll-container my-4">
        <div className="animate-scroll-left">
          {/* First set of exams */}
          <div className="inner-container">
            {line3Exams.map((exam, index) => renderExam(exam, index, 3, colors3))}
          </div>
          {/* Second set for seamless loop */}
          <div className="inner-container">
            {line3Exams.map((exam, index) => renderExam(exam, index, "3-dup", colors3))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfinityExams;