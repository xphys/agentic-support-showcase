'use client';

import React, { useState, useMemo } from 'react';
import styles from './GenericList.module.css';

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
  /** Optional render function for item details view */
  renderItemView?: (item: T, onBack: () => void) => React.ReactNode;
}

const GenericList = <T extends Record<string, any>>({
  items,
  config,
  title,
  description,
  layout = 'grid',
  emptyMessage = 'No items to display',
  className = '',
  renderItemView,
}: GenericListProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

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

  const handleItemClick = (item: T) => {
    if (renderItemView) {
      // Internal navigation - show item view within the component
      setSelectedItem(item);
    } else if (config.onItemClick) {
      // External navigation - use the provided click handler
      config.onItemClick(item);
    }
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // If an item is selected and we have a render function, show the item view
  if (selectedItem && renderItemView) {
    return (
      <div className={`${styles.genericList} ${className}`}>
        {renderItemView(selectedItem, handleBackToList)}
      </div>
    );
  }

  const renderGridLayout = () => (
    <div className={styles.genericListGrid}>
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        return (
          <div
            key={config.getItemKey(item)}
            className={`${styles.genericListCard} ${(config.onItemClick || renderItemView) ? styles.clickable : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {config.showNumbers && (
              <div className={styles.itemNumber}>{index + 1}</div>
            )}
            <div className={styles.cardContent}>
              {config.columns.map((column) => {
                const value = column.getValue(item);
                const rendered = column.render ? column.render(value, item) : value;
                return (
                  <div key={column.key} className={styles.cardField}>
                    <label>{column.label}</label>
                    <div className={styles.cardValue}>{rendered}</div>
                  </div>
                );
              })}
              {status && (
                <span className={styles.itemStatus} style={{ background: status.color }}>
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
    <div className={styles.genericListTableContainer}>
      <table className={styles.genericListTable}>
        <thead>
          <tr>
            {config.showNumbers && <th style={{ width: '60px' }}>#</th>}
            {config.columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={column.sortable ? styles.sortable : ''}
                onClick={() => handleSort(column.key)}
              >
                <div className={styles.thContent}>
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span className={styles.sortIndicator}>
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
                className={(config.onItemClick || renderItemView) ? styles.clickable : ''}
                onClick={() => handleItemClick(item)}
              >
                {config.showNumbers && <td>{index + 1}</td>}
                {config.columns.map((column) => {
                  const value = column.getValue(item);
                  const rendered = column.render ? column.render(value, item) : value;
                  return <td key={column.key}>{rendered}</td>;
                })}
                {config.getItemStatus && status && (
                  <td>
                    <span className={styles.itemStatus} style={{ background: status.color }}>
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
    <div className={styles.genericListItems}>
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        return (
          <div
            key={config.getItemKey(item)}
            className={`${styles.genericListItem} ${(config.onItemClick || renderItemView) ? styles.clickable : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {config.showNumbers && (
              <div className={styles.itemNumber}>{index + 1}</div>
            )}
            <div className={styles.itemContent}>
              {config.columns.map((column) => {
                const value = column.getValue(item);
                const rendered = column.render ? column.render(value, item) : value;
                return (
                  <div key={column.key} className={styles.itemField}>
                    <span className={styles.fieldLabel}>{column.label}:</span>
                    <span className={styles.fieldValue}>{rendered}</span>
                  </div>
                );
              })}
            </div>
            {status && (
              <span className={styles.itemStatus} style={{ background: status.color }}>
                {status.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={`${styles.genericList} ${className}`}>
      {(title || description) && (
        <div className={styles.genericListHeader}>
          {title && <h3>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      {config.searchable && (
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      )}

      <div className={styles.itemsCount}>
        {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
      </div>

      {sortedItems.length === 0 ? (
        <div className={styles.emptyState}>{emptyMessage}</div>
      ) : (
        <>
          {layout === 'grid' && renderGridLayout()}
          {layout === 'table' && renderTableLayout()}
          {layout === 'list' && renderListLayout()}
        </>
      )}
    </div>
  );
};

export default GenericList;
