import React from 'react';
import { Bot } from 'lucide-react';

const AboutUsParent = () => {
  return (
    <div className="min-h-screen pt-20 px-4 pb-8 bg-[#F6F7F9]">
      <div className="max-w-4xl mx-auto bg-white border border-[#E3E7ED] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-white border-b border-[#E3E7ED] p-4 flex items-center space-x-3">
          <Bot className="w-6 h-6 text-[#3A7CA5]" />
          <h2 className="text-lg font-semibold text-[#1F2933]">About Pratiyogita Gyan</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#52616B] text-center">
            <strong>Pratiyogita Gyan</strong> is an AI-powered educational chatbot designed to help students prepare for competitive exams with comprehensive study materials and practice questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#edf4f8] p-4 rounded-lg border border-[#cfe0eb]">
              <h3 className="font-semibold text-[#3A7CA5] mb-3 text-center">Key Features</h3>
              <ul className="space-y-2 text-[#52616B] text-sm">
                <li className="flex items-center space-x-2"><span>📚</span><span>NCERT-based comprehensive answers</span></li>
                <li className="flex items-center space-x-2"><span>📝</span><span>Previous Year Questions integration</span></li>
                <li className="flex items-center space-x-2"><span>🎯</span><span>Subject-specific learning</span></li>
                <li className="flex items-center space-x-2"><span>💡</span><span>AI-powered instant responses</span></li>
                <li className="flex items-center space-x-2"><span>🔍</span><span>Smart search & relevance scoring</span></li>
              </ul>
            </div>

            <div className="bg-[#f3f6f9] p-4 rounded-lg border border-[#E3E7ED]">
              <h3 className="font-semibold text-[#3A7CA5] mb-3 text-center">Perfect For</h3>
              <ul className="space-y-2 text-[#52616B] text-sm">
                <li className="flex items-center space-x-2"><span>🎓</span><span>UPSC Civil Services preparation</span></li>
                <li className="flex items-center space-x-2"><span>📊</span><span>SSC examinations</span></li>
                <li className="flex items-center space-x-2"><span>🏦</span><span>Banking & Insurance exams</span></li>
                <li className="flex items-center space-x-2"><span>🛡️</span><span>Teaching & Defence exams</span></li>
                <li className="flex items-center space-x-2"><span>🧠</span><span>General knowledge enhancement</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-[#F6F7F9] border border-[#E3E7ED] p-4 rounded-lg">
            <p className="text-center text-[#52616B] font-medium text-sm">
              "Empowering students with AI-driven learning for competitive exam success"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsParent;
