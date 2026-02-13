import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative bg-[#F6F7F9] border border-[#E3E7ED] py-3 overflow-hidden rounded-xl shadow-sm">
      <div className="relative z-10 px-6 py-4 max-w-7xl mx-auto text-center">
        <div className="mb-3 text-lg font-bold text-[#1F2933]">Pariksha Yogya</div>

        <p className="text-[#52616B] text-sm mb-3">
          For help and support: <a href="mailto:askparikshasetu@gmail.com" className="text-[#3A7CA5] hover:underline">askparikshasetu@gmail.com</a>
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-3">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <img src="/social_media/linkedin.svg" alt="LinkedIn" className="w-10 h-10" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <img src="/social_media/facebook.svg" alt="Facebook" className="w-10 h-10" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <img src="/social_media/x.svg" alt="X" className="w-10 h-10" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
            <img src="/social_media/insta.svg" alt="Instagram" className="w-10 h-10" />
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-3 text-[#52616B] text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
        </div>

        {/* Bottom Footer */}
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
    </div>
  );
};

export default Footer;