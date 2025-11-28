/**
 * Generic Entity List Component
 * Universal component that works for Services, Categories, Therapists, Products, etc.
 * Based on template configuration - the ultimate SaaS flexibility!
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, Eye, Star, ArrowUpDown, Download, Upload } from 'lucide-react';
import { EntityConfig, FieldConfig, FieldType } from '../../types/templates';

// Generic entity data type
export interface EntityData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Component props
export interface EntityListProps {
  // Configuration
  entityConfig: EntityConfig;
  
  // Data
  data: EntityData[];
  loading?: boolean;
  error?: string;
  
  // Pagination
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Callbacks
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  
  // CRUD operations
  onCreate?: () => void;
  onEdit?: (item: EntityData) => void;
  onDelete?: (item: EntityData) => void;
  onView?: (item: EntityData) => void;
  onBulkAction?: (action: string, items: EntityData[]) => void;
  
  // Import/Export
  onImport?: (file: File) => void;
  onExport?: (format: 'csv' | 'json' | 'excel') => void;
  
  // UI customization
  showSearch?: boolean;
  showFilters?: boolean;
  showBulkActions?: boolean;
  showPagination?: boolean;
  showCreateButton?: boolean;
  showImportExport?: boolean;
  
  // Layout
  layout?: 'table' | 'grid' | 'list';
  cardSize?: 'sm' | 'md' | 'lg';
}

// Sort configuration
interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export default function EntityList({
  entityConfig,
  data = [],
  loading = false,
  error,
  pagination,
  onSearch,
  onFilter,
  onSort,
  onPageChange,
  onLimitChange,
  onCreate,
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  onImport,
  onExport,
  showSearch = true,
  showFilters = true,
  showBulkActions = true,
  showPagination = true,
  showCreateButton = true,
  showImportExport = false,
  layout = 'table',
  cardSize = 'md'
}: EntityListProps) {
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Filterable fields - fields that can be used for filtering
  const filterableFields = useMemo(() => {
    return entityConfig.fields.filter(field => 
      ['select', 'multiselect', 'toggle', 'radio', 'checkbox', 'date', 'datetime'].includes(field.type)
    );
  }, [entityConfig.fields]);

  // Sortable fields - fields that can be sorted
  const sortableFields = useMemo(() => {
    return entityConfig.fields.filter(field => 
      ['text', 'number', 'currency', 'date', 'datetime', 'select'].includes(field.type)
    );
  }, [entityConfig.fields]);

  // Display fields - primary fields to show in table/cards
  const displayFields = useMemo(() => {
    return entityConfig.fields
      .filter(field => field.order <= 5) // Show first 5 fields
      .sort((a, b) => a.order - b.order);
  }, [entityConfig.fields]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Handle filter change
  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Handle sort
  const handleSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.field === field && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ field, direction });
    onSort?.(field, direction);
  };

  // Handle item selection
  const handleSelectItem = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    
    setSelectedItems(newSelected);
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(data.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    const selectedData = data.filter(item => selectedItems.has(item.id));
    onBulkAction?.(action, selectedData);
    setSelectedItems(new Set()); // Clear selection
  };

  // Render field value based on type
  const renderFieldValue = (item: EntityData, field: FieldConfig) => {
    const value = item[field.key];
    
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">—</span>;
    }

    switch (field.type) {
      case 'currency':
        return <span className="font-medium">${Number(value).toFixed(2)}</span>;
      
      case 'number':
        return <span className="font-mono">{Number(value).toLocaleString()}</span>;
      
      case 'date':
      case 'datetime':
        return <span>{new Date(value).toLocaleDateString()}</span>;
      
      case 'toggle':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {value ? 'Yes' : 'No'}
          </span>
        );
      
      case 'select':
        const option = field.options?.find(opt => opt.value === value);
        return <span>{option?.label || value}</span>;
      
      case 'multiselect':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((val, idx) => {
                const option = field.options?.find(opt => opt.value === val);
                return (
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    {option?.label || val}
                  </span>
                );
              })}
              {value.length > 3 && (
                <span className="text-xs text-gray-500">+{value.length - 3} more</span>
              )}
            </div>
          );
        }
        return <span>{value}</span>;
      
      case 'image':
        return value ? (
          <img src={value} alt={field.label} className="w-10 h-10 rounded-lg object-cover" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <Eye size={16} className="text-gray-400" />
          </div>
        );
      
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300" 
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm">{value}</span>
          </div>
        );
      
      default:
        // Truncate long text
        const text = String(value);
        return (
          <span title={text}>
            {text.length > 50 ? `${text.slice(0, 50)}...` : text}
          </span>
        );
    }
  };

  // Render filter input
  const renderFilterInput = (field: FieldConfig) => {
    switch (field.type) {
      case 'select':
      case 'radio':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activeFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          >
            <option value="">All {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'toggle':
      case 'checkbox':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activeFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value === 'true' ? true : e.target.value === 'false' ? false : '')}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      
      case 'date':
      case 'datetime':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activeFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );
      
      default:
        return (
          <input
            type="text"
            placeholder={`Filter by ${field.label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activeFilters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );
    }
  };

  // Table layout
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showBulkActions && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedItems.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {displayFields.map(field => (
              <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  {field.label}
                  {sortableFields.find(f => f.key === field.key) && (
                    <button
                      onClick={() => handleSort(field.key)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ArrowUpDown size={14} />
                    </button>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {showBulkActions && (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedItems.has(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  />
                </td>
              )}
              {displayFields.map(field => (
                <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderFieldValue(item, field)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {onView && entityConfig.permissions.read && (
                    <button
                      onClick={() => onView(item)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {onEdit && entityConfig.permissions.update && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  {onDelete && entityConfig.permissions.delete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Error loading {entityConfig.plural.toLowerCase()}: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{entityConfig.plural}</h1>
          <p className="text-gray-600">Manage your {entityConfig.plural.toLowerCase()}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {showImportExport && (
            <>
              <button
                onClick={() => onImport?.(document.createElement('input') as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload size={16} />
                Import
              </button>
              <button
                onClick={() => onExport?.('csv')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </>
          )}
          
          {showCreateButton && onCreate && entityConfig.permissions.create && (
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add {entityConfig.singular}
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {showSearch && onSearch && (
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${entityConfig.plural.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}
        
        {showFilters && filterableFields.length > 0 && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 ${
              Object.keys(activeFilters).length > 0
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filters
            {Object.keys(activeFilters).length > 0 && (
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFiltersPanel && filterableFields.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterableFields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {renderFilterInput(field)}
              </div>
            ))}
          </div>
          
          {Object.keys(activeFilters).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setActiveFilters({});
                  onFilter?.({});
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bulk Actions */}
      {showBulkActions && selectedItems.size > 0 && onBulkAction && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
              >
                Delete Selected
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              >
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {entityConfig.plural.toLowerCase()}...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {React.createElement(require('lucide-react')[entityConfig.icon] || require('lucide-react').Package, { size: 32, className: 'text-gray-400' })}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {entityConfig.plural.toLowerCase()} found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first {entityConfig.singular.toLowerCase()}</p>
          {showCreateButton && onCreate && entityConfig.permissions.create && (
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Add {entityConfig.singular}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {renderTable()}
        </div>
      )}

      {/* Pagination */}
      {showPagination && pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = pagination.page - 2 + i;
              if (pageNum < 1 || pageNum > pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                    pageNum === pagination.page
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}