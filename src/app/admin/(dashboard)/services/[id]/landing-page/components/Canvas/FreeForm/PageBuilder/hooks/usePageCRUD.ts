// hooks/usePageCRUD.ts
// CRUD Operations Hook

import { useCallback } from 'react';

import type { HeadingConfig, TextConfig, ContentComponent } from '../../content.types';
import type { SectionConfig, ContainerConfig, StackConfig, GridConfig } from '../../primitives.types';
import { findElementById } from '../utils/elementFinders';
import { regenerateIds } from '../utils/idGenerator';

// PageSection type'ını buraya kopyala (geçici)
interface PageSection {
  section: SectionConfig;
  container: ContainerConfig;
  stacks: StackConfig[];
  grids: GridConfig[];
}

interface UsePageCRUDReturn {
  handleAddSection: (newSection: SectionConfig) => void;
  handleAddStack: (newStack: StackConfig) => void;
  handleAddGrid: (newGrid: GridConfig) => void;
  handleAddContent: (newContent: ContentComponent) => void;
  handleDelete: (id: string) => void;
  handleDuplicate: (id: string) => void;
  handleMove: (id: string, direction: 'up' | 'down') => void;
  handleUpdate: (updated: SectionConfig | ContainerConfig | StackConfig | GridConfig | ContentComponent) => void;
}

export function usePageCRUD(
  sections: PageSection[],
  setSections: (sections: PageSection[] | ((prev: PageSection[]) => PageSection[])) => void,
  selectedId: string | null
): UsePageCRUDReturn {
  
  // ============================================================================
  // ADD OPERATIONS
  // ============================================================================

  /**
   * Yeni section ekle
   */
  const handleAddSection = useCallback((newSection: SectionConfig) => {
    const newPageSection: PageSection = {
      section: newSection,
      container: {
        id: `container-${Date.now()}`,
        type: 'container',
        variant: 'standard',
        maxWidth: 1200,
        paddingX: 24,
        margin: 'auto',
        children: [],
      },
      stacks: [
        {
          id: `stack-${Date.now()}`,
          type: 'stack',
          direction: 'vertical',
          gap: 24,
          align: 'center',
          justify: 'center',
          width: 'fill',
          children: [
            {
              id: `heading-${Date.now()}`,
              type: 'heading' as const,
              text: 'New Section Heading',
              level: 'h2' as const,
              fontSize: 36,
              fontWeight: 700,
              color: '#1f2937',
              textAlign: 'center' as const,
            } as HeadingConfig,
            {
              id: `text-${Date.now()}`,
              type: 'text' as const,
              text: 'Click to edit this text or add more content below.',
              fontSize: 16,
              fontWeight: 400,
              color: '#6b7280',
              textAlign: 'center' as const,
            } as TextConfig,
          ],
        },
      ],
      grids: [],
    };
    setSections([...sections, newPageSection]);
  }, [sections, setSections]);

  /**
   * Yeni stack ekle
   */
  const handleAddStack = useCallback((newStack: StackConfig) => {
    if (!selectedId) {
      alert('Please select a Section or Container first');
      return;
    }

    const stackWithContent: StackConfig = {
      ...newStack,
      children: [
        {
          id: `text-${Date.now()}`,
          type: 'text' as const,
          text: 'New stack - add content here',
          fontSize: 16,
          fontWeight: 400,
          color: '#9ca3af',
          textAlign: 'center' as const,
        } as TextConfig,
      ],
    };

    const updatedSections = sections.map((pageSection) => {
      if (pageSection.section.id === selectedId || pageSection.container.id === selectedId) {
        return {
          ...pageSection,
          stacks: [...pageSection.stacks, stackWithContent],
        };
      }

      const addNestedStack = (elements: (StackConfig | ContentComponent)[]): (StackConfig | ContentComponent)[] => {
        return elements.map((element) => {
          if (element.type === 'stack' && element.id === selectedId) {
            return {
              ...element,
              children: [...element.children, stackWithContent],
            };
          }
          if (element.type === 'stack' && 'children' in element) {
            return {
              ...element,
              children: addNestedStack(element.children),
            };
          }
          return element;
        });
      };

      return {
        ...pageSection,
        stacks: addNestedStack(pageSection.stacks) as StackConfig[],
      };
    });

    setSections(updatedSections);
  }, [selectedId, sections, setSections]);

  /**
   * Yeni grid ekle
   */
  const handleAddGrid = useCallback((newGrid: GridConfig) => {
    if (!selectedId) {
      alert('Please select a Section or Container first');
      return;
    }

    const placeholderItems = Array.from({ length: newGrid.columns }, (_, i) => ({
      id: `text-${Date.now()}-${i}`,
      type: 'text' as const,
      text: `Grid Item ${i + 1}`,
      fontSize: 16,
      fontWeight: 400,
      color: '#9ca3af',
      textAlign: 'center' as const,
    } as TextConfig));

    const gridWithContent: GridConfig = {
      ...newGrid,
      children: placeholderItems,
    };

    const updatedSections = sections.map((pageSection) => {
      if (pageSection.section.id === selectedId || pageSection.container.id === selectedId) {
        return {
          ...pageSection,
          grids: [...pageSection.grids, gridWithContent],
        };
      }
      return pageSection;
    });

    setSections(updatedSections);
  }, [selectedId, sections, setSections]);

  /**
   * Yeni content ekle
   */
  const handleAddContent = useCallback((newContent: ContentComponent) => {
    if (!selectedId) {
      alert('Please select a Stack or Grid first');
      return;
    }

    const updatedSections = sections.map((pageSection) => {
      const addToStack = (elements: (StackConfig | ContentComponent)[]): (StackConfig | ContentComponent)[] => {
        return elements.map((element) => {
          if (element.type === 'stack' && element.id === selectedId) {
            return {
              ...element,
              children: [...element.children, newContent],
            };
          }
          if (element.type === 'stack' && 'children' in element) {
            return {
              ...element,
              children: addToStack(element.children),
            };
          }
          return element;
        });
      };

      let foundInStack = false;
      const findParentStack = (elements: (StackConfig | ContentComponent)[]): boolean => {
        for (const element of elements) {
          if (element.type === 'stack') {
            if (element.children.some((child) => child.id === selectedId)) {
              foundInStack = true;
              return true;
            }
            if (findParentStack(element.children)) {
return true;
}
          }
        }
        return false;
      };

      findParentStack(pageSection.stacks);

      if (foundInStack || pageSection.stacks.some((s) => s.id === selectedId)) {
        return {
          ...pageSection,
          stacks: addToStack(pageSection.stacks) as StackConfig[],
        };
      }

      const updatedGrids = pageSection.grids.map((grid) => {
        if (grid.id === selectedId || grid.children.some((c) => c.id === selectedId)) {
          return {
            ...grid,
            children: [...grid.children, newContent],
          };
        }
        return grid;
      });

      return { ...pageSection, grids: updatedGrids };
    });

    setSections(updatedSections);
  }, [selectedId, sections, setSections]);

  // ============================================================================
  // DELETE OPERATION
  // ============================================================================

  /**
   * Element sil
   */
  const handleDelete = useCallback((id: string) => {
    if (!confirm('Are you sure you want to delete this element?')) {
return;
}

    // Section silme
    const filteredSections = sections.filter((ps) => ps.section.id !== id);
    if (filteredSections.length !== sections.length) {
      setSections(filteredSections);
      return;
    }

    // Diğer element'leri silme
    const updatedSections = sections.map((pageSection) => {
      const deleteFromElements = (elements: (StackConfig | ContentComponent)[]): (StackConfig | ContentComponent)[] => {
        return elements
          .filter((element) => element.id !== id)
          .map((element) => {
            if ('children' in element && Array.isArray(element.children)) {
              return {
                ...element,
                children: deleteFromElements(element.children),
              };
            }
            return element;
          });
      };

      const updatedStacks = deleteFromElements(pageSection.stacks) as StackConfig[];
      
      const filteredGrids = pageSection.grids.filter((g) => g.id !== id);
      const updatedGrids = filteredGrids.map((grid) => ({
        ...grid,
        children: grid.children.filter((c) => c.id !== id),
      }));

      return {
        ...pageSection,
        stacks: updatedStacks,
        grids: updatedGrids,
      };
    });

    setSections(updatedSections);
  }, [sections, setSections]);

  // ============================================================================
  // DUPLICATE OPERATION
  // ============================================================================

  /**
   * Element kopyala
   */
  const handleDuplicate = useCallback((id: string) => {
    // Section kopyalama
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].section.id === id) {
        const duplicated = JSON.parse(JSON.stringify(sections[i]));
        const regeneratedSection = regenerateIds(duplicated);
        const newSections = [...sections];
        newSections.splice(i + 1, 0, regeneratedSection);
        setSections(newSections);
        return;
      }
    }

    // Diğer element'leri kopyalama
    const updatedSections = sections.map((pageSection) => {
      const duplicateInElements = (
        elements: (StackConfig | ContentComponent)[]
      ): (StackConfig | ContentComponent)[] | null => {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].id === id) {
            const duplicated = JSON.parse(JSON.stringify(elements[i]));
            duplicated.id = `${duplicated.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const newElements = [...elements];
            newElements.splice(i + 1, 0, duplicated);
            return newElements;
          }

          if (elements[i].type === 'stack' && 'children' in elements[i]) {
            const stackElement = elements[i] as StackConfig;
            const result = duplicateInElements(stackElement.children);
            if (result) {
              const newElements = [...elements];
              newElements[i] = {
                ...elements[i],
                children: result,
              } as StackConfig;
              return newElements;
            }
          }
        }
        return null;
      };

      const duplicatedStacks = duplicateInElements(pageSection.stacks);
      if (duplicatedStacks) {
        return {
          ...pageSection,
          stacks: duplicatedStacks as StackConfig[],
        };
      }

      for (let i = 0; i < pageSection.grids.length; i++) {
        if (pageSection.grids[i].id === id) {
          const duplicated = JSON.parse(JSON.stringify(pageSection.grids[i]));
          duplicated.id = `grid-${Date.now()}`;
          const newGrids = [...pageSection.grids];
          newGrids.splice(i + 1, 0, duplicated);
          return { ...pageSection, grids: newGrids };
        }

        const contentIndex = pageSection.grids[i].children.findIndex((c) => c.id === id);
        if (contentIndex !== -1) {
          const duplicated = { ...pageSection.grids[i].children[contentIndex] };
          duplicated.id = `${duplicated.type}-${Date.now()}`;
          const newChildren = [...pageSection.grids[i].children];
          newChildren.splice(contentIndex + 1, 0, duplicated);
          const newGrids = [...pageSection.grids];
          newGrids[i] = { ...newGrids[i], children: newChildren };
          return { ...pageSection, grids: newGrids };
        }
      }

      return pageSection;
    });

    setSections(updatedSections);
  }, [sections, setSections]);

  // ============================================================================
  // MOVE OPERATION
  // ============================================================================

  /**
   * Element taşı (up/down)
   */
  const handleMove = useCallback((id: string, direction: 'up' | 'down') => {
    const move = direction === 'up' ? -1 : 1;

    // Section taşıma
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].section.id === id) {
        const newIndex = i + move;
        if (newIndex < 0 || newIndex >= sections.length) {
return;
}
        const newSections = [...sections];
        [newSections[i], newSections[newIndex]] = [newSections[newIndex], newSections[i]];
        setSections(newSections);
        return;
      }
    }

    // Diğer element'leri taşıma
    const updatedSections = sections.map((pageSection) => {
      const moveInElements = (
        elements: (StackConfig | ContentComponent)[]
      ): (StackConfig | ContentComponent)[] | null => {
        const index = elements.findIndex((e) => e.id === id);
        if (index !== -1) {
          const newIndex = index + move;
          if (newIndex < 0 || newIndex >= elements.length) {
return elements;
}
          const newElements = [...elements];
          [newElements[index], newElements[newIndex]] = [newElements[newIndex], newElements[index]];
          return newElements;
        }

        for (let i = 0; i < elements.length; i++) {
          if (elements[i].type === 'stack' && 'children' in elements[i]) {
            const stackElement = elements[i] as StackConfig;
            const result = moveInElements(stackElement.children);
            if (result && result !== stackElement.children) {
              const newElements = [...elements];
              newElements[i] = {
                ...elements[i],
                children: result,
              } as StackConfig;
              return newElements;
            }
          }
        }
        return null;
      };

      const movedStacks = moveInElements(pageSection.stacks);
      if (movedStacks) {
        return {
          ...pageSection,
          stacks: movedStacks as StackConfig[],
        };
      }

      const gridIndex = pageSection.grids.findIndex((g) => g.id === id);
      if (gridIndex !== -1) {
        const newIndex = gridIndex + move;
        if (newIndex < 0 || newIndex >= pageSection.grids.length) {
return pageSection;
}
        const newGrids = [...pageSection.grids];
        [newGrids[gridIndex], newGrids[newIndex]] = [newGrids[newIndex], newGrids[gridIndex]];
        return { ...pageSection, grids: newGrids };
      }

      const updatedGrids = pageSection.grids.map((grid) => {
        const contentIndex = grid.children.findIndex((c) => c.id === id);
        if (contentIndex !== -1) {
          const newIndex = contentIndex + move;
          if (newIndex < 0 || newIndex >= grid.children.length) {
return grid;
}
          const newChildren = [...grid.children];
          [newChildren[contentIndex], newChildren[newIndex]] = [newChildren[newIndex], newChildren[contentIndex]];
          return { ...grid, children: newChildren };
        }
        return grid;
      });

      return { ...pageSection, grids: updatedGrids };
    });

    setSections(updatedSections);
  }, [sections, setSections]);

  // ============================================================================
  // UPDATE OPERATION
  // ============================================================================

  /**
   * Element güncelle
   */
  const handleUpdate = useCallback((updated: SectionConfig | ContainerConfig | StackConfig | GridConfig | ContentComponent) => {
    setSections((prevSections: PageSection[]) => {
      return prevSections.map((pageSection: PageSection): PageSection => {
        if (pageSection.section.id === updated.id) {
          return { ...pageSection, section: updated as SectionConfig };
        }
        if (pageSection.container.id === updated.id) {
          return { ...pageSection, container: updated as ContainerConfig };
        }

        const updateInElements = (
          elements: (StackConfig | ContentComponent)[]
        ): (StackConfig | ContentComponent)[] => {
          return elements.map((element): StackConfig | ContentComponent => {
            if (element.id === updated.id) {
              if (updated.type === 'section' || updated.type === 'container' || updated.type === 'grid') {
                return element;
              }
              return updated;
            }
            if (element.type === 'stack' && 'children' in element) {
              return {
                ...element,
                children: updateInElements(element.children),
              } as StackConfig;
            }
            return element;
          });
        };

        const updatedStacks: StackConfig[] = updateInElements(pageSection.stacks) as StackConfig[];

        const updatedGrids: GridConfig[] = pageSection.grids.map((grid: GridConfig): GridConfig => {
          if (grid.id === updated.id && updated.type === 'grid') {
            const gridUpdate = updated as GridConfig;
            if (gridUpdate.columns !== grid.columns) {
              const newChildren = Array.from({ length: gridUpdate.columns }, (_, i) => {
                return grid.children[i] || {
                  id: `text-${Date.now()}-${i}`,
                  type: 'text' as const,
                  text: `Grid Item ${i + 1}`,
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#9ca3af',
                  textAlign: 'center' as const,
                } as TextConfig;
              });
              return { ...gridUpdate, children: newChildren };
            }
            return gridUpdate;
          }
          
          const updatedChildren: ContentComponent[] = grid.children.map((content: ContentComponent): ContentComponent => {
            if (content.id === updated.id) {
              if (updated.type === 'section' || updated.type === 'container' || updated.type === 'grid' || updated.type === 'stack') {
                return content;
              }
              return updated as ContentComponent;
            }
            return content;
          });
          return { ...grid, children: updatedChildren };
        });

        return { 
          section: pageSection.section,
          container: pageSection.container,
          stacks: updatedStacks, 
          grids: updatedGrids 
        };
      });
    });
  }, [setSections]);

  return {
    handleAddSection,
    handleAddStack,
    handleAddGrid,
    handleAddContent,
    handleDelete,
    handleDuplicate,
    handleMove,
    handleUpdate,
  };
}