import React from 'react';

const StatsAnalytics = () => {
  // Telegram channel link
  const telegramChannelLink = "https://t.me/pratiyogitasetu";

  
  return (
    <div className="relative z-10 max-w-full mx-auto px-2 py-3 md:px-4 md:py-6 lg:px-6 lg:py-8">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#dbe8f1] rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#dfe7ee] rounded-full opacity-20 blur-xl"></div>
        
        {/* Stats grid for mobile, row for desktop */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center items-stretch gap-4 md:gap-3 lg:gap-4">
          {/* Telegram Channel - now with QR code */}
          <a 
            href={telegramChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#dbe8f1] rounded-full opacity-30"></div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Telegram</div>
            <div className="my-0 md:my-2 lg:my-3">
              <img 
                src="./telegram_qr.jpg"
                alt="Telegram Channel QR Code" 
                className="w-12 h-12 md:w-24 md:h-24 lg:w-24 lg:h-24 rounded-md border border-[#E3E7ED]"
              />
            </div>
            <div className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg text-[8px] md:text-[10px] lg:text-xs ">Click to join</div>
          </a>

          {/* Registered Users */}
          <div className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-[#dfe7ee] rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+0</span>
              <span className="text-[#52616B] ml-1.5 font-medium">monthly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-[#1F2933]">0</div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Registered Users</div>
          </div>

          {/* Total Users */}
          <div className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#dbe8f1] rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+0</span>
              <span className="text-[#52616B] ml-1.5 font-medium">yearly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-[#1F2933]">0</div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Total Users</div>
          </div>

          {/* Eligible Aspirants */}
          <div className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#dfe7ee] rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+0</span>
              <span className="text-[#52616B] ml-1.5 font-medium">weekly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-[#1F2933]">0</div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Eligible Aspirants</div>
          </div>

          {/* Main Categories */}
          <div className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-[#dbe8f1] rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+1</span>
              <span className="text-[#52616B] ml-1.5 font-medium">quarterly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-[#1F2933]">1</div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Main Categories</div>
          </div>

          {/* Available Exams - now separate from main folders count */}
          <div className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-[#dfe7ee] rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+1</span>
              <span className="text-[#52616B] ml-1.5 font-medium">monthly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-[#1F2933]">1</div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Available Exams</div>
          </div>

          {/* Form Inputs */}
          <div className="bg-white flex flex-col items-center p-2 md:p-3 lg:p-5 border border-[#E3E7ED] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#dbe8f1] rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-[#3A7CA5] text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">0+1</span>
              <span className="text-[#52616B] ml-1.5 font-medium">fields</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-[#1F2933]">1</div>
            <div className="text-[#3A7CA5] text-[10px] md:text-xs lg:text-base font-medium">Form Inputs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsAnalytics;