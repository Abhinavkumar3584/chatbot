import React, { useState } from 'react';

const FAQS = () => {
  const faqData = [
    {
      question: "What is Pratiyogita Marg?",
      answer: "Pratiyogita Marg is a roadmap platform for competitive exams where you can explore structured study paths and visualize complete exam preparation in mind map format."
    },
    {
      question: "How does the mind map roadmap work?",
      answer: "Each roadmap breaks exam preparation into subjects, topics, and subtopics in a connected visual flow so you always know what to study next."
    },
    {
      question: "Can I edit or create my own mind map?",
      answer: "Yes. After login, you can open the editor and create, edit, and customize your mind maps based on your own strategy."
    },
    {
      question: "Will my mind map progress be saved?",
      answer: "Yes. Your roadmap progress and edits are saved so you can continue preparation from where you left off."
    },
    {
      question: "Does Pratiyogita Marg support multiple exams?",
      answer: "Yes. It supports major competitive exam categories and provides roadmap-based preparation for each exam."
    },
    {
      question: "Is there a topic priority system?",
      answer: "Yes. Topics are organized with importance and study order so you can focus on high-impact areas first."
    },
    {
      question: "Can I use Pratiyogita Marg for revision planning?",
      answer: "Absolutely. You can use checklist, note, timeline, and quiz nodes in roadmaps to plan revision and self-testing."
    },
    {
      question: "Is Pratiyogita Marg free to use?",
      answer: "Core roadmap exploration is available for all users, and additional advanced features are available based on platform updates."
    },
    {
      question: "Can I export my mind map?",
      answer: "Yes. You can export your mind maps as images (PNG/SVG) or JSON files for backup and sharing."
    },
    {
      question: "How do I track my preparation progress?",
      answer: "Use checkbox nodes in the mind map to mark completed topics. The visual roadmap shows your completion status at a glance."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // SVG Components for Open/Close buttons
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
      <path 
        fill="currentColor" 
        d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M16.7,15.3l-1.4,1.4L12,13.4l-3.3,3.3l-1.4-1.4l3.3-3.3 L7.3,8.7l1.4-1.4l3.3,3.3l3.3-3.3l1.4,1.4L13.4,12L16.7,15.3z">
      </path>
    </svg>
  );

  const OpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
      <path 
        fill="currentColor" 
        d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,13h-4v4h-2v-4H7v-2h4V7h2v4h4V13z">
      </path>
    </svg>
  );

  return (
    <div className="max-w-5xl mx-auto px-3 py-6 m-5 bg-[#f5f5f5] border border-[rgba(0,0,0,0.4)] rounded-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-5">
        FAQs (Pratiyogita Marg)
      </h1>
      
      <div className="flex flex-col space-y-2">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className={`border border-gray-200 rounded-lg bg-white
                      transition-all duration-700 ease-in-out cursor-pointer
                      ${activeIndex === index ? 'border-gray-300' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center px-4 py-2">
              <h3 className="text-sm md:text-base text-left font-medium text-gray-700 pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0 transform transition-transform duration-300 ease-in-out">
                {activeIndex === index ? <CloseIcon /> : <OpenIcon />}
              </div>
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out transform
                ${activeIndex === index 
                  ? 'max-h-96 opacity-100 translate-y-0' 
                  : 'max-h-0 opacity-0 -translate-y-1'
                }`}
            >
              <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                <p className="text-gray-600 text-left text-sm md:text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQS;
