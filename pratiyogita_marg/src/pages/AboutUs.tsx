import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 mt-8">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pratiyogita Marg</span>
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700">
                Pratiyogita Marg is dedicated to helping competitive exam aspirants navigate their preparation journey with clarity and confidence. We provide structured, visual roadmaps that break down complex exam syllabi into manageable, organized paths.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Visual Mind Maps:</strong> Interactive roadmaps that visualize your entire exam preparation journey</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Progress Tracking:</strong> Mark completed topics and track your preparation progress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Customizable Roadmaps:</strong> Create and edit your own study plans based on your strategy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Comprehensive Coverage:</strong> Access roadmaps for 50+ major competitive exams</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Our Ecosystem</h2>
              <p className="text-gray-700 mb-4">
                Pratiyogita Marg is part of the Pariksha Setu ecosystem, designed to support exam aspirants at every step:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-violet-50 rounded-lg">
                  <h3 className="font-bold text-violet-700 mb-2">Pratiyogita Yogya</h3>
                  <p className="text-sm text-gray-600">Check your exam eligibility and remaining attempts instantly</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-700 mb-2">Pratiyogita Marg</h3>
                  <p className="text-sm text-gray-600">Get structured roadmaps with topic-wise preparation paths</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-bold text-emerald-700 mb-2">Pratiyogita Gyan</h3>
                  <p className="text-sm text-gray-600">Learn with AI assistant trained on exam materials</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700">
                Have questions or feedback? We'd love to hear from you!
              </p>
              <p className="text-gray-700 mt-4">
                <strong>Email:</strong> <a href="mailto:askparikshasetu@gmail.com" className="text-blue-600 hover:underline">askparikshasetu@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
