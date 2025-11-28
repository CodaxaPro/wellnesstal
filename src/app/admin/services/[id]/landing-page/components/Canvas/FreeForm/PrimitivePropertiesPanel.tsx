// PrimitivePropertiesPanel.tsx
// Comprehensive properties panel with Section/Container/Stack/Grid support

import React from 'react';
import type { LayoutElement, SectionConfig, ContainerConfig, StackConfig, GridConfig, ContainerVariant } from './primitives.types';

interface PrimitivePropertiesPanelProps {
  selectedElement: LayoutElement | any | null;
  onUpdate: (element: any) => void;
}

export function PrimitivePropertiesPanel({ selectedElement, onUpdate }: PrimitivePropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="p-4 text-gray-500">
        No element selected. Click on any element to edit.
      </div>
    );
  }

  // HEADING Properties
  if (selectedElement.type === 'heading') {
    const heading = selectedElement as any;
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-lg">Heading Properties</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <input
            type="text"
            value={heading.text}
            onChange={(e) => onUpdate({ ...heading, text: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={heading.level}
            onChange={(e) => onUpdate({ ...heading, level: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Size (px)</label>
          <input
            type="number"
            value={heading.fontSize}
            onChange={(e) => onUpdate({ ...heading, fontSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Weight</label>
          <select
            value={heading.fontWeight}
            onChange={(e) => onUpdate({ ...heading, fontWeight: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semibold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extrabold (800)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={heading.color}
            onChange={(e) => onUpdate({ ...heading, color: e.target.value })}
            className="w-full h-10 border rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Align</label>
          <select
            value={heading.textAlign}
            onChange={(e) => onUpdate({ ...heading, textAlign: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    );
  }

  // TEXT Properties
  if (selectedElement.type === 'text') {
    const text = selectedElement as any;
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-lg">Text Properties</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <textarea
            value={text.text}
            onChange={(e) => onUpdate({ ...text, text: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Size (px)</label>
          <input
            type="number"
            value={text.fontSize}
            onChange={(e) => onUpdate({ ...text, fontSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={text.color}
            onChange={(e) => onUpdate({ ...text, color: e.target.value })}
            className="w-full h-10 border rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Align</label>
          <select
            value={text.textAlign}
            onChange={(e) => onUpdate({ ...text, textAlign: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Width (px)</label>
          <input
            type="number"
            value={text.maxWidth || ''}
            onChange={(e) => onUpdate({ ...text, maxWidth: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Auto"
          />
        </div>
      </div>
    );
  }

  // BUTTON Properties
  if (selectedElement.type === 'button') {
    const button = selectedElement as any;
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-lg">Button Properties</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <input
            type="text"
            value={button.text}
            onChange={(e) => onUpdate({ ...button, text: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={button.backgroundColor}
            onChange={(e) => onUpdate({ ...button, backgroundColor: e.target.value })}
            className="w-full h-10 border rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input
            type="color"
            value={button.textColor}
            onChange={(e) => onUpdate({ ...button, textColor: e.target.value })}
            className="w-full h-10 border rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Border Radius (px)</label>
          <input
            type="number"
            value={button.borderRadius}
            onChange={(e) => onUpdate({ ...button, borderRadius: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Padding X (px)</label>
          <input
            type="number"
            value={button.paddingX}
            onChange={(e) => onUpdate({ ...button, paddingX: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Padding Y (px)</label>
          <input
            type="number"
            value={button.paddingY}
            onChange={(e) => onUpdate({ ...button, paddingY: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Font Size (px)</label>
          <input
            type="number"
            value={button.fontSize}
            onChange={(e) => onUpdate({ ...button, fontSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
    );
  }

  // SECTION Properties
  if (selectedElement.type === 'section') {
    const section = selectedElement as SectionConfig;
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-lg">Section Properties</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Padding Top (px)</label>
          <input
            type="number"
            value={section.paddingTop}
            onChange={(e) => onUpdate({ ...section, paddingTop: Number(e.target.value) as any })}
            className="w-full px-3 py-2 border rounded"
            step="8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Padding Bottom (px)</label>
          <input
            type="number"
            value={section.paddingBottom}
            onChange={(e) => onUpdate({ ...section, paddingBottom: Number(e.target.value) as any })}
            className="w-full px-3 py-2 border rounded"
            step="8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={section.background?.color || '#667eea'}
            onChange={(e) => onUpdate({
              ...section,
              background: { ...section.background, type: 'color', color: e.target.value }
            })}
            className="w-full h-10 border rounded cursor-pointer"
          />
        </div>
      </div>
    );
  }

  // CONTAINER Properties
  if (selectedElement.type === 'container') {
    const container = selectedElement as ContainerConfig;
    
    return (
      <div className="p-4 space-y-6 max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white pb-2 border-b">
          <h3 className="font-bold text-lg">Container Properties</h3>
          <p className="text-xs text-gray-500 mt-1">Max-width, centered wrapper</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Variant</label>
          <select
            value={container.variant || 'standard'}
            onChange={(e) => onUpdate({ ...container, variant: e.target.value as ContainerVariant })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="standard">Standard (1200px)</option>
            <option value="narrow">Narrow (940px)</option>
            <option value="wide">Wide (1600px)</option>
            <option value="fluid">Fluid (Full)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Width (px)</label>
          <input
            type="number"
            value={container.maxWidth}
            onChange={(e) => onUpdate({ ...container, maxWidth: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            step="40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Width (px)</label>
          <input
            type="number"
            value={container.minWidth || ''}
            placeholder="Auto"
            onChange={(e) => onUpdate({ ...container, minWidth: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Height</h4>
          
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">Min Height (px)</label>
            <input
              type="number"
              value={container.minHeight || ''}
              placeholder="Auto"
              onChange={(e) => onUpdate({ ...container, minHeight: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">Max Height (px)</label>
            <input
              type="number"
              value={container.maxHeight || ''}
              placeholder="Auto"
              onChange={(e) => onUpdate({ ...container, maxHeight: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700">Padding</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Top</label>
              <input
                type="number"
                value={container.paddingTop || 0}
                onChange={(e) => onUpdate({ ...container, paddingTop: Number(e.target.value) as any })}
                className="w-full px-2 py-1 border rounded text-sm"
                step="8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Bottom</label>
              <input
                type="number"
                value={container.paddingBottom || 0}
                onChange={(e) => onUpdate({ ...container, paddingBottom: Number(e.target.value) as any })}
                className="w-full px-2 py-1 border rounded text-sm"
                step="8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Left</label>
              <input
                type="number"
                value={container.paddingLeft || container.paddingX || 24}
                onChange={(e) => onUpdate({ ...container, paddingLeft: Number(e.target.value) as any })}
                className="w-full px-2 py-1 border rounded text-sm"
                step="8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Right</label>
              <input
                type="number"
                value={container.paddingRight || container.paddingX || 24}
                onChange={(e) => onUpdate({ ...container, paddingRight: Number(e.target.value) as any })}
                className="w-full px-2 py-1 border rounded text-sm"
                step="8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700">Margin</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Top</label>
              <input
                type="number"
                value={container.marginTop || 0}
                onChange={(e) => onUpdate({ ...container, marginTop: Number(e.target.value) as any })}
                className="w-full px-2 py-1 border rounded text-sm"
                step="8"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Bottom</label>
              <input
                type="number"
                value={container.marginBottom || 0}
                onChange={(e) => onUpdate({ ...container, marginBottom: Number(e.target.value) as any })}
                className="w-full px-2 py-1 border rounded text-sm"
                step="8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700">Background</h4>
          
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">Type</label>
            <select
              value={container.background?.type || 'none'}
              onChange={(e) => onUpdate({
                ...container,
                background: { ...container.background, type: e.target.value as any }
              })}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="none">None</option>
              <option value="color">Color</option>
              <option value="gradient">Gradient</option>
              <option value="image">Image</option>
            </select>
          </div>

          {container.background?.type === 'color' && (
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Color</label>
              <input
                type="color"
                value={container.background.color || '#ffffff'}
                onChange={(e) => onUpdate({
                  ...container,
                  background: { ...container.background, type: 'color', color: e.target.value }
                })}
                className="w-full h-10 border rounded cursor-pointer"
              />
            </div>
          )}

          {container.background?.type === 'gradient' && (
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">CSS Gradient</label>
              <input
                type="text"
                value={container.background.gradient || ''}
                placeholder="linear-gradient(to right, #fff, #000)"
                onChange={(e) => onUpdate({
                  ...container,
                  background: { ...container.background, type: 'gradient', gradient: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded text-sm font-mono"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Border</h4>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={container.border?.enabled || false}
                onChange={(e) => onUpdate({
                  ...container,
                  border: { ...container.border, enabled: e.target.checked, width: 1, style: 'solid', color: '#e5e7eb', radius: 0 }
                })}
                className="mr-2"
              />
              <span className="text-xs text-gray-600">Enable</span>
            </label>
          </div>

          {container.border?.enabled && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Width (px)</label>
                <input
                  type="number"
                  value={container.border.width}
                  onChange={(e) => onUpdate({
                    ...container,
                    border: { ...container.border, width: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Style</label>
                <select
                  value={container.border.style}
                  onChange={(e) => onUpdate({
                    ...container,
                    border: { ...container.border, style: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Color</label>
                <input
                  type="color"
                  value={container.border.color}
                  onChange={(e) => onUpdate({
                    ...container,
                    border: { ...container.border, color: e.target.value }
                  })}
                  className="w-full h-10 border rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Radius (px)</label>
                <input
                  type="number"
                  value={container.border.radius}
                  onChange={(e) => onUpdate({
                    ...container,
                    border: { ...container.border, radius: Number(e.target.value) }
                  })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min="0"
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Shadow</h4>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={container.shadow?.enabled || false}
                onChange={(e) => onUpdate({
                  ...container,
                  shadow: { enabled: e.target.checked, offsetX: 0, offsetY: 4, blur: 6, spread: 0, color: 'rgba(0,0,0,0.1)' }
                })}
                className="mr-2"
              />
              <span className="text-xs text-gray-600">Enable</span>
            </label>
          </div>

          {container.shadow?.enabled && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">X</label>
                  <input
                    type="number"
                    value={container.shadow.offsetX}
                    onChange={(e) => onUpdate({
                      ...container,
                      shadow: { ...container.shadow, offsetX: Number(e.target.value) }
                    })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Y</label>
                  <input
                    type="number"
                    value={container.shadow.offsetY}
                    onChange={(e) => onUpdate({
                      ...container,
                      shadow: { ...container.shadow, offsetY: Number(e.target.value) }
                    })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Blur</label>
                  <input
                    type="number"
                    value={container.shadow.blur}
                    onChange={(e) => onUpdate({
                      ...container,
                      shadow: { ...container.shadow, blur: Number(e.target.value) }
                    })}
                    className="w-full px-2 py-1 border rounded text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Spread</label>
                  <input
                    type="number"
                    value={container.shadow.spread}
                    onChange={(e) => onUpdate({
                      ...container,
                      shadow: { ...container.shadow, spread: Number(e.target.value) }
                    })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Color</label>
                <input
                  type="text"
                  value={container.shadow.color}
                  placeholder="rgba(0,0,0,0.1)"
                  onChange={(e) => onUpdate({
                    ...container,
                    shadow: { ...container.shadow, color: e.target.value }
                  })}
                  className="w-full px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium mb-2">Overflow</label>
          <select
            value={container.overflow || 'visible'}
            onChange={(e) => onUpdate({ ...container, overflow: e.target.value as any })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="scroll">Scroll</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    );
  }

  // STACK Properties
  if (selectedElement.type === 'stack') {
    const stack = selectedElement as StackConfig;
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-lg">Stack Properties</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Direction</label>
          <select
            value={stack.direction}
            onChange={(e) => onUpdate({ ...stack, direction: e.target.value as any })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="vertical">Vertical (Column)</option>
            <option value="horizontal">Horizontal (Row)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gap (px)</label>
          <input
            type="number"
            value={stack.gap}
            onChange={(e) => onUpdate({ ...stack, gap: Number(e.target.value) as any })}
            className="w-full px-3 py-2 border rounded"
            step="8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Align Items</label>
          <select
            value={stack.align || 'start'}
            onChange={(e) => onUpdate({ ...stack, align: e.target.value as any })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Justify Content</label>
          <select
            value={stack.justify || 'start'}
            onChange={(e) => onUpdate({ ...stack, justify: e.target.value as any })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="space-between">Space Between</option>
            <option value="space-around">Space Around</option>
            <option value="space-evenly">Space Evenly</option>
          </select>
        </div>
      </div>
    );
  }

  // GRID Properties - NEW
  if (selectedElement.type === 'grid') {
    const grid = selectedElement as GridConfig;
    return (
      <div className="p-4 space-y-4">
        <div className="sticky top-0 bg-white pb-2 border-b">
          <h3 className="font-bold text-lg">Grid Properties</h3>
          <p className="text-xs text-gray-500 mt-1">CSS Grid layout</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <input
            type="number"
            value={grid.columns}
            onChange={(e) => onUpdate({ ...grid, columns: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
            min="1"
            max="12"
          />
          <p className="text-xs text-gray-500 mt-1">Number of columns (1-12)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gap (px)</label>
          <input
            type="number"
            value={grid.gap}
            onChange={(e) => onUpdate({ ...grid, gap: Number(e.target.value) as any })}
            className="w-full px-3 py-2 border rounded"
            step="8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Row Gap (px)</label>
          <input
            type="number"
            value={grid.rowGap || grid.gap}
            onChange={(e) => onUpdate({ ...grid, rowGap: Number(e.target.value) as any })}
            className="w-full px-3 py-2 border rounded"
            step="8"
            placeholder={`${grid.gap} (same as gap)`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Column Gap (px)</label>
          <input
            type="number"
            value={grid.columnGap || grid.gap}
            onChange={(e) => onUpdate({ ...grid, columnGap: Number(e.target.value) as any })}
            className="w-full px-3 py-2 border rounded"
            step="8"
            placeholder={`${grid.gap} (same as gap)`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Align Items</label>
          <select
            value={grid.align || 'start'}
            onChange={(e) => onUpdate({ ...grid, align: e.target.value as any })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Justify Content</label>
          <select
            value={grid.justify || 'start'}
            onChange={(e) => onUpdate({ ...grid, justify: e.target.value as any })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="space-between">Space Between</option>
            <option value="space-around">Space Around</option>
            <option value="space-evenly">Space Evenly</option>
          </select>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Padding</h4>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">All Sides (px)</label>
            <input
              type="number"
              value={grid.padding || 0}
              onChange={(e) => onUpdate({ ...grid, padding: Number(e.target.value) as any })}
              className="w-full px-2 py-1 border rounded text-sm"
              step="8"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}