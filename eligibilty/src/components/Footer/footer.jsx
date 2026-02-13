import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative bg-[rgba(231,231,231,0.4)] border border-[rgba(0,0,0,0.4)] py-3 overflow-hidden rounded-lg">
      
      {/* Footer content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-6 max-w-7xl mx-auto">
        {/* Right Section - Description, Socials, and Footer */}
        <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left mt-6 lg:mt-0 lg:pl-8">

          {/* Description with reduced spacing */}
          <div className="max-w-md text-black-700 mb-4">
            <p className="text-sm leading-tight text-justify">
              One-stop platform for competitive exam aspirants, offering a personalized exam eligibility and attempts calculator, an AI-powered chatbot with essential books and explanations, and a structured roadmap with best practices and study resources.
            </p>
          </div>

          {/* Email Support */}
          <div className="flex items-center mb-4">
            <span className="text-gray-700 text-sm mr-2">For help and support:</span>
            <a href="mailto:askparikshasetu@gmail.com" className="text-blue-600 hover:underline text-sm">
              askparikshasetu@gmail.com
            </a>
          </div>

          {/* Social Media Icons with reduced margins */}
          <div className="inline-block bg-black rounded-lg px-2 py-0.5 mb-4">
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
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-1 mb-4 text-black-700 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contribution" className="hover:underline">Contribution</Link>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer with reduced padding */}
      <div className="relative z-10 border-t border-gray-300 mt-1 pt-3">
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 max-w-7xl mx-auto text-gray-600 text-sm">
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