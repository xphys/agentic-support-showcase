'use client';

import React, { useState, useMemo } from 'react';

export interface ListColumn<T = any> {
  /** Unique key for the column */
  key: string;
  /** Display label for the column */
  label: string;
  /** Function to extract value from item */
  getValue: (item: T) => any;
  /** Optional custom render function */
  render?: (value: any, item: T) => React.ReactNode;
  /** Column width (flex-basis) */
  width?: string;
  /** Whether this column is sortable */
  sortable?: boolean;
}

export interface ListConfig<T = any> {
  /** Columns configuration */
  columns: ListColumn<T>[];
  /** Function to get unique key for each item */
  getItemKey: (item: T) => string | number;
  /** Optional click handler for items */
  onItemClick?: (item: T) => void;
  /** Optional function to get item status/badge */
  getItemStatus?: (item: T) => { label: string; color: string };
  /** Show item numbers */
  showNumbers?: boolean;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search fields (keys to search in) */
  searchFields?: string[];
}

export interface GenericListProps<T = any> {
  /** Array of items to display */
  items: T[];
  /** Configuration for how to display the list */
  config: ListConfig<T>;
  /** Optional title */
  title?: string;
  /** Optional subtitle/description */
  description?: string;
  /** Layout type */
  layout?: 'grid' | 'table' | 'list';
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS class */
  className?: string;
}

const GenericList = <T extends Record<string, any>>({
  items,
  config,
  title,
  description,
  layout = 'grid',
  emptyMessage = 'No items to display',
  className = '',
}: GenericListProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!config.searchable || !searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      if (config.searchFields && config.searchFields.length > 0) {
        return config.searchFields.some((field) => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(query);
        });
      }

      // Search in all columns if no specific fields defined
      return config.columns.some((column) => {
        const value = column.getValue(item);
        return value?.toString().toLowerCase().includes(query);
      });
    });
  }, [items, searchQuery, config]);

  // Sort items
  const sortedItems = useMemo(() => {
    if (!sortColumn) {
      return filteredItems;
    }

    const column = config.columns.find((col) => col.key === sortColumn);
    if (!column) {
      return filteredItems;
    }

    return [...filteredItems].sort((a, b) => {
      const aValue = column.getValue(a);
      const bValue = column.getValue(b);

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortColumn, sortDirection, config.columns]);

  const handleSort = (columnKey: string) => {
    const column = config.columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const renderGridLayout = () => (
    <div className="generic-list-grid">
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        return (
          <div
            key={config.getItemKey(item)}
            className={`generic-list-card ${config.onItemClick ? 'clickable' : ''}`}
            onClick={() => config.onItemClick?.(item)}
          >
            {config.showNumbers && (
              <div className="item-number">{index + 1}</div>
            )}
            <div className="card-content">
              {config.columns.map((column) => {
                const value = column.getValue(item);
                const rendered = column.render ? column.render(value, item) : value;
                return (
                  <div key={column.key} className="card-field">
                    <label>{column.label}</label>
                    <div className="card-value">{rendered}</div>
                  </div>
                );
              })}
              {status && (
                <span className="item-status" style={{ background: status.color }}>
                  {status.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTableLayout = () => (
    <div className="generic-list-table-container">
      <table className="generic-list-table">
        <thead>
          <tr>
            {config.showNumbers && <th style={{ width: '60px' }}>#</th>}
            {config.columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={column.sortable ? 'sortable' : ''}
                onClick={() => handleSort(column.key)}
              >
                <div className="th-content">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {config.getItemStatus && <th style={{ width: '120px' }}>Status</th>}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => {
            const status = config.getItemStatus?.(item);
            return (
              <tr
                key={config.getItemKey(item)}
                className={config.onItemClick ? 'clickable' : ''}
                onClick={() => config.onItemClick?.(item)}
              >
                {config.showNumbers && <td>{index + 1}</td>}
                {config.columns.map((column) => {
                  const value = column.getValue(item);
                  const rendered = column.render ? column.render(value, item) : value;
                  return <td key={column.key}>{rendered}</td>;
                })}
                {config.getItemStatus && status && (
                  <td>
                    <span className="item-status" style={{ background: status.color }}>
                      {status.label}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderListLayout = () => (
    <div className="generic-list-items">
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        return (
          <div
            key={config.getItemKey(item)}
            className={`generic-list-item ${config.onItemClick ? 'clickable' : ''}`}
            onClick={() => config.onItemClick?.(item)}
          >
            {config.showNumbers && (
              <div className="item-number">{index + 1}</div>
            )}
            <div className="item-content">
              {config.columns.map((column) => {
                const value = column.getValue(item);
                const rendered = column.render ? column.render(value, item) : value;
                return (
                  <div key={column.key} className="item-field">
                    <span className="field-label">{column.label}:</span>
                    <span className="field-value">{rendered}</span>
                  </div>
                );
              })}
            </div>
            {status && (
              <span className="item-status" style={{ background: status.color }}>
                {status.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`generic-list ${className}`}>
      {(title || description) && (
        <div className="generic-list-header">
          {title && <h3>{title}</h3>}
          {description && <p className="description">{description}</p>}
        </div>
      )}

      {config.searchable && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      )}

      <div className="items-count">
        {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
      </div>

      {sortedItems.length === 0 ? (
        <div className="empty-state">{emptyMessage}</div>
      ) : (
        <>
          {layout === 'grid' && renderGridLayout()}
          {layout === 'table' && renderTableLayout()}
          {layout === 'list' && renderListLayout()}
        </>
      )}

      <style jsx>{`
        .generic-list {
          width: 100%;
        }

        .generic-list-header {
          margin-bottom: 24px;
        }

        .generic-list-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .description {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .search-box {
          position: relative;
          margin-bottom: 16px;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .items-count {
          margin-bottom: 16px;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #9ca3af;
          font-size: 1rem;
        }

        /* Grid Layout */
        .generic-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .generic-list-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s ease;
          position: relative;
        }

        .generic-list-card.clickable {
          cursor: pointer;
        }

        .generic-list-card.clickable:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .card-value {
          font-size: 0.95rem;
          color: #1f2937;
          word-break: break-word;
        }

        /* Table Layout */
        .generic-list-table-container {
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .generic-list-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .generic-list-table thead {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .generic-list-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
        }

        .generic-list-table th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .generic-list-table th.sortable:hover {
          background: #f3f4f6;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-indicator {
          font-size: 1rem;
        }

        .generic-list-table tbody tr {
          border-bottom: 1px solid #e5e7eb;
        }

        .generic-list-table tbody tr.clickable {
          cursor: pointer;
        }

        .generic-list-table tbody tr.clickable:hover {
          background: #f9fafb;
        }

        .generic-list-table td {
          padding: 12px 16px;
          font-size: 0.875rem;
          color: #1f2937;
        }

        /* List Layout */
        .generic-list-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .generic-list-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .generic-list-item.clickable {
          cursor: pointer;
        }

        .generic-list-item.clickable:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateX(4px);
        }

        .item-number {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .item-content {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .item-field {
          display: flex;
          gap: 8px;
          align-items: baseline;
        }

        .field-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .field-value {
          color: #1f2937;
          font-size: 0.875rem;
        }

        .item-status {
          flex-shrink: 0;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .generic-list-grid {
            grid-template-columns: 1fr;
          }

          .item-content {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default GenericList;
