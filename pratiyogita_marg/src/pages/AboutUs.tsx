import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  const teamMembers = [
    {
      role: 'CO-FOUNDER & PRODUCT LEAD',
      image: './Aboutusimages/Abhi.jpg',
      name: 'Abhinav Kumar',
    },
    {
      role: 'CO-FOUNDER & TECHNICAL LEAD',
      image: './Aboutusimages/Manu.jpg',
      name: 'Manu Dev',
    },
    {
      role: 'DATA & OPERATIONS LEAD',
      image: './Aboutusimages/Nitish.jpeg',
      name: 'Nitish Yadav',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 mt-8">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pratiyogita Setu</span>
          </h1>

          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <div className="w-full p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500 text-gray-700 text-base sm:text-lg leading-relaxed">
              <p className="mb-4 italic">
                We are <span className="font-semibold text-blue-700">Abhinav Kumar</span>, <span className="font-semibold text-blue-700">Manu Dev</span>, and <span className="font-semibold text-blue-700">Nitish Yadav</span>, and we created <span className="font-semibold">Pratiyogita Setu</span> with a simple purpose—
                to bring clarity, direction, and confidence to students preparing for competitive examinations.
              </p>
              <p className="mb-4">
                Every year in India, millions of aspirants prepare for thousands of government and competitive exams.
                But despite the effort they put in, many students struggle with one basic problem:
                they don’t clearly know where they stand or what their best path forward is.
              </p>
              <p className="mb-4">
                Some miss opportunities because they are unaware of their eligibility.
                Others spend years preparing for exams they may never qualify for.
                And many feel lost in a system filled with scattered information and uncertainty.
              </p>
              <p className="mb-4 font-semibold text-gray-800">Pratiyogita Setu was built to change that.</p>
              <p className="mb-4">
                We believe that the first step toward success is clear and reliable guidance.
                Our platform helps aspirants understand their real eligibility, plan their preparation with structure,
                and move forward with confidence instead of confusion.
              </p>
              <p className="mb-4">
                Through intelligent analysis, structured roadmaps, and trustworthy learning support,
                we aim to make sure that no genuine effort goes in the wrong direction
                and every student gets a fair chance to reach their goal.
              </p>
              <p className="mb-0">
                This is not just a project for us—
                it is a commitment to support students in one of the most important journeys of their lives.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-center text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                Meet the Team
              </h2>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="p-6 flex flex-col items-center text-center bg-white rounded-xl border shadow-sm">
                    <div className="w-[200px] h-[250px] bg-gray-300 rounded-[20px] overflow-hidden flex items-center justify-center">
                      <img
                        src={member.image}
                        alt={member.role}
                        className="w-full h-full object-cover rounded-[20px]"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/200';
                        }}
                      />
                    </div>

                    <h3 className="text-blue-700 text-xs sm:text-sm font-bold leading-5 mt-3 uppercase tracking-wide">
                      {member.role}
                    </h3>
                    <p className="text-gray-700 text-base sm:text-lg font-semibold mt-1">
                      {member.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
