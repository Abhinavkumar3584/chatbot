import { Hero } from "@/components/Hero/hero";
import InfinityImgScroll from "@/components/Infinityimgscroll/infinityimgscroll";
// import FeatureSection from "@/components/Featurecards/cardscontent";
import InfinityExams from "@/components/Infinityexams/infinityexams";
import FAQS from "@/components/FAQS/faqs";
import Footer from "@/components/Footer/footer";
import { GlowingEffectDemo } from "../components/Featurecards/cardscontent";
import StatsAnalytics from "@/components/Stat/stat";
import HowItWorks from "@/components/HowItWorks/howitworks";

function Home() {
  return (
    <>
      <div className="w-full mx-0 px-0">
        <Hero />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <StatsAnalytics/>
      </div>

      <div>
        <InfinityImgScroll />
      </div>

      {/* How It Works Section - Pariksha Setu Tools */}
      <div className="w-full">
        <HowItWorks />
      </div>

      <div className="w-full p-4 m-auto overflow-hidden max-w-7xl">
        <GlowingEffectDemo />
      </div>

      <div className="w-full mx-0 px-0">
        <InfinityExams />
      </div>

      <div className="w-full p-4 pb-0 pt-0 m-auto max-w-7xl">
        <FAQS />
      </div>

      <div className="w-full p-4 pt-0 m-auto max-w-7xl">
        <Footer />
      </div>
    </>
  );
}

export default Home;