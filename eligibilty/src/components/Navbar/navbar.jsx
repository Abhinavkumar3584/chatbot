import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll event listener for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-1 left-3 right-3 z-50">
      <nav
        className={`max-w-8xl px-4 sm:px-2 md:px-4 py-1.5 rounded-lg shadow-md transition-all duration-300 
          ${
            isScrolled ? "backdrop-blur-lg bg-white/90" : "bg-white"
          } border border-[#E3E7ED]`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-10 sm:h-12">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="./logos/py.png"
              alt="Pariksha Yogya Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
            <img
              src="./logos/py_name.svg"
              alt="Pariksha Yogya"
              className="h-4 sm:h-5 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="/" className="text-[#1F2933] hover:text-[#3A7CA5]">
              Home
            </a>
            <a href="/about" className="text-[#1F2933] hover:text-[#3A7CA5]">
              About Us
            </a>
            <a href="/contact" className="text-[#1F2933] hover:text-[#3A7CA5]">
              Contact Us
            </a>

            {/* Features Dropdown with Animation */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-[#1F2933] hover:text-[#3A7CA5] focus:outline-none"
              >
                Features
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Items with Animation */}
              <div
                className={`absolute left-0 mt-2 w-48 bg-white border border-[#E3E7ED] shadow-md rounded-lg z-50 transition-all duration-300 transform origin-top 
                      ${
                        isDropdownOpen
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-0 pointer-events-none"
                      }`}
              >
                <a
                  href="/"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)]"
                >
                  PARIKSHA YOGYA
                </a>
                <a
                  href="https://marg.psetu.com/"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)]"
                >
                  PARIKSHA MARG
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)]"
                >
                  PARIKSHA GYAN
                </a>
              </div>
            </div>

            {!currentUser ? (
              <>
                <Link to="/login" className="text-[#1F2933] hover:text-[#3A7CA5]">
                  Log In
                </Link>
                <Link to="/signup" className="bg-[#3A7CA5] text-white px-4 py-2 rounded-lg hover:bg-[#336f94]">
                  Try for Free
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-[#52616B]">Hi, {currentUser.displayName || "User"}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-[#6B7C93] text-white px-4 py-2 rounded-lg hover:bg-[#5f6f85] disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-[#1F2933] p-2 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border border-[#E3E7ED] absolute left-4 right-4 shadow-md rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="py-2 animate-fadeIn">
            <a
              href="/"
              className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
            >
              Home
            </a>
            <a
              href="/about"
              className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
            >
              Contact Us
            </a>

            {/* Features Dropdown in Mobile with Improved Animation */}
            <div className="px-4 py-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-center py-2 flex items-center justify-center text-[#1F2933] hover:text-[#3A7CA5] focus:outline-none"
              >
                Features
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`mt-1 bg-[#F6F7F9] rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen
                    ? "max-h-[200px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <a
                  href="/"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
                >
                  PARIKSHA YOGYA
                </a>
                <a
                  href="https://marg.psetu.com/"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
                >
                  PARIKSHA MARG
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
                >
                  PARIKSHA GYAN
                </a>
              </div>
            </div>

            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center mt-1"
                >
                  Log In
                </Link>

                <div className="px-4 py-2">
                  <Link
                    to="/signup"
                    className="block w-full bg-[#3A7CA5] text-white px-4 py-2 rounded-lg hover:bg-[#336f94] transition-colors text-center"
                  >
                    Try for Free
                  </Link>
                </div>
              </>
            ) : (
              <div className="px-4 py-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full bg-[#6B7C93] text-white px-4 py-2 rounded-lg hover:bg-[#5f6f85] transition-colors disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
