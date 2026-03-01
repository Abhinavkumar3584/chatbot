import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const PRATIYOGITA_YOGYA_URL =
  import.meta.env.VITE_PRATIYOGITA_YOGYA_URL || "http://localhost:5173";
const PRATIYOGITA_MARG_URL =
  import.meta.env.VITE_PRATIYOGITA_MARG_URL || "http://localhost:8080";
const PRATIYOGITA_GYAN_URL =
  import.meta.env.VITE_PRATIYOGITA_GYAN_URL || "http://localhost:3002";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Add scroll event listener for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
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

  return (
    <>
    <div className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] md:w-[80%] lg:w-[70%] z-50">
      <nav
        className={`w-full px-3 sm:px-4 md:px-6 py-1.5 rounded-2xl transition-all duration-150 flex items-center ${
          isScrolled
            ? "backdrop-blur-lg bg-white/10 border border-orange-500 shadow-lg"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="w-full flex items-center h-10 sm:h-12 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logos/ps.png"
              alt="Pratiyogita Setu Logo"
              className="h-10 w-auto sm:h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/64x64/indigo/white?text=PS";
              }}
            />
          </Link>

          {/* Center - Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
            <div className="flex items-center space-x-3 lg:space-x-6 whitespace-nowrap">
              <Link to="/" className="text-white hover:text-orange-400 font-semibold text-sm lg:text-base">
                Home
              </Link>
              <a
                href={`${PRATIYOGITA_YOGYA_URL}/check-eligibility`}
                className="text-white hover:text-orange-400 font-semibold text-sm lg:text-base"
              >
                Pratiyogita Yogya
              </a>
              <a
                href={`${PRATIYOGITA_MARG_URL}/explore`}
                className="text-white hover:text-orange-400 font-semibold text-sm lg:text-base"
              >
                Pratiyogita Marg
              </a>
              <a
                href={PRATIYOGITA_GYAN_URL}
                className="text-white hover:text-orange-400 font-semibold text-sm lg:text-base"
              >
                Pratiyogita Gyan
              </a>
              <Link to="/gyan-posters" className="relative text-white hover:text-orange-400 font-semibold text-sm lg:text-base">
                Gyan Posters
                <span className="absolute -top-2.5 -right-7 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none animate-pulse">NEW</span>
              </Link>
              <Link to="/about" className="text-white hover:text-orange-400 font-semibold text-sm lg:text-base">
                About Us
              </Link>
            </div>
          </div>

          {/* Right - Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
            <Link to="/login" className="text-white hover:text-orange-400 font-semibold">
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold"
            >
              Try for Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 ml-auto md:hidden">
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

      </nav>
    </div>

    {/* Mobile Menu Drawer - rendered via portal to escape stacking context */}
    {isOpen &&
      createPortal(
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] md:hidden"
          />

          <div className="fixed top-16 right-4 bottom-4 w-[82vw] max-w-[320px] bg-gray-900/95 backdrop-blur-md border border-orange-500 rounded-lg shadow-2xl z-[9999] md:hidden p-3 overflow-y-auto flex flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10 mb-2 font-semibold"
            >
              ← Back
            </button>

            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10 font-semibold"
              >
                Home
              </Link>
              <a
                href={`${PRATIYOGITA_YOGYA_URL}/check-eligibility`}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10 font-semibold"
              >
                Pratiyogita Yogya
              </a>
              <a
                href={`${PRATIYOGITA_MARG_URL}/explore`}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10 font-semibold"
              >
                Pratiyogita Marg
              </a>
              <a
                href={PRATIYOGITA_GYAN_URL}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10 font-semibold"
              >
                Pratiyogita Gyan
              </a>
              <Link
                to="/gyan-posters"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-white/10 font-semibold"
              >
                Gyan Posters
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none animate-pulse">NEW</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10 font-semibold"
              >
                About Us
              </Link>
            </div>

            <div className="border-t border-orange-500 mt-auto pt-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-white hover:bg-white/10 rounded-md text-center font-semibold"
              >
                Log In
              </Link>
              <div className="pt-2">
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center font-semibold"
                >
                  Try for Free
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default Navbar;
