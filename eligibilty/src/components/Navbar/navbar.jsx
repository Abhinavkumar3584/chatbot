import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

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
              alt="Pariksha Yogya"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
            <span className="text-md sm:text-base font-bold text-[#1F2933] tracking-wide">
              Pariksha Yogya
            </span>
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

            <a
              href="https://www.pratiyogitagyan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1F2933] hover:text-[#3A7CA5]"
            >
              Gyan Setu
            </a>

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

            <a
              href="https://www.pratiyogitagyan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-[#1F2933] hover:bg-[rgba(58,124,165,0.12)] text-center"
            >
              Gyan Setu
            </a>

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
