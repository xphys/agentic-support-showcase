"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataType, loadListData } from "../actions/dataActions";
import FullScreenModal from "./FullScreenModal";

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
  /** Optional click handler for items - receives itemId */
  onItemClick?: (itemId: string | number) => void;
  /** Optional function to get item status/badge */
  getItemStatus?: (item: T) => { label: string; color: string };
  /** Show item numbers */
  showNumbers?: boolean;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search fields (keys to search in) */
  searchFields?: string[];
}

export interface GenericListWithDataProps {
  /** Data type to load */
  dataType: DataType;
  /** Configuration for how to display the list */
  config: ListConfig<any>;
  /** Optional title */
  title?: string;
  /** Optional subtitle/description */
  description?: string;
  /** Layout type */
  layout?: "grid" | "table" | "list";
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS class */
  className?: string;
  /** Hide fullscreen button (when already in fullscreen mode) */
  hideFullscreenButton?: boolean;
}

const GenericListWithData = ({
  dataType,
  config,
  title,
  description,
  layout = "grid",
  emptyMessage = "No items to display",
  className = "",
  hideFullscreenButton = false,
}: GenericListWithDataProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Load data from server action
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await loadListData(dataType);
        if (result.success) {
          setItems(result.data);
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError("An error occurred while loading data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType]);

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

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortColumn, sortDirection, config.columns]);

  const handleSort = (columnKey: string) => {
    const column = config.columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderGridLayout = () => (
    <div className="generic-list-grid">
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        const itemId = config.getItemKey(item);
        return (
          <div
            key={itemId}
            className={`generic-list-card ${config.onItemClick ? "clickable" : ""}`}
            onClick={() => {
              console.log("[GenericListWithData] Item clicked - itemId:", itemId, "type:", typeof itemId);
              config.onItemClick?.(itemId);
            }}
          >
            {config.showNumbers && <div className="item-number">{index + 1}</div>}
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
            {config.showNumbers && <th style={{ width: "60px" }}>#</th>}
            {config.columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={column.sortable ? "sortable" : ""}
                onClick={() => handleSort(column.key)}
              >
                <div className="th-content">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span className="sort-indicator">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {config.getItemStatus && <th style={{ width: "120px" }}>Status</th>}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => {
            const status = config.getItemStatus?.(item);
            const itemId = config.getItemKey(item);
            return (
              <tr
                key={itemId}
                className={config.onItemClick ? "clickable" : ""}
                onClick={() => {
                  console.log("[GenericListWithData] Item clicked - itemId:", itemId, "type:", typeof itemId);
                  config.onItemClick?.(itemId);
                }}
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
        const itemId = config.getItemKey(item);
        return (
          <div
            key={itemId}
            className={`generic-list-item ${config.onItemClick ? "clickable" : ""}`}
            onClick={() => {
              console.log("[GenericListWithData] Item clicked - itemId:", itemId, "type:", typeof itemId);
              config.onItemClick?.(itemId);
            }}
          >
            {config.showNumbers && <div className="item-number">{index + 1}</div>}
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

  if (loading) {
    return (
      <div className={`generic-list ${className}`}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading {title || "data"}...</p>
        </div>
        <style jsx>
          {`
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 64px 24px;
            color: #6b7280;
          }

          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #e5e7eb;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .loading-state p {
            margin: 0;
            font-size: 1rem;
            font-weight: 500;
          }
        `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`generic-list ${className}`}>
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
        <style jsx>
          {`
          .error-state {
            padding: 48px 24px;
            text-align: center;
            color: #ef4444;
            font-weight: 500;
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <>
      <div className={`generic-list ${className}`}>
        {(title || description || !hideFullscreenButton) && (
          <div className="generic-list-header">
            <div className="header-content">
              {title && <h3>{title}</h3>}
              {description && <p className="description">{description}</p>}
            </div>
            {!hideFullscreenButton && (
              <button
                className="fullscreen-button"
                onClick={() => setIsFullscreenOpen(true)}
                aria-label="Open in fullscreen"
                title="Open in fullscreen"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <span>Expand</span>
              </button>
            )}
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
          {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"}
        </div>

        {sortedItems.length === 0 ? <div className="empty-state">{emptyMessage}</div> : (
          <>
            {layout === "grid" && renderGridLayout()}
            {layout === "table" && renderTableLayout()}
            {layout === "list" && renderListLayout()}
          </>
        )}

        <style jsx>
          {`
        .generic-list {
          width: 100%;
        }

        .generic-list-header {
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .header-content {
          flex: 1;
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

        .fullscreen-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .fullscreen-button:hover {
          background: #f9fafb;
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
        }

        .fullscreen-button svg {
          flex-shrink: 0;
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

          .generic-list-header {
            flex-direction: column;
            align-items: stretch;
          }

          .fullscreen-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}
        </style>
      </div>

      <FullScreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        title={title || "Data List"}
      >
        <GenericListWithData
          dataType={dataType}
          config={config}
          title={undefined}
          description={description}
          layout={layout}
          emptyMessage={emptyMessage}
          hideFullscreenButton={true}
        />
      </FullScreenModal>
    </>
  );
};

export default GenericListWithData;
