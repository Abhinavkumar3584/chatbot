import React, { useState, useEffect } from 'react';

const StatsAnalytics = () => {
  const [examCount] = useState(50); // Static for Marg
  const [mainFolderCount] = useState(15); // Static for Marg

  return (
    <div className="relative z-10 max-w-full mx-auto px-2 py-3 md:px-4 md:py-6 lg:px-6 lg:py-8">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-xl"></div>
        
        {/* Stats grid for mobile, row for desktop */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center items-stretch gap-4 md:gap-3 lg:gap-4">
          {/* Main Categories */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-yellow-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-yellow-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-yellow-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+2</span>
              <span className="text-yellow-700 ml-1.5 font-medium">quarterly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-yellow-800">{mainFolderCount}</div>
            <div className="text-yellow-600 text-[10px] md:text-xs lg:text-base font-medium">Main Categories</div>
          </div>

          {/* Available Exams */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-rose-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-rose-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-rose-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+15</span>
              <span className="text-rose-700 ml-1.5 font-medium">monthly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-rose-800">{examCount}</div>
            <div className="text-rose-600 text-[10px] md:text-xs lg:text-base font-medium">Available Roadmaps</div>
          </div>

          {/* Form Inputs */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-cyan-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-cyan-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-cyan-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">Mind Map</span>
              <span className="text-cyan-700 ml-1.5 font-medium">nodes</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-cyan-800">20+</div>
            <div className="text-cyan-600 text-[10px] md:text-xs lg:text-base font-medium">Node Types</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsAnalytics;
