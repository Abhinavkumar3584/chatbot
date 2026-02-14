import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Map,
  Compass,
  BookOpen,
  Target,
  CheckCircle,
  Sparkles,
  FileText,
  Zap,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  LogIn,
  LogOut,
  Mail,
  Heart,
  UserPlus,
} from 'lucide-react';

// Exam logos for scrolling marquee
const examLogos = [
  'JEE Main', 'NEET', 'GATE', 'UGC NET', 'CAT', 'UPSC', 'SSC CGL', 'IBPS PO',
  'NDA', 'CDS', 'CLAT', 'JEE Advanced', 'AIIMS', 'BITSAT', 'XAT', 'GMAT',
  'GRE', 'TOEFL', 'IELTS', 'CTET', 'MPSC', 'CA Foundation', 'CS Executive',
  'NEET PG', 'JEST', 'CSIR NET', 'JIPMER', 'AILET', 'MAT', 'SNAP'
];

// Features data
const features = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: 'STRUCTURED SYLLABUS 📌',
    description: 'Finding the right syllabus can be time-consuming and confusing. Our roadmap provides a one-stop solution where you can access the entire syllabus for every exam in a well-organized way.',
    highlight: 'No guesswork - start with clarity & confidence!',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600'
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Deep Breakdown of Topics 🔍',
    description: 'Competitive exams cover vast subjects. We break down each topic into bite-sized, easy-to-understand sections with step-by-step approach from basics to advanced concepts.',
    highlight: 'Master subjects with clarity and ease!',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600'
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'Topic Importance 🔥',
    description: 'Topics are labeled as Important, Most Important, and Must-Master based on previous exam trends and weightage. Focus on high-scoring areas first!',
    highlight: 'Maximize your marks by prioritizing the right topics!',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600'
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: 'Progress Tracker 📅',
    description: 'Mark each topic as completed, giving you a clear view of your progress. Visual completion bar shows how far you\'ve come and what\'s left.',
    highlight: 'Your journey to success is now trackable!',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600'
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Free & Premium Resources 📚',
    description: 'Access to free and premium resources including notes, PDFs, video lectures, and question banks curated by top educators and subject experts.',
    highlight: 'Smart resources = Faster preparation = Better results!',
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Quick Topic Summaries 🚀',
    description: 'Short, crisp topic summaries for quick revision. Important points highlighted so you instantly know what matters most.',
    highlight: 'Boost your memory, revise faster, and ace your exams!',
    color: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600'
  }
];

// FAQ data
const faqs = [
  {
    question: 'What is ParikshaMarg?',
    answer: 'ParikshaMarg is a comprehensive platform designed to help competitive exam aspirants with structured syllabus roadmaps, study materials, and progress tracking tools.'
  },
  {
    question: 'How does the syllabus roadmap work?',
    answer: 'Our roadmap visually maps out subjects and topics, showing you exactly what to study, in what order, and how important each topic is based on previous exam patterns.'
  },
  {
    question: 'Which exams does ParikshaMarg support?',
    answer: 'We support 50+ competitive exams including SSC, Banking, UPSC, Railway, Defence, Teaching, Engineering, Medical entrance exams and more.'
  },
  {
    question: 'Can I customize my syllabus roadmap?',
    answer: 'Yes! You can create your own mind maps and customize the roadmap according to your preparation strategy and timeline.'
  },
  {
    question: 'Does ParikshaMarg provide study materials?',
    answer: 'Yes, we provide both free and premium study resources including notes, PDFs, video lectures, and practice questions.'
  },
  {
    question: 'Is there a progress tracker available?',
    answer: 'Absolutely! Our built-in progress tracker lets you mark topics as completed and visualize your overall preparation progress.'
  },
  {
    question: 'Is ParikshaMarg free to use?',
    answer: 'Basic features including roadmaps and progress tracking are free. Premium features and study materials are available through subscription.'
  },
  {
    question: 'How is it different from other syllabus platforms?',
    answer: 'We provide visual mind map-based learning, topic importance indicators, integrated progress tracking, and resources all in one place - making preparation structured and efficient.'
  }
];

// Services data
const services = [
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Eligibility Calculator',
    description: 'Exam eligibility and attempts calculator providing personalized insights based on age, education, and criteria.'
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: 'Expert Roadmaps',
    description: 'Guided path to competitive exam success with Subject-Expert roadmaps, best practices, and study materials.'
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'AI Chatbot',
    description: 'AI-powered chatbot with all necessary books, references, and explanations for competitive exam preparation.'
  }
];

const LandingPage = () => {
  const { currentUser, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const yogyaUrl = import.meta.env.VITE_PRATIYOGITA_YOGYA_URL || 'https://parikshayogya.vercel.app';
  const gyanUrl = import.meta.env.VITE_PRATIYOGITA_GYAN_URL || 'https://www.pratiyogitagyan.com';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    if (auth === 'login' || auth === 'signup') {
      setAuthMode(auth);
      setShowAuthModal(true);
      params.delete('auth');
      const next = params.toString();
      const nextUrl = `${window.location.pathname}${next ? `?${next}` : ''}`;
      window.history.replaceState({}, '', nextUrl);
    }
  }, []);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-base">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Map className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl 2xl:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ParikshaMarg
              </span>
            </div>
            <nav className="flex items-center gap-3">
              <a href={yogyaUrl} target="_self" rel="noreferrer">
                <Button variant="outline" className="gap-2 text-base 2xl:text-lg px-5 2xl:px-6 py-2">
                  Pratiyogita Yogya
                </Button>
              </a>
              <a href={gyanUrl} target="_self" rel="noreferrer">
                <Button variant="outline" className="gap-2 text-base 2xl:text-lg px-5 2xl:px-6 py-2">
                  Pratiyogita Gyan
                </Button>
              </a>

              {!currentUser ? (
                <>
                  <Button
                    variant="outline"
                    className="gap-2 text-base 2xl:text-lg px-5 2xl:px-6 py-2"
                    onClick={() => handleAuthClick('login')}
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 text-base 2xl:text-lg px-5 2xl:px-6 py-2"
                    onClick={() => handleAuthClick('signup')}
                  >
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center px-3 py-2 rounded-lg border bg-white text-sm font-medium text-gray-700">
                    {currentUser.displayName || currentUser.email}
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2 text-base 2xl:text-lg px-5 2xl:px-6 py-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto text-center">
          <h1 className="text-5xl md:text-6xl 2xl:text-7xl font-bold mb-6">
            Helping{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              STUDENTS
            </span>
            <br />
            to get their dream job
          </h1>
          <p className="text-2xl 2xl:text-[1.75rem] text-gray-600 mb-8 max-w-2xl 2xl:max-w-3xl mx-auto">
            Your complete roadmap to competitive exam success with structured syllabus, 
            progress tracking, and expert guidance.
          </p>
          <div className="flex justify-center gap-4 mb-12">
            {currentUser ? (
              <a href="/editor" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  <Map className="h-5 w-5" />
                  Make Mind Map
                </Button>
              </a>
            ) : null}
            <Link to="/explore">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">
                <Compass className="h-5 w-5" />
                Explore
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 2xl:p-7 shadow-sm border">
              <div className="text-3xl 2xl:text-4xl font-bold text-blue-600">Weekly</div>
              <div className="text-lg 2xl:text-xl text-gray-600">New Exams</div>
            </div>
            <div className="bg-white rounded-xl p-6 2xl:p-7 shadow-sm border">
              <div className="text-3xl 2xl:text-4xl font-bold text-purple-600">50+</div>
              <div className="text-lg 2xl:text-xl text-gray-600">Exam Roadmaps</div>
            </div>
            <div className="bg-white rounded-xl p-6 2xl:p-7 shadow-sm border">
              <div className="text-3xl 2xl:text-4xl font-bold text-green-600">Latest</div>
              <div className="text-lg 2xl:text-xl text-gray-600">Syllabus Updates</div>
            </div>
            <div className="bg-white rounded-xl p-6 2xl:p-7 shadow-sm border">
              <div className="text-3xl 2xl:text-4xl font-bold text-orange-600">Experts</div>
              <div className="text-lg 2xl:text-xl text-gray-600">Toppers & Teachers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Exams - Marquee */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">SUPPORTED EXAMS</h2>
        </div>
        <div className="relative">
          {/* First row - scrolling left */}
          <div className="flex animate-marquee whitespace-nowrap mb-4">
            {[...examLogos, ...examLogos].map((exam, index) => (
              <div
                key={`row1-${index}`}
                className="mx-3 px-6 2xl:px-7 py-3 2xl:py-3.5 bg-white rounded-full border shadow-sm text-base 2xl:text-lg font-medium text-gray-700 hover:shadow-md transition-shadow"
              >
                {exam}
              </div>
            ))}
          </div>
          {/* Second row - scrolling right */}
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            {[...examLogos.slice().reverse(), ...examLogos.slice().reverse()].map((exam, index) => (
              <div
                key={`row2-${index}`}
                className="mx-3 px-6 2xl:px-7 py-3 2xl:py-3.5 bg-white rounded-full border shadow-sm text-base 2xl:text-lg font-medium text-gray-700 hover:shadow-md transition-shadow"
              >
                {exam}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-lg font-semibold text-blue-600 uppercase tracking-wide mb-2">FEATURES</h2>
            <h3 className="text-4xl 2xl:text-5xl font-bold text-gray-900">
              Start Your Exam Journey with the Best Roadmap!
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6 2xl:p-7">
                  <div className={`${feature.iconColor} mb-4`}>{feature.icon}</div>
                  <h4 className="text-xl 2xl:text-2xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-base 2xl:text-lg text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-base 2xl:text-lg font-semibold">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600">{feature.highlight}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our platform</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left font-medium text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-12 p-8 bg-white rounded-xl border">
            <p className="text-xl font-medium mb-4">Still have questions?</p>
            <p className="text-lg text-gray-600 mb-6">We're here to help you</p>
            <Button variant="outline" className="gap-2 text-base">
              <Mail className="h-5 w-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-base">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ParikshaMarg</span>
              </div>
              <p className="text-base text-gray-400 mb-4">
                One-stop platform for competitive exam aspirants, offering personalized exam eligibility calculator, 
                AI-powered chatbot, and structured roadmap with best practices and study resources.
              </p>
              <div className="text-base text-gray-400">
                <Mail className="h-5 w-5 inline mr-2" />
                askparikshasetu@gmail.com
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contribution</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-base">
            <p className="mb-2">
              Made with <Heart className="h-5 w-5 inline text-red-500" /> for Aspirants
            </p>
            <p>© 2026 | Privacy Policy | Terms & Conditions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
