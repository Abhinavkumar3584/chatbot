import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative bg-[#F6F7F9] border border-[#E3E7ED] py-3 overflow-hidden rounded-xl shadow-sm">
      
      {/* Footer content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-6 max-w-7xl mx-auto">
        {/* Left Section - Features */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-6 lg:mt-0 lg:pl-8">
          {/* Boxed section title */}
          <div className="inline-block bg-[#3A7CA5] rounded-lg px-2 py-0.5 mb-4">
            <h3 className="text-base font-semibold text-white">Our Services</h3>
          </div>
                    
          {/* Feature Cards with reduced spacing */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="flex flex-col items-center lg:items-start max-w-md">
              <div className="mb-2">
                <img src="./logos/py_name.svg" alt="Eligibility Calculator" className="p-2 w-50 h-10 border rounded-lg shadow-sm bg-white border-[#E3E7ED]" />
              </div>
              <p className="text-[#52616B] text-sm text-justify">
                Exam eligibility and attempts calculator providing personalized insights based on age, education, and criteria for competitive exams.
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start max-w-md">
              <div className="mb-2">
                <img src="./logos/pm_name.svg" alt="Expert Roadmaps" className="p-2 w-50 h-10 border rounded-lg shadow-sm bg-white border-[#E3E7ED]" />
              </div>
              <p className="text-[#52616B] text-sm text-justify">
                Guided path to competitive exam success with Subject - Expert roadmaps, best practices, and essential study materials.
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start max-w-md">
              <div className="mb-2">
                <img src="./logos/pg_name.svg" alt="AI Chatbot" className="p-2 w-50 h-10 border rounded-lg shadow-sm bg-white border-[#E3E7ED]" />
              </div>
              <p className="text-[#52616B] text-sm text-justify">
                AI-powered chatbot with all necessary books, references, and explanations for competitive exam preparation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Description, Socials, and Footer */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-6 lg:mt-0 lg:pl-8">
          {/* Boxed section title */}
          <div className="inline-block bg-[#3A7CA5] rounded-lg px-2 py-0.5 mb-4">
            <h3 className="text-base font-semibold text-white">About Us</h3>
          </div>
          
          <div className="p-2 border rounded-lg shadow-sm flex items-center space-x-4 mb-3 bg-white border-[#E3E7ED]">
            <img src="./logos/ps_name.svg" alt="Pariksha Yogya" className="w-45 h-5" />
          </div>

          {/* Description with reduced spacing */}
          <div className="max-w-md text-[#52616B] mb-4">
            <p className="text-sm leading-tight text-justify">
              One-stop platform for competitive exam aspirants, offering a personalized exam eligibility and attempts calculator, an AI-powered chatbot with essential books and explanations, and a structured roadmap with best practices and study resources.
            </p>
          </div>

          {/* Email Support */}
          <div className="flex items-center mb-4">
            <span className="text-[#52616B] text-sm mr-2">For help and support:</span>
            <a href="mailto:askparikshasetu@gmail.com" className="text-[#3A7CA5] hover:underline text-sm">
              askparikshasetu@gmail.com
            </a>
          </div>

          {/* Social Media Icons with reduced margins */}
          <div className="inline-block bg-[#3A7CA5] rounded-lg px-2 py-0.5 mb-4">
            <h3 className="text-base font-medium text-white">Connect With Us</h3>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
            <a href="mailto:askparikshasetu@gmail.com" className="hover:scale-110 transition-transform duration-300">
            
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
              <img src="/social_media/linkedin.svg" alt="LinkedIn" className="w-12 h-12" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
              <img src="/social_media/facebook.svg" alt="Facebook" className="w-12 h-12" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
              <img src="/social_media/x.svg" alt="X" className="w-12 h-12" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
              <img src="/social_media/insta.svg" alt="Instagram" className="w-12 h-12" />
            </a>
          </div>

          {/* Navigation Links with reduced spacing */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-1 mb-4 text-[#52616B] text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contribution" className="hover:underline">Contribution</Link>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer with reduced padding */}
      <div className="relative z-10 border-t border-[#E3E7ED] mt-1 pt-3">
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 max-w-7xl mx-auto text-[#6B7C93] text-sm">
          <div>Made with ❤️ for Aspirants</div>
          <div className="mt-1 sm:mt-0">
            © {new Date().getFullYear()} | 
            <Link to="/privacy-policy" className="underline hover:text-gray-800 ml-1">Privacy Policy</Link> | 
            <Link to="/terms-and-conditions" className="underline hover:text-gray-800">Terms & Conditions</Link> |
            <Link to="/refund-policy" className="underline hover:text-gray-800">Refund Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;