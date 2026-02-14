
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Map, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllMindMaps } from '@/utils/mindmapStorage';
import { EXAM_CATEGORIES, ExamCategory } from '@/components/mindmap/types';

interface MindMapItem {
  name: string;
  examCategory?: ExamCategory;
  subExamName?: string;
  createdAt?: string;
}

// Sample sub-exams for each category (you can expand this)
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

  useEffect(() => {
    const loadMindMaps = () => {
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

    loadMindMaps();
  }, []);

  // Get sub-exams for selected category (combine predefined + saved mindmaps)
  const getSubExams = () => {
    const predefined = SUB_EXAMS[selectedCategory] || [];
    const savedForCategory = mindMaps
      .filter(m => m.examCategory === selectedCategory)
      .map(m => m.subExamName || m.name);
    
    // Combine and deduplicate
    const combined = [...new Set([...predefined, ...savedForCategory])];
    
    // Filter by search term
    if (searchTerm) {
      return combined.filter(exam => 
        exam.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return combined;
  };

  const handleExamClick = (examName: string) => {
    // Check if there's a saved mindmap for this exam
    const savedMap = mindMaps.find(m => 
      m.subExamName === examName || m.name === examName
    );
    
    if (savedMap) {
      navigate(`/view?map=${encodeURIComponent(savedMap.name)}`);
    } else {
      // Navigate to editor to create new mindmap for this exam
      navigate(`/editor?exam=${encodeURIComponent(examName)}&category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  const filteredCategories = EXAM_CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (SUB_EXAMS[cat] || []).some(exam => 
      exam.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Map className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">ParikshaMarg</span>
              </div>
            </div>
            <Link to="/editor">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <BookOpen className="h-4 w-4" />
                Create New Map
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Exams</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 bg-white border-gray-300"
          />
        </div>

        {/* Two Panel Layout */}
        <div className="flex gap-6 bg-white rounded-lg border min-h-[600px]">
          {/* Left Panel - Categories */}
          <div className="w-80 border-r overflow-y-auto">
            {filteredCategories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-3 border-l-4 transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-50 border-l-blue-600 text-blue-700 font-medium'
                    : 'border-l-transparent hover:bg-gray-50 text-gray-700'
                }`}
              >
                {category.split(' ').map((word, i) => 
                  i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.toLowerCase()
                ).join(' ')}
              </button>
            ))}
          </div>

          {/* Right Panel - Sub Exams */}
          <div className="flex-1 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {selectedCategory.split(' ').map((word, i) => 
                i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.toLowerCase()
              ).join(' ')}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getSubExams().map((exam) => {
                const hasSavedMap = mindMaps.some(m => 
                  m.subExamName === exam || m.name === exam
                );
                
                return (
                  <button
                    key={exam}
                    onClick={() => handleExamClick(exam)}
                    className={`px-4 py-3 border rounded-lg text-left text-sm font-medium transition-all hover:shadow-md ${
                      hasSavedMap
                        ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {exam}
                    {hasSavedMap && (
                      <span className="ml-2 text-xs text-green-600">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {getSubExams().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No exams found for this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCatalog;
