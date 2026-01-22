"use client";

import React, { useEffect, useState } from "react";
import { DataType, loadListData } from "../../actions/dataActions";
import FullScreenModal from "../FullScreenModal";
import GenericList from "./GenericList";

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
  /** Optional render function for item details view (enables internal navigation) */
  renderItemView?: (item: any, onBack: () => void) => React.ReactNode;
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
  renderItemView,
}: GenericListWithDataProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Wrap the onItemClick handler to work with GenericList
  const listConfig = config.onItemClick
    ? {
        ...config,
        onItemClick: (item: any) => {
          const itemId = config.getItemKey(item);
          console.log("[GenericListWithData] Item clicked - itemId:", itemId, "type:", typeof itemId);
          config.onItemClick?.(itemId);
        },
      }
    : config;

  if (loading) {
    return (
      <div className={className} style={{ padding: '80px 32px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '56px',
          height: '56px',
          border: '5px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: '#6366f1',
          borderBottomColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{
          fontSize: '1.05rem',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Loading {title || "data"}...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} style={{
        padding: '64px 32px',
        textAlign: 'center',
        color: '#ef4444',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        borderRadius: '20px',
        border: '2px solid rgba(239, 68, 68, 0.2)'
      }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        {!hideFullscreenButton && (
          <button
            onClick={() => setIsFullscreenOpen(true)}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#6366f1',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
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
        <GenericList
          items={items}
          config={listConfig}
          title={title}
          description={description}
          layout={layout}
          emptyMessage={emptyMessage}
          className={className}
          renderItemView={renderItemView}
        />
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
