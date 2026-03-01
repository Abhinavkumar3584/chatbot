
import "./App.css";
import Navbar from "@/components/Navbar/navbar";
import { HeroUIProvider } from "@heroui/react";
import { Routes, Route, Navigate } from "react-router-dom";
// import ContributionPage from "./Pages/contribution";
// import Home from "./Pages/home";
import ContactPage from "./Pages/contactus";
import AboutUs from "./Pages/aboutus";
import Login from "./Pages/login";
import Signup from "./Pages/signup";
import TermsAndConditions from "./Pages/termsandconditions";
import RefundPolicy from "./Pages/refundpolicy";
import CheckEligibility from "./Pages/checkeligibilitypage";

function App() {
  return (
    <>
      <HeroUIProvider className="w-full mx-0 px-0 overflow-x-hidden">
        {/* Grainy background - matching Setu */}
        <svg className="hidden">
          <filter id="grainy">
            <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="grainy-background-layer" />
        <div className="w-full ">
          <Navbar />
        </div>

        <Routes>
          <Route path="/home" element={<Navigate to="/check-eligibility" replace />} />
          <Route path="/" element={<CheckEligibility />} />
          {/* <Route path="/contribution" element={<ContributionPage />} /> */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/check-eligibility" element={<CheckEligibility />} />
          <Route path="/checkeligibility" element={<CheckEligibility />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Routes>
      </HeroUIProvider>
    </>
  );
}

export default App;
