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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getUserDisplayName = () => {
    const displayName = currentUser?.displayName?.trim();
    if (displayName) return displayName;

    const email = currentUser?.email?.trim();
    if (!email) return "User";

    const prefix = email.split("@")[0]?.trim();
    return prefix || email;
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] md:w-[80%] lg:w-[70%] z-50">
      <nav
        className={`w-full px-3 sm:px-4 md:px-6 py-1.5 rounded-2xl shadow-lg transition-all duration-300 
          ${
            isScrolled ? "backdrop-blur-lg bg-white/10" : "bg-white/5 backdrop-blur-sm"
          } border border-orange-500`}
      >
        <div className="w-full flex items-center h-10 sm:h-12 relative">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="./logos/py.png"
              alt="Pratiyogita Yogya Logo"
              className="h-10 w-auto sm:h-12 object-contain"
            />
          </Link>

          {/* Center - Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
            <div className="flex items-center space-x-6">
            <a href="/" className="text-white hover:text-orange-400 font-semibold">
              Home
            </a>
            <a
              href={PRATIYOGITA_GYAN_URL}
              className="text-white hover:text-orange-400 font-semibold"
            >
              Pratiyogita Gyan
            </a>
            <a
              href={PRATIYOGITA_MARG_URL}
              className="text-white hover:text-orange-400 font-semibold"
            >
              Pratiyogita Marg
            </a>
            <a href="/about" className="text-white hover:text-orange-400 font-semibold">
              About Us
            </a>


            </div>
          </div>

          {/* Right - Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-white hover:text-orange-400 font-semibold">
                  Log In
                </Link>
                <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold transition-colors">
                  Try for Free
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-white/80">Hi, {getUserDisplayName()}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-60 font-semibold transition-colors"
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
              className="md:hidden text-white p-2 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <>
            <div
              onClick={() => {
                setIsOpen(false);
                setIsDropdownOpen(false);
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            <div className="fixed top-[52px] sm:top-[60px] right-0 bottom-0 w-[82vw] max-w-[320px] bg-gray-900/95 backdrop-blur-md border-l border-orange-500 shadow-2xl z-50 md:hidden p-3 overflow-y-auto flex flex-col">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10 mb-2"
              >
                ← Back
              </button>

              <div className="space-y-1">
                <a href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-white/10">Home</a>
                <a href={PRATIYOGITA_GYAN_URL} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-white/10">Pratiyogita Gyan</a>
                <a href={PRATIYOGITA_MARG_URL} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-white/10">Pratiyogita Marg</a>
                <a href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-white hover:bg-white/10">About Us</a>
              </div>

              <div className="px-1 py-1 mt-2" ref={dropdownRef}>

                <div
                  className={`mt-1 bg-white/5 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                    isDropdownOpen ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <a href="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white hover:bg-white/10 text-center">Pratiyogita YOGYA</a>
                  <a href={PRATIYOGITA_MARG_URL} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white hover:bg-white/10 text-center">Pratiyogita MARG</a>
                  <a href={PRATIYOGITA_GYAN_URL} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white hover:bg-white/10 text-center">Pratiyogita GYAN</a>
                </div>
              </div>

              <div className="border-t border-orange-500/40 mt-auto pt-3">
                {!currentUser ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-white hover:bg-white/10 rounded-md text-center">Log In</Link>
                    <div className="pt-2">
                      <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center font-semibold">Try for Free</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 mb-2 text-center bg-white/5 rounded-md">
                      <p className="text-sm text-white/60">Logged in as</p>
                      <p className="font-medium text-white">{getUserDisplayName()}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 font-semibold"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
