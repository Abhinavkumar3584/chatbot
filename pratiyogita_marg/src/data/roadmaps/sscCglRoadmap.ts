import { MindMapData } from '@/components/mindmap/types';
import { saveMindMap } from '@/utils/mindmapStorage';

const link = (label: string, url: string) => ({ label, url });

export const sscCglRoadmapReactFlow: MindMapData = {
  name: 'SSC CGL Roadmap (Structured v1)',
  examCategory: 'SSC EXAMS',
  subExamName: 'SSC CGL',
  headerData: {
    title: 'SSC CGL Preparation Roadmap',
    description:
      'Tier I + Tier II roadmap with priority, difficulty, estimated time, learning order, and resources.',
    subDetails:
      'Tags: VVI/VI/Important/Low | Status-ready structure for Not Started/In Progress/Completed.',
  },
  nodes: [
    {
      id: 'root-ssc-cgl',
      type: 'base',
      position: { x: 640, y: 80 },
      data: {
        id: 'root-ssc-cgl',
        label: 'SSC CGL Roadmap',
        nodeType: 'title',
        fontSize: '2xl',
        width: 320,
        height: 75,
        backgroundColor: '#E5DEFF',
        content: {
          title: 'SSC CGL Master Plan',
          description: 'Quant, Reasoning, English, GA, Computer + Execution toolkit.',
          links: [link('Official SSC', 'https://ssc.nic.in/')],
        },
      },
    },

    {
      id: 'sub-quant',
      type: 'base',
      position: { x: 80, y: 280 },
      data: {
        id: 'sub-quant',
        label: 'Quantitative Aptitude',
        nodeType: 'topic',
        fontSize: 'xl',
        backgroundColor: '#FEF7CD',
        priorityTag: 'VVI',
        estimatedHours: 58,
        difficulty: 'medium',
        learningOrder: 1,
        width: 250,
        height: 65,
        completionStatus: 'NOT_STARTED',
      },
    },
    {
      id: 'quant-arithmetic',
      type: 'base',
      position: { x: 50, y: 500 },
      data: {
        id: 'quant-arithmetic',
        label: 'Arithmetic Core',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 190,
        height: 56,
        priorityTag: 'VVI',
        estimatedHours: 24,
        weightage: 0.35,
        difficulty: 'medium',
      },
    },
    {
      id: 'quant-advanced',
      type: 'base',
      position: { x: 300, y: 500 },
      data: {
        id: 'quant-advanced',
        label: 'Geometry + Trigonometry',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 220,
        height: 56,
        priorityTag: 'VI',
        estimatedHours: 22,
        difficulty: 'hard',
      },
    },
    {
      id: 'quant-unit-percentage',
      type: 'base',
      position: { x: 40, y: 700 },
      data: {
        id: 'quant-unit-percentage',
        label: 'Percentage',
        nodeType: 'subtopic',
        fontSize: 'md',
        width: 150,
        height: 50,
        priorityTag: 'VVI',
        estimatedHours: 4,
        difficulty: 'easy',
        content: {
          title: 'Percentage Mastery',
          description: 'Direct %, increase/decrease, successive change. Solve 150 mixed questions.',
          links: [
            link('Free: Percentage', 'https://www.youtube.com/results?search_query=ssc+cgl+percentage+class'),
            link('Premium: Testbook Quant', 'https://testbook.com/'),
          ],
        },
      },
    },
    {
      id: 'quant-unit-tsd',
      type: 'base',
      position: { x: 250, y: 700 },
      data: {
        id: 'quant-unit-tsd',
        label: 'Time-Speed-Distance',
        nodeType: 'subtopic',
        fontSize: 'md',
        width: 180,
        height: 50,
        priorityTag: 'VVI',
        estimatedHours: 5,
        difficulty: 'medium',
        content: {
          title: 'TSD Unit',
          description: 'Trains, boats, relative speed with timed problem sets.',
          links: [
            link('Free: TSD', 'https://www.youtube.com/results?search_query=ssc+cgl+time+speed+distance+trains+boats'),
            link('Premium: Adda247 Quant', 'https://www.adda247.com/'),
          ],
        },
      },
    },

    {
      id: 'sub-reasoning',
      type: 'base',
      position: { x: 420, y: 280 },
      data: {
        id: 'sub-reasoning',
        label: 'Reasoning',
        nodeType: 'topic',
        fontSize: 'xl',
        backgroundColor: '#FEF7CD',
        priorityTag: 'VVI',
        estimatedHours: 28,
        difficulty: 'medium',
        learningOrder: 2,
        width: 200,
        height: 65,
      },
    },
    {
      id: 'reason-unit-series',
      type: 'base',
      position: { x: 380, y: 500 },
      data: {
        id: 'reason-unit-series',
        label: 'Series + Coding',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 180,
        height: 56,
        estimatedHours: 6,
        priorityTag: 'VVI',
        content: {
          title: 'Pattern Recognition',
          description: 'Number/letter/mixed series and coding families.',
          links: [
            link('Free: Series + Coding', 'https://www.youtube.com/results?search_query=ssc+cgl+reasoning+series+coding+decoding'),
            link('Premium: Oliveboard Reasoning', 'https://www.oliveboard.in/'),
          ],
        },
      },
    },
    {
      id: 'reason-unit-seating',
      type: 'base',
      position: { x: 600, y: 500 },
      data: {
        id: 'reason-unit-seating',
        label: 'Seating Arrangement',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 200,
        height: 56,
        estimatedHours: 5,
        priorityTag: 'VVI',
        difficulty: 'hard',
        content: {
          title: 'Arrangement Focus',
          description: 'Linear + circular arrangement with elimination method.',
          links: [
            link('Free: Seating', 'https://www.youtube.com/results?search_query=ssc+cgl+seating+arrangement+reasoning'),
            link('Premium: Adda247 Reasoning', 'https://www.adda247.com/'),
          ],
        },
      },
    },

    {
      id: 'sub-english',
      type: 'base',
      position: { x: 700, y: 280 },
      data: {
        id: 'sub-english',
        label: 'English',
        nodeType: 'topic',
        fontSize: 'xl',
        backgroundColor: '#FEF7CD',
        priorityTag: 'VI',
        estimatedHours: 30,
        difficulty: 'medium',
        learningOrder: 3,
        width: 180,
        height: 65,
      },
    },
    {
      id: 'eng-unit-grammar',
      type: 'base',
      position: { x: 680, y: 500 },
      data: {
        id: 'eng-unit-grammar',
        label: 'Grammar Core',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 170,
        height: 56,
        priorityTag: 'VVI',
        estimatedHours: 10,
        content: {
          title: 'Grammar Accuracy',
          description: 'SVA, tense, error spotting with rule-wise revision.',
          links: [
            link('Free: Grammar', 'https://www.youtube.com/results?search_query=ssc+cgl+english+grammar+error+spotting'),
            link('Premium: Testbook English', 'https://testbook.com/'),
          ],
        },
      },
    },
    {
      id: 'eng-unit-rc',
      type: 'base',
      position: { x: 890, y: 500 },
      data: {
        id: 'eng-unit-rc',
        label: 'RC + Cloze',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 160,
        height: 56,
        priorityTag: 'VVI',
        estimatedHours: 12,
        difficulty: 'hard',
        content: {
          title: 'RC Strategy',
          description: 'Comprehension speed, inference, timed passages.',
          links: [
            link('Free: RC Strategy', 'https://www.youtube.com/results?search_query=ssc+cgl+reading+comprehension+strategy'),
            link('Premium: Oliveboard English', 'https://www.oliveboard.in/'),
          ],
        },
      },
    },

    {
      id: 'sub-ga',
      type: 'base',
      position: { x: 960, y: 280 },
      data: {
        id: 'sub-ga',
        label: 'General Awareness',
        nodeType: 'topic',
        fontSize: 'xl',
        backgroundColor: '#FEF7CD',
        priorityTag: 'VVI',
        estimatedHours: 48,
        difficulty: 'medium',
        learningOrder: 4,
        width: 240,
        height: 65,
      },
    },
    {
      id: 'ga-unit-static',
      type: 'base',
      position: { x: 920, y: 500 },
      data: {
        id: 'ga-unit-static',
        label: 'Static GK',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 150,
        height: 56,
        priorityTag: 'VI',
        estimatedHours: 20,
        content: {
          title: 'Static GK Block',
          description: 'History, polity, science with retention cycles.',
          links: [
            link('Free: Static GK', 'https://www.youtube.com/results?search_query=ssc+cgl+static+gk+history+polity+science'),
            link('Premium: Adda247 GK', 'https://www.adda247.com/'),
          ],
        },
      },
    },
    {
      id: 'ga-unit-current',
      type: 'base',
      position: { x: 1140, y: 500 },
      data: {
        id: 'ga-unit-current',
        label: 'Current Affairs (6-8m)',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 200,
        height: 56,
        priorityTag: 'VVI',
        estimatedHours: 18,
        content: {
          title: 'Current Affairs',
          description: 'Monthly revision notes + weekly quizzes.',
          links: [
            link('Free: Current Affairs', 'https://www.youtube.com/results?search_query=ssc+cgl+current+affairs+monthly+revision'),
            link('Premium: AffairsCloud CA', 'https://www.affairscloud.com/'),
          ],
        },
      },
    },

    {
      id: 'sub-computer',
      type: 'base',
      position: { x: 1280, y: 280 },
      data: {
        id: 'sub-computer',
        label: 'Computer (Tier II)',
        nodeType: 'topic',
        fontSize: 'xl',
        backgroundColor: '#FEF7CD',
        priorityTag: 'Important',
        estimatedHours: 10,
        difficulty: 'easy',
        learningOrder: 5,
        width: 220,
        height: 65,
      },
    },
    {
      id: 'comp-unit-ms-office',
      type: 'base',
      position: { x: 1280, y: 500 },
      data: {
        id: 'comp-unit-ms-office',
        label: 'MS Office + Internet',
        nodeType: 'subtopic',
        fontSize: 'lg',
        width: 200,
        height: 56,
        priorityTag: 'VI',
        estimatedHours: 5,
        difficulty: 'easy',
        content: {
          title: 'Computer Basics',
          description: 'Office shortcuts, internet basics, networking/security fundamentals.',
          links: [
            link('Free: Computer Basics', 'https://www.youtube.com/results?search_query=ssc+cgl+computer+ms+office+questions'),
            link('Premium: Testbook Computer', 'https://testbook.com/'),
          ],
        },
      },
    },

    {
      id: 'sub-tests',
      type: 'checklist',
      position: { x: 600, y: 900 },
      data: {
        id: 'sub-tests',
        label: 'Test + Revision Loop',
        nodeType: 'checklist',
        priorityTag: 'VVI',
        estimatedHours: 36,
        difficulty: 'medium',
        learningOrder: 6,
        completionStatus: 'NOT_STARTED',
        checklistItems: [
          { id: 'wk-1', text: 'Weekly sectional tests (Q/R/E/GA)', isChecked: false, priority: 'high' },
          { id: 'wk-2', text: '2 full mocks/week after 40% syllabus', isChecked: false, priority: 'high' },
          { id: 'wk-3', text: 'Error log revision every Sunday', isChecked: false, priority: 'high' },
        ],
        content: {
          title: 'Execution Discipline',
          description: 'Coverage quality depends on weekly tests + error correction.',
        },
      },
    },
    {
      id: 'tool-note',
      type: 'note',
      position: { x: 120, y: 1120 },
      data: {
        id: 'tool-note',
        label: 'Weekly Strategy Note',
        nodeType: 'note',
        noteColor: '#FFFACD',
        noteContent: 'Mon-Thu concepts, Fri PYQs, Sat mock, Sun error-log + weak-topic revision.',
        tags: ['discipline', 'revision'],
        pinned: true,
      },
    },
    {
      id: 'tool-timeline',
      type: 'timeline',
      position: { x: 420, y: 1120 },
      data: {
        id: 'tool-timeline',
        label: '12-Week Timeline',
        nodeType: 'timeline',
        timelineEvents: [
          { id: 't1', title: 'Foundation', date: '2026-02-16', description: 'Core concepts', isMilestone: true, isCompleted: false },
          { id: 't2', title: 'Mixed Practice', date: '2026-03-20', description: 'Sectional speed + accuracy', isMilestone: true, isCompleted: false },
          { id: 't3', title: 'Mock Intensive', date: '2026-04-18', description: '2 full mocks/week', isMilestone: true, isCompleted: false },
        ],
      },
    },
    {
      id: 'tool-concept',
      type: 'concept',
      position: { x: 740, y: 1120 },
      data: {
        id: 'tool-concept',
        label: 'High Yield Rule',
        nodeType: 'concept',
        importance: 'high',
        definition: 'Spend 70% effort on VVI + VI topics until mock score stabilizes above target cut-off.',
        examples: ['Quant: Arithmetic first', 'GA: Daily CA + weekly static block'],
      },
    },
    {
      id: 'tool-resource',
      type: 'resource',
      position: { x: 1040, y: 1120 },
      data: {
        id: 'tool-resource',
        label: 'Resource Stack',
        nodeType: 'resource',
        resources: [
          { id: 'r1', title: 'SSC PYQ Booklet', url: 'https://ssc.nic.in/', type: 'website', rating: 5, tags: ['must'] },
          { id: 'r2', title: 'Quant Practice Set', url: 'https://testbook.com/', type: 'website', rating: 4, tags: ['practice'] },
          { id: 'r3', title: 'Weekly CA Capsule', url: 'https://www.affairscloud.com/', type: 'website', rating: 4, tags: ['GA'] },
        ],
      },
    },
    {
      id: 'tool-flashcard',
      type: 'flashcard',
      position: { x: 1340, y: 1120 },
      data: {
        id: 'tool-flashcard',
        label: 'Flashcard Drill',
        nodeType: 'flashcard',
        flashcards: [
          { id: 'f1', question: 'Best first priority in Quant?', answer: 'Arithmetic + % + Ratio + TSD', difficulty: 'easy' },
          { id: 'f2', question: 'How often to attempt full mocks?', answer: 'At least twice weekly after ~40% coverage', difficulty: 'medium' },
        ],
      },
    },
    {
      id: 'tool-quiz',
      type: 'quiz',
      position: { x: 700, y: 1340 },
      data: {
        id: 'tool-quiz',
        label: 'Quick Self Quiz',
        nodeType: 'quiz',
        questions: [
          {
            id: 'q1',
            text: 'What should be done every Sunday?',
            options: [
              { id: 'a', text: 'Skip study', isCorrect: false },
              { id: 'b', text: 'Error-log revision', isCorrect: true },
              { id: 'c', text: 'Only read new topics', isCorrect: false },
            ],
            explanation: 'Weekly review consolidates gains and fixes recurring mistakes.',
            difficulty: 'easy',
          },
        ],
      },
    },
  ],
  edges: [
    { id: 'e-root-quant', source: 'root-ssc-cgl', target: 'sub-quant', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-root-reasoning', source: 'root-ssc-cgl', target: 'sub-reasoning', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-root-english', source: 'root-ssc-cgl', target: 'sub-english', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-root-ga', source: 'root-ssc-cgl', target: 'sub-ga', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-root-computer', source: 'root-ssc-cgl', target: 'sub-computer', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-root-tests', source: 'root-ssc-cgl', target: 'sub-tests', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep', animated: true },

    { id: 'e-quant-arith', source: 'sub-quant', target: 'quant-arithmetic', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-quant-adv', source: 'sub-quant', target: 'quant-advanced', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-quant-percentage', source: 'quant-arithmetic', target: 'quant-unit-percentage', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-quant-tsd', source: 'quant-arithmetic', target: 'quant-unit-tsd', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },

    { id: 'e-reason-series', source: 'sub-reasoning', target: 'reason-unit-series', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-reason-seating', source: 'sub-reasoning', target: 'reason-unit-seating', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },

    { id: 'e-eng-grammar', source: 'sub-english', target: 'eng-unit-grammar', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-eng-rc', source: 'sub-english', target: 'eng-unit-rc', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },

    { id: 'e-ga-static', source: 'sub-ga', target: 'ga-unit-static', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-ga-current', source: 'sub-ga', target: 'ga-unit-current', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },

    { id: 'e-comp-office', source: 'sub-computer', target: 'comp-unit-ms-office', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },

    { id: 'e-tests-note', source: 'sub-tests', target: 'tool-note', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-tests-timeline', source: 'sub-tests', target: 'tool-timeline', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-tests-concept', source: 'sub-tests', target: 'tool-concept', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-tests-resource', source: 'sub-tests', target: 'tool-resource', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-tests-flashcard', source: 'sub-tests', target: 'tool-flashcard', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep' },
    { id: 'e-tests-quiz', source: 'sub-tests', target: 'tool-quiz', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'smoothstep', animated: true },
  ],
};

/**
 * Call this once after login to seed SSC CGL roadmap.
 * It is saved in local storage and mirrored to Firebase by existing storage utility.
 */
export const seedSscCglRoadmap = (): boolean => {
  return saveMindMap(sscCglRoadmapReactFlow);
};
