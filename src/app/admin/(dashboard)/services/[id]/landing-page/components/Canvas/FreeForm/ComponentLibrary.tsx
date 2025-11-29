// ComponentLibrary.tsx
// Sidebar for adding new components - WITH GRID SUPPORT

import React from 'react';
import type { SectionConfig, StackConfig, GridConfig } from './primitives.types';
import type { HeadingConfig, TextConfig, ButtonConfig, ImageConfig, ContentComponent } from './content.types';

interface ComponentLibraryProps {
  onAddSection: (section: SectionConfig) => void;
  onAddStack: (stack: StackConfig) => void;
  onAddGrid: (grid: GridConfig) => void;
  onAddContent: (content: ContentComponent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ComponentLibrary({ 
  onAddSection, 
  onAddStack, 
  onAddGrid, 
  onAddContent, 
  isOpen, 
  onClose 
}: ComponentLibraryProps) {
  const addSection = () => {
    const newSection: SectionConfig = {
      id: `section-${Date.now()}`,
      type: 'section',
      width: '100%',
      paddingTop: 80,
      paddingBottom: 80,
      background: {
        type: 'color',
        color: '#ffffff',
      },
      children: [],
    };
    onAddSection(newSection);
  };

  const addStack = () => {
    const newStack: StackConfig = {
      id: `stack-${Date.now()}`,
      type: 'stack',
      direction: 'vertical',
      gap: 24,
      align: 'center',
      justify: 'center',
      width: 'fill',
      children: [],
    };
    onAddStack(newStack);
  };

  const addGrid = () => {
    const newGrid: GridConfig = {
      id: `grid-${Date.now()}`,
      type: 'grid',
      columns: 3,
      gap: 24,
      children: [],
    };
    onAddGrid(newGrid);
  };

  const addHeading = () => {
    const newHeading: HeadingConfig = {
      id: `heading-${Date.now()}`,
      type: 'heading',
      text: 'New Heading',
      level: 'h2',
      fontSize: 32,
      fontWeight: 700,
      color: '#000000',
      textAlign: 'center',
    };
    onAddContent(newHeading);
  };

  const addText = () => {
    const newText: TextConfig = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: 'New paragraph text. Click to edit.',
      fontSize: 16,
      fontWeight: 400,
      color: '#333333',
      textAlign: 'left',
    };
    onAddContent(newText);
  };

  const addButton = () => {
    const newButton: ButtonConfig = {
      id: `button-${Date.now()}`,
      type: 'button',
      text: 'Click Me',
      variant: 'primary',
      size: 'md',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      fontSize: 16,
      fontWeight: 600,
      paddingX: 24,
      paddingY: 12,
      borderRadius: 8,
    };
    onAddContent(newButton);
  };

  const addImage = () => {
    const newImage: ImageConfig = {
      id: `image-${Date.now()}`,
      type: 'image',
      src: '',
      alt: 'New image',
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: 0,
    };
    onAddContent(newImage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-lg">Add Component</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Layout Components */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Layout</h3>
        
        <button
          onClick={addSection}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold">
              S
            </div>
            <div>
              <div className="font-semibold">Section</div>
              <div className="text-xs text-gray-500">Full-width container</div>
            </div>
          </div>
        </button>

        <button
          onClick={addStack}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center text-purple-600 font-bold">
              K
            </div>
            <div>
              <div className="font-semibold">Stack</div>
              <div className="text-xs text-gray-500">Flexbox layout</div>
            </div>
          </div>
        </button>

        <button
          onClick={addGrid}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded flex items-center justify-center text-amber-600 font-bold">
              G
            </div>
            <div>
              <div className="font-semibold">Grid</div>
              <div className="text-xs text-gray-500">CSS Grid (columns)</div>
            </div>
          </div>
        </button>
      </div>

      {/* Content Components */}
      <div className="p-4 pt-0">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Content</h3>
        
        <button
          onClick={addHeading}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center text-purple-600 font-bold">
              H
            </div>
            <div>
              <div className="font-semibold">Heading</div>
              <div className="text-xs text-gray-500">H1, H2, H3...</div>
            </div>
          </div>
        </button>

        <button
          onClick={addText}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold">
              T
            </div>
            <div>
              <div className="font-semibold">Text</div>
              <div className="text-xs text-gray-500">Paragraph</div>
            </div>
          </div>
        </button>

        <button
          onClick={addButton}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center text-orange-600 font-bold">
              B
            </div>
            <div>
              <div className="font-semibold">Button</div>
              <div className="text-xs text-gray-500">Call to action</div>
            </div>
          </div>
        </button>

        <button
          onClick={addImage}
          className="w-full mb-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded flex items-center justify-center text-pink-600 font-bold">
              I
            </div>
            <div>
              <div className="font-semibold">Image</div>
              <div className="text-xs text-gray-500">Picture or graphic</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}