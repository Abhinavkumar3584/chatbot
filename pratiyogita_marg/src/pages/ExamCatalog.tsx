
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllMindMaps, syncMindMapsFromFirebaseToLocal } from '@/utils/mindmapStorage';
import { EXAM_CATEGORIES, ExamCategory } from '@/components/mindmap/types';
import { seedSscCglRoadmap, sscCglRoadmapReactFlow } from '@/data/roadmaps/sscCglRoadmap';
import { useAuth } from '@/contexts/AuthContext';

interface MindMapItem {
  name: string;
  examCategory?: ExamCategory;
  subExamName?: string;
  createdAt?: string;
}

const DEFAULT_AVAILABLE_MINDMAPS: MindMapItem[] = [
  {
    name: sscCglRoadmapReactFlow.name,
    examCategory: 'SSC EXAMS',
    subExamName: 'SSC CGL'
  }
];

const SUB_EXAMS: Record<string, string[]> = {
  'SSC EXAMS': ['SSC GD Constable', 'SSC CGL', 'SSC CHSL', 'SSC CPO', 'SSC MTS', 'Delhi Police Constable', 'SSC Stenographer', 'SSC JE CE', 'SSC JE EE'],
  'BANKING EXAMS': ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B', 'RBI Assistant', 'IBPS RRB', 'NABARD'],
  'CIVIL SERVICES EXAMS': ['UPSC CSE', 'UPSC CDS', 'UPSC NDA', 'UPSC CAPF', 'State PSC', 'IAS', 'IPS', 'IFS'],
  'RAILWAY EXAMS': ['RRB NTPC', 'RRB Group D', 'RRB ALP', 'RRB JE', 'RPF Constable', 'RPF SI'],
  'DEFENCE EXAMS': ['NDA', 'CDS', 'AFCAT', 'Indian Navy', 'Indian Army', 'Coast Guard', 'Territorial Army'],
  'INSURANCES EXAMS': ['LIC AAO', 'LIC ADO', 'NIACL AO', 'UIIC AO', 'GIC', 'ESIC'],
  'NURSING EXAMS': ['AIIMS Nursing', 'JIPMER Nursing', 'PGIMER Nursing', 'RUHS Nursing', 'RPSC Nursing'],
  'PG EXAMS': ['GATE', 'NET', 'CSIR NET', 'UGC NET', 'JEST', 'TIFR'],
  'CAMPUS PLACEMENT EXAMS': ['TCS NQT', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini'],
  'MBA EXAMS': ['CAT', 'XAT', 'MAT', 'CMAT', 'SNAP', 'NMAT', 'IIFT', 'TISSNET'],
  'ACCOUNTING AND COMMERCE EXAMS': ['CA Foundation', 'CA Intermediate', 'CA Final', 'CS Executive', 'CMA Foundation'],
  'JUDICIARY EXAMS': ['Judicial Services', 'APO', 'Civil Judge', 'District Judge', 'High Court'],
  'REGULATORY BODY EXAMS': ['SEBI Grade A', 'RBI Grade B', 'NABARD Grade A', 'SIDBI', 'IRDAI'],
  'CUET AND UG ENTRANCE EXAMS': ['CUET', 'JEE Main', 'JEE Advanced', 'NEET UG', 'BITSAT', 'VITEEE'],
  'POLICE EXAMS': ['SSC CPO', 'Delhi Police', 'State Police SI', 'CRPF', 'BSF', 'CISF'],
  'OTHER GOVT. EXAMS': ['DRDO', 'ISRO', 'BARC', 'HAL', 'BEL', 'ONGC'],
  'SCHOOL EXAMS': ['CBSE Class 10', 'CBSE Class 12', 'ICSE', 'State Board', 'JNV', 'KVS'],
  'TEACHING EXAMS': ['CTET', 'TET', 'DSSSB TGT', 'DSSSB PGT', 'KVS TGT', 'KVS PGT', 'NVS TGT'],
  'ENGINEERING RECRUITING EXAMS': ['GATE', 'ESE', 'ISRO', 'DRDO', 'BARC', 'BSNL JE'],
  'LABOUR EXAMS': ['EPFO', 'ESIC', 'Labour Inspector', 'Factory Inspector']
};

const ExamCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>(EXAM_CATEGORIES[0]);
  const [mindMaps, setMindMaps] = useState<MindMapItem[]>([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const refreshMindMapsFromLocal = () => {
    const savedMaps = getAllMindMaps();
    let allMindmaps: Record<string, any> = {};
    try {
      const raw = localStorage.getItem('mindmaps');
      if (raw) allMindmaps = JSON.parse(raw);
    } catch (error) {
      console.error('Error parsing mindmaps storage:', error);
    }
    const mapData: MindMapItem[] = savedMaps.map(name => {
      const entry = allMindmaps[name];
      if (entry) {
        return {
          name,
          examCategory: entry.examCategory,
          subExamName: entry.subExamName,
          createdAt: entry.createdAt || new Date().toISOString()
        };
      }
      return { name };
    });
    setMindMaps(mapData);
  };

  useEffect(() => {
    const loadMindMaps = async () => {
      await syncMindMapsFromFirebaseToLocal();
      refreshMindMapsFromLocal();
    };
    void loadMindMaps();
  }, []);

  const handleOpenGeneratedSscRoadmap = () => {
    seedSscCglRoadmap();
    refreshMindMapsFromLocal();
    navigate(`/view?map=${encodeURIComponent(sscCglRoadmapReactFlow.name)}`);
  };

  const predefinedExams = SUB_EXAMS[selectedCategory] || [];

  const savedMapsForCategory = mindMaps.filter(
    (mapItem) => mapItem.examCategory === selectedCategory
  );

  const defaultMapsForCategory = DEFAULT_AVAILABLE_MINDMAPS.filter(
    (mapItem) => mapItem.examCategory === selectedCategory
  );

  const mergedMapsForCategory = [
    ...savedMapsForCategory,
    ...defaultMapsForCategory.filter((defaultMap) =>
      !savedMapsForCategory.some((savedMap) =>
        (savedMap.subExamName || savedMap.name).toLowerCase() ===
        (defaultMap.subExamName || defaultMap.name).toLowerCase()
      )
    )
  ];

  const availableMindMaps = mergedMapsForCategory.filter((mapItem) => {
    const examLabel = mapItem.subExamName || mapItem.name;
    if (!searchTerm) return true;
    return examLabel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const availableExamNames = new Set(
    mergedMapsForCategory.map((mapItem) => mapItem.subExamName || mapItem.name)
  );

  const comingSoonExams = predefinedExams.filter((exam) => {
    const matchesSearch = !searchTerm || exam.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && !availableExamNames.has(exam);
  });

  const handleExamClick = (examName: string) => {
    const savedMap = mindMaps.find(m =>
      m.subExamName === examName || m.name === examName
    );
    if (savedMap) {
      navigate(`/view?map=${encodeURIComponent(savedMap.name)}`);
    } else {
      if (examName === 'SSC CGL') {
        handleOpenGeneratedSscRoadmap();
        return;
      }
      navigate('/view');
    }
  };

  const filteredCategories = EXAM_CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (SUB_EXAMS[cat] || []).some(exam =>
      exam.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-20 sm:h-24" />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 2xl:px-8 pb-8">
        {/* Title Row */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-white">
            Explore Exams
          </h1>
          {currentUser && (
            <Link to="/editor">
              <button className="inline-flex items-center gap-2 text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Mind Map</span>
                <span className="sm:hidden">Create Map</span>
              </button>
            </Link>
          )}
        </div>

        {/* Search Bar - pure HTML, no shadcn */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-lg px-3 pr-10 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-orange-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.4)' }}
          />
        </div>

        {/* Two Panel Layout */}
        <div
          className="flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden min-h-[600px] 2xl:min-h-[680px] backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.4)' }}
        >
          {/* Left Panel - Categories */}
          <div className="w-full md:w-64 lg:w-80 2xl:w-96 overflow-y-auto max-h-[300px] md:max-h-none" style={{ borderRight: '1px solid rgba(249,115,22,0.3)' }}>
            {filteredCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 sm:px-4 2xl:px-5 py-2.5 sm:py-3 2xl:py-3.5 text-sm sm:text-base 2xl:text-[1.05rem] transition-colors ${
                  selectedCategory === category
                    ? 'text-orange-400 font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
                style={{
                  borderLeft: selectedCategory === category ? '4px solid #f97316' : '4px solid transparent',
                  background: selectedCategory === category ? 'rgba(249,115,22,0.1)' : 'transparent',
                }}
              >
                {category.split(' ').map((word, i) =>
                  i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.toLowerCase()
                ).join(' ')}
              </button>
            ))}
          </div>

          {/* Right Panel - Sub Exams */}
          <div className="flex-1 p-4 sm:p-6 2xl:p-8">
            <h2 className="text-lg sm:text-xl 2xl:text-2xl font-bold text-white mb-4 sm:mb-6">
              {selectedCategory.split(' ').map((word, i) =>
                i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.toLowerCase()
              ).join(' ')}
            </h2>

            {/* Available Mindmaps */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-3">Available Mindmaps</h3>
              {availableMindMaps.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 2xl:gap-5">
                  {availableMindMaps.map((mapItem) => {
                    const examLabel = mapItem.subExamName || mapItem.name;
                    return (
                      <button
                        key={`${mapItem.name}-${examLabel}`}
                        onClick={() => handleExamClick(examLabel)}
                        className="px-3 sm:px-4 2xl:px-5 py-2.5 sm:py-3 2xl:py-3.5 rounded-lg text-left text-xs sm:text-sm 2xl:text-base font-medium transition-all text-green-400 hover:shadow-lg"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
                      >
                        {examLabel}
                        <span className="ml-2 text-xs text-green-500">✓</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/50">No available mindmaps in this category yet.</p>
              )}
            </div>

            {/* Coming Soon */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-3">Coming Soon</h3>
              {comingSoonExams.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 2xl:gap-5">
                  {comingSoonExams.map((exam) => (
                    <div
                      key={exam}
                      className="px-3 sm:px-4 2xl:px-5 py-2.5 sm:py-3 2xl:py-3.5 rounded-lg text-left text-xs sm:text-sm 2xl:text-base font-medium text-amber-400"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      {exam}
                      <span className="ml-2 text-[10px] sm:text-xs font-semibold text-amber-500">COMING SOON</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/50">No upcoming exams found for this filter.</p>
              )}
            </div>

            {availableMindMaps.length === 0 && comingSoonExams.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-white/30" />
                <p className="text-sm sm:text-base">No exams found for this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExamCatalog;
