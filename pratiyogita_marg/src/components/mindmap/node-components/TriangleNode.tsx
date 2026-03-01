
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShapeSettings } from '../settings/ShapeSettings';

export const TriangleNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Apply rotation if specified
  const rotationStyle = data.rotation ? {
    transform: `rotate(${data.rotation}deg)`,
  } : {};
  
  // Apply glow if enabled
  const glowStyle = data.glow?.enabled ? {
    filter: `drop-shadow(0 0 ${data.glow.blur || 8}px ${data.glow.color || '#3b82f6'})`,
  } : {};

  const strokeColor = data.strokeColor || '#000';
  const strokeWidth = data.strokeWidth || 1;
  const strokeStyle = data.strokeStyle || 'solid';
  const fillColor = data.backgroundColor || '#fff';

  // Map stroke style to SVG dash array
  const dashArray = strokeStyle === 'dashed' ? '8,4' : strokeStyle === 'dotted' ? '2,4' : 'none';

  return (
    <div className="relative">
      <NodeContainer 
        nodeStyle="flex items-center justify-center overflow-visible"
        nodeData={{...data, backgroundColor: 'transparent', strokeWidth: 0, strokeColor: 'transparent'}}
        selected={selected}
        onDoubleClick={handleDoubleClick}
        customStyle={{
          ...rotationStyle,
          aspectRatio: data.aspectRatio !== false ? '1 / 1' : 'auto',
          borderColor: 'transparent',
        }}
        forceAspectRatio={data.aspectRatio !== false}
        nodeId={id}
      >
        {/* SVG triangle with proper visible borders */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={glowStyle}
        >
          <polygon
            points="50,2 2,98 98,98"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
            strokeDasharray={dashArray}
            strokeLinejoin="round"
          />
        </svg>
        
        <div className="w-full h-full p-2 flex items-center justify-center relative z-10" style={{ paddingTop: '35%' }}>
          <div className="text-center">{data.label || 'Triangle'}</div>
          
          {/* Settings button - only visible when selected and not in view mode */}
          {selected && !document.querySelector('[data-viewmode="true"]') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="settings-button absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white/90"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <ShapeSettings nodeId={id} data={data} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </NodeContainer>
    </div>
  );
};
