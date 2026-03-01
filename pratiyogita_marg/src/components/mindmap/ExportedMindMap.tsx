
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { ReactFlow, NodeTypes, Node, ReactFlowProvider, DefaultEdgeOptions, MarkerType, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { SectionNode } from './node-components/SectionNode';
import { ChecklistNode } from './node-components/ChecklistNode';
import { ResourceNode } from './node-components/ResourceNode';
import { CircleNode } from './node-components/CircleNode';
import { RectangleNode } from './node-components/RectangleNode';
import { SquareNode } from './node-components/SquareNode';
import { TriangleNode } from './node-components/TriangleNode';
import { NoteNode } from './node-components/NoteNode';
import { ConceptNode } from './node-components/ConceptNode';
import { renderMindMap } from '@/utils/mindmapRenderer';
import { useToast } from '@/hooks/use-toast';
import { MindMapData, BaseNodeData } from './types';
import { MindMapHeader, MindMapHeaderData } from './MindMapHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getAllMindMaps, syncMindMapsFromFirebaseToLocal } from '@/utils/mindmapStorage';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WORKSPACE_WIDTH, WORKSPACE_HEIGHT } from './WorkspaceBoundary';

// Node types mapping for the viewer
const nodeTypes: NodeTypes = {
  base: BaseNode,
  section: SectionNode,
  checklist: ChecklistNode,
  resource: ResourceNode,
  circle: CircleNode,
  rectangle: RectangleNode,
  square: SquareNode,
  triangle: TriangleNode,
  note: NoteNode,
  concept: ConceptNode,
  title: BaseNode,
  topic: BaseNode,
  subtopic: BaseNode,
  paragraph: BaseNode,
};

/**
 * ViewModeCanvas — renders the mindmap inside a fixed-width container
 * that matches the workspace boundary width. Only vertical scrolling
 * is allowed (handled by the browser's native scroll). No ReactFlow
 * pan / zoom / drag.
 */
const ViewModeCanvas = ({
  mindMapData,
  nodeTypes,
  onNodeClick,
}: {
  mindMapData: MindMapData | null;
  nodeTypes: NodeTypes;
  onNodeClick: (e: React.MouseEvent, node: any) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Filter out workspace boundary node
  const nodes = useMemo(
    () => (mindMapData?.nodes || []).filter(n => n.id !== '__workspace_boundary__'),
    [mindMapData?.nodes]
  );

  const edges = useMemo(
    () =>
      (mindMapData?.edges || []).map(edge => ({
        ...edge,
        type: edge.type || 'default',
        style: {
          stroke: edge.style?.stroke || edge.data?.strokeColor || '#333',
          strokeWidth: edge.style?.strokeWidth || edge.data?.strokeWidth || 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.style?.stroke || edge.data?.strokeColor || '#333',
          width: 20,
          height: 20,
        },
      })),
    [mindMapData?.edges]
  );

  // Calculate the actual content height from node positions
  const contentHeight = useMemo(() => {
    if (nodes.length === 0) return WORKSPACE_HEIGHT;
    let maxY = 0;
    nodes.forEach(node => {
      const nodeHeight = (node.data as any)?.height || (node.measured?.height) || 100;
      const bottom = (node.position?.y || 0) + nodeHeight;
      if (bottom > maxY) maxY = bottom;
    });
    // Add some bottom padding
    return Math.max(maxY + 80, 400);
  }, [nodes]);

  // Calculate scale: fit WORKSPACE_WIDTH into the container's actual width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Scale so that WORKSPACE_WIDTH fits exactly in the container
        const newScale = Math.min(containerWidth / WORKSPACE_WIDTH, 1);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // The scaled height of the ReactFlow viewport
  const scaledHeight = contentHeight * scale;

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto bg-white"
      style={{ maxWidth: WORKSPACE_WIDTH }}
    >
      {/* This div has the scaled height so the page scrolls naturally */}
      <div
        style={{
          width: '100%',
          height: scaledHeight,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ReactFlow is rendered at full workspace size, then scaled down with CSS */}
        <div
          style={{
            width: WORKSPACE_WIDTH,
            height: contentHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={1}
              maxZoom={1}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              panOnDrag={false}
              panOnScroll={false}
              preventScrolling={false}
              defaultEdgeOptions={{
                type: 'default',
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#333' },
              }}
              className="mindmap-display touchscreen:select-none"
              data-viewmode="true"
              proOptions={{ hideAttribution: true }}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

interface MindMapViewerProps {
  predefinedMindMap?: MindMapData;
  containerHeight?: string;
}

export const ExportedMindMap = ({ predefinedMindMap, containerHeight = "100vh" }: MindMapViewerProps) => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BaseNodeData | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [mindMaps, setMindMaps] = useState<string[]>([]);

  useEffect(() => {
    const loadMindMaps = async () => {
      await syncMindMapsFromFirebaseToLocal();
      setMindMaps(getAllMindMaps());
    };

    void loadMindMaps();
  }, []);

  // Default header data
  const defaultHeaderData: MindMapHeaderData = {
    title: 'Untitled Mind Map',
    description: 'No description provided',
    subDetails: 'No additional details'
  };

  // Auto-load mind map from URL parameter
  useEffect(() => {
    const mapName = searchParams.get('map');
    if (mapName) {
      setSelectedMap(mapName);
      handleRenderMap(mapName);
    }
  }, [searchParams]);

  // Use predefined mind map if provided
  useEffect(() => {
    if (predefinedMindMap) {
      setMindMapData(predefinedMindMap);
    }
  }, [predefinedMindMap]);

  const handleRenderMap = (mapName: string) => {
    if (!mapName) {
      toast({
        title: "Error",
        description: "Please select a mind map to view",
        variant: "destructive",
      });
      return;
    }

    const data = renderMindMap(mapName);
    if (data) {
      console.log('Mind map loaded for viewing:', data);
      console.log('Number of nodes:', data.nodes?.length || 0);
      console.log('Number of edges:', data.edges?.length || 0);
      console.log('Edges data:', JSON.stringify(data.edges, null, 2));
      
      setMindMapData(data);
      
      toast({
        title: "Success",
        description: `Loaded mind map: ${mapName} with ${data.edges?.length || 0} connections`,
      });
    } else {
      console.error('Failed to load mind map:', mapName);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${mapName}`,
        variant: "destructive",
      });
    }
  };

  const handleRender = () => {
    handleRenderMap(selectedMap);
  };

  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    console.log('Node selected for details:', node);
    setSelectedNode(node.data);
  };

  // Render map selection interface if no data is available
  if (!mindMapData && !predefinedMindMap) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
        <div className="absolute top-4 left-4">
          <Link to="/exams">
            <Button variant="outline" className="flex gap-2 items-center">
              <ArrowLeft size={16} />
              <span>Back to Catalog</span>
            </Button>
          </Link>
        </div>
        
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mind Map Viewer</h1>
          <p className="text-gray-600 mb-6">Select a mind map to view in presentation mode</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Select value={selectedMap} onValueChange={setSelectedMap}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choose a mind map to view" />
            </SelectTrigger>
            <SelectContent>
              {mindMaps.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRender} disabled={!selectedMap}>
            View Mind Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mind Map Canvas - Full Screen when data is available */}
      {(mindMapData || predefinedMindMap) && (
        <div className="w-full flex flex-col bg-white" style={{ minHeight: '100vh' }}>
          {/* Mind Map Header - Fixed at top */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-[100] sticky top-0">
            <MindMapHeader
              data={mindMapData?.headerData || defaultHeaderData}
              onChange={() => {}} // Read-only in view mode
              isCollapsed={isHeaderCollapsed}
              onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              readOnly={true}
            />
          </div>

          {/* Mind Map View - Fixed width, vertical scroll only */}
          <ViewModeCanvas
            mindMapData={mindMapData}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}

      <style>{`
        .mindmap-display .react-flow__handle {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .mindmap-display .react-flow__resize-control {
          display: none !important;
        }
        .mindmap-display .react-flow__node .settings-button {
          display: none !important;
        }
        .mindmap-display .react-flow__node .node-settings {
          display: none !important;
        }
        .mindmap-display {
          background: white !important;
          cursor: default !important;
        }
        .mindmap-display .react-flow__pane {
          cursor: default !important;
        }
        .mindmap-display .react-flow__background {
          display: none !important;
        }
        .mindmap-display .react-flow__controls {
          display: none !important;
        }
        .mindmap-display .react-flow__minimap {
          display: none !important;
        }
        .mindmap-display .react-flow__attribution {
          display: none !important;
        }
        .mindmap-display .react-flow__edges {
          z-index: 5 !important;
          pointer-events: none;
        }
        .mindmap-display .react-flow__edge {
          pointer-events: none;
        }
        .mindmap-display .react-flow__edge path,
        .mindmap-display .react-flow__edge-path {
          stroke: #333 !important;
          stroke-width: 2px !important;
          fill: none !important;
        }
        .mindmap-display .react-flow__edge.selected path {
          stroke: #3b82f6 !important;
        }
        .mindmap-display .react-flow__edgelabel {
          display: block !important;
        }
        .react-flow__edge-interaction {
          pointer-events: none;
        }
      `}</style>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedNode?.label}</DialogTitle>
            <DialogDescription>
              Node details and content
            </DialogDescription>
          </DialogHeader>
          
          {/* Display node content based on node type - safely handle nullable content */}
          {selectedNode?.content && typeof selectedNode.content === 'object' && selectedNode.content?.description && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedNode.content?.description}
              </p>
            </div>
          )}
          
          {selectedNode?.content && typeof selectedNode.content === 'object' && selectedNode.content?.links && selectedNode.content?.links.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Links</h3>
              <div className="space-y-2">
                {selectedNode.content?.links.map((link: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display specialized content based on node type */}
          {selectedNode?.nodeType === 'checklist' && (selectedNode as any).checklistItems && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Checklist Items</h3>
              <ul className="space-y-1">
                {(selectedNode as any).checklistItems.map((item: any) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={item.isChecked} readOnly className="h-4 w-4" />
                    <span className={item.isChecked ? 'line-through text-gray-500' : ''}>{item.text}</span>
                    {item.priority && (
                      <span className={`text-xs px-1 rounded ${
                        item.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedNode?.nodeType === 'note' && (selectedNode as any).noteContent && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Note Content</h3>
              <div className="p-3 rounded" style={{ backgroundColor: (selectedNode as any).noteColor || '#fffacd' }}>
                <p className="whitespace-pre-wrap">{(selectedNode as any).noteContent}</p>
              </div>
              {(selectedNode as any).tags && (selectedNode as any).tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(selectedNode as any).tags.map((tag: string, index: number) => (
                    <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedNode?.nodeType === 'concept' && (selectedNode as any).definition && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Concept Definition</h3>
              <p className="text-sm whitespace-pre-wrap">{(selectedNode as any).definition}</p>
              {(selectedNode as any).examples && (selectedNode as any).examples.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Examples:</h4>
                  <ul className="list-disc list-inside">
                    {(selectedNode as any).examples.map((example: string, index: number) => (
                      <li key={index} className="text-sm">{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
