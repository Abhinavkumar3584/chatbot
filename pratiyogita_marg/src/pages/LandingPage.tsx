import { Hero } from '@/components/Hero';
import InfinityImgScroll from '@/components/InfinityImgScroll';
import { GlowingEffectDemo } from '@/components/FeatureCards';
import InfinityExams from '@/components/InfinityExams';
import FAQS from '@/components/FAQS';
import Footer from '@/components/Footer';
import StatsAnalytics from '@/components/Stat';
import HowItWorks from '@/components/HowItWorks';
import Navbar from '@/components/Navbar';

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <div className="w-full mx-0 px-0">
        <Hero />
      </div>

      <div>
        <StatsAnalytics/>
      </div>

      <div>
        <InfinityImgScroll />
      </div>

      {/* How It Works Section - Pariksha Setu Tools */}
      <div className="w-full">
        <HowItWorks />
      </div>

      <div className="w-full p-4 m-auto overflow-hidden">
        <GlowingEffectDemo />
      </div>

      <div className="w-full mx-0 px-0">
        <InfinityExams />
      </div>

      <div className="w-full p-4 pb-0 pt-0 m-auto">
        <FAQS />
      </div>

      <div className="w-full p-4 pt-0 m-auto">
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
