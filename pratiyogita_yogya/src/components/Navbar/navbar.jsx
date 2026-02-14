import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PRATIYOGITA_GYAN_URL =
  import.meta.env.VITE_PRATIYOGITA_GYAN_URL || "https://gyan.psetu.com/";
const PRATIYOGITA_MARG_URL =
  import.meta.env.VITE_PRATIYOGITA_MARG_URL || "https://marg.psetu.com/";

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

  const getRedirectUrlWithLoginHint = (baseUrl) => {
    try {
      const url = new URL(baseUrl, window.location.origin);
      if (currentUser) {
        url.searchParams.set("loggedIn", "1");
        url.searchParams.set("source", "pratiyogita_yogya");
      }
      return url.toString();
    } catch {
      return baseUrl;
    }
  };

  return (
    <div className="fixed top-1 left-0 right-0 z-50">
      <nav
        className={`w-full px-2 sm:px-3 md:px-4 py-1.5 rounded-none md:rounded-lg shadow-lg transition-all duration-300 
          ${
            isScrolled ? "backdrop-blur-lg bg-white/15" : "bg-white"
          } border border-gray-300`}
      >
        <div className="w-full flex items-center h-10 sm:h-12 relative">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="./logos/py.png"
              alt="Pratiyogita Yogya Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
            <img
              src="./logos/py_name.svg"
              alt="Pratiyogita Yogya"
              className="h-4 sm:h-5 object-contain"
            />
          </Link>

          {/* Center - Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
            <div className="flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-500">
              Home
            </a>
            <a
              href={getRedirectUrlWithLoginHint(PRATIYOGITA_GYAN_URL)}
              className="text-gray-700 hover:text-blue-500"
            >
              Pratiyogita Gyan
            </a>
            <a
              href={getRedirectUrlWithLoginHint(PRATIYOGITA_MARG_URL)}
              className="text-gray-700 hover:text-blue-500"
            >
              Pratiyogita Marg
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-500">
              About Us
            </a>


            </div>
          </div>

          {/* Right - Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-500">
                  Log In
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Try for Free
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-700">Hi, {currentUser.displayName || "User"}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto md:hidden">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 p-2 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t absolute left-4 right-4 shadow-md rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="py-2 animate-fadeIn">
            <a
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              Home
            </a>
            <a
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              About Us
            </a>
            <a
              href={getRedirectUrlWithLoginHint(PRATIYOGITA_GYAN_URL)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              Pratiyogita Gyan
            </a>
            <a
              href={getRedirectUrlWithLoginHint(PRATIYOGITA_MARG_URL)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              Pratiyogita Marg
            </a>

            {/* Features Dropdown in Mobile with Improved Animation */}
            <div className="px-4 py-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-center py-2 flex items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none"
              >
                Features
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`mt-1 bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen
                    ? "max-h-[200px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <a
                  href="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                >
                  Pratiyogita YOGYA
                </a>
                <a
                  href={getRedirectUrlWithLoginHint(PRATIYOGITA_MARG_URL)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                >
                  Pratiyogita MARG
                </a>
                <a
                  href={getRedirectUrlWithLoginHint(PRATIYOGITA_GYAN_URL)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                >
                  Pratiyogita GYAN
                </a>
              </div>
            </div>

            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center mt-1"
                >
                  Log In
                </Link>

                <div className="px-4 py-2">
                  <Link
                    to="/signup"
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
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
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors disabled:opacity-60"
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
