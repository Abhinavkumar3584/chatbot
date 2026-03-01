
import { BaseNodeData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { WORKSPACE_HEIGHT, WORKSPACE_WIDTH, WORKSPACE_X, WORKSPACE_Y } from './WorkspaceBoundary';

export const addNode = (
  setNodes: React.Dispatch<React.SetStateAction<any[]>>,
  nodes: any[],
  type: BaseNodeData['nodeType'], 
  additionalData: Partial<BaseNodeData> = {}
) => {
  if (!type) return;
  
  const nodeId = uuidv4();
  const newNode = {
    id: nodeId,
    type: getNodeType(type),
    data: { 
      id: nodeId,
      label: additionalData.label || getDefaultLabel(type),
      nodeType: type,
      backgroundColor: additionalData.backgroundColor || 'white',
      strokeColor: additionalData.strokeColor || 'black',
      strokeWidth: additionalData.strokeWidth || 1,
      strokeStyle: additionalData.strokeStyle || 'solid',
      fontSize: additionalData.fontSize || 'xs',
      textAlign: additionalData.textAlign || 'center',
      opacity: additionalData.opacity || 1,
      hasCheckbox: additionalData.hasCheckbox || false,
      isChecked: additionalData.isChecked || false,
      ...getTypeSpecificData(type),
      ...additionalData
    },
    position: additionalData.position || {
      x: WORKSPACE_X + WORKSPACE_WIDTH / 2 - 120,
      y: WORKSPACE_Y + WORKSPACE_HEIGHT / 2 - 120,
    },
  };

  setNodes((nds) => [...nds, newNode]);
};

// Helper function to determine the correct node type component
const getNodeType = (nodeType: string): string => {
  switch (nodeType) {
    case 'section':
      return 'section';
    case 'checklist':
      return 'checklist';
    case 'resource':
      return 'resource';
    case 'circle':
      return 'circle';
    case 'rectangle':
      return 'rectangle';
    case 'square':
      return 'square';
    case 'triangle':
      return 'triangle';
    case 'note':
      return 'note';
    case 'concept':
      return 'concept';
    default:
      return 'base';
  }
};

// Helper function to get a default label based on node type
const getDefaultLabel = (nodeType: string): string => {
  switch (nodeType) {
    case 'title':
      return 'Title';
    case 'topic':
      return 'Topic';
    case 'subtopic':
      return 'Sub Topic';
    case 'paragraph':
      return 'Paragraph';
    case 'section':
      return 'Section';
    case 'checklist':
      return 'Study Checklist';
    case 'resource':
      return 'Study Resources';
    case 'circle':
      return 'Circle';
    case 'rectangle':
      return 'Rectangle';
    case 'square':
      return 'Square';
    case 'triangle':
      return 'Triangle';
    case 'note':
      return 'Quick Note';
    case 'concept':
      return 'Key Concept';
    default:
      return nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
  }
};

// Helper function to get type-specific default data
const getTypeSpecificData = (nodeType: string): Partial<BaseNodeData> => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  switch (nodeType) {
    case 'title':
      return {
        width: 180,
        height: 90,
      };
    case 'topic':
      return {
        width: 160,
        height: 70,
      };
    case 'subtopic':
      return {
        width: 150,
        height: 60,
      };
    case 'paragraph':
      return {
        width: 200,
        height: 80,
      };
    case 'rectangle':
      return {
        width: 180,
        height: 90,
      };
    case 'section':
      return {
        width: 300,
        height: 200,
      };
    case 'checklist':
      return {
        checklistItems: [
          { id: '1', text: 'Read chapter 1', isChecked: false, priority: 'high' },
          { id: '2', text: 'Complete practice problems', isChecked: false, priority: 'medium' },
          { id: '3', text: 'Review notes', isChecked: false, priority: 'low' }
        ]
      };
    case 'resource':
      return {
        resources: [
          { id: '1', title: 'Course Textbook', url: 'https://example.com/textbook', type: 'pdf', rating: 5, tags: ['essential', 'reference'] },
          { id: '2', title: 'Tutorial Video', url: 'https://example.com/video', type: 'video', rating: 4, tags: ['helpful'] }
        ]
      };
    case 'note':
      return {
        noteContent: 'Double-click to add your notes here...',
        noteColor: '#FFFACD',
        pinned: false,
        tags: ['note']
      };
    case 'concept':
      return {
        definition: 'Define this key concept...',
        examples: ['Example 1'],
        importance: 'medium',
        backgroundColor: '#E6F0FF'
      };
    default:
      return {};
  }
};
