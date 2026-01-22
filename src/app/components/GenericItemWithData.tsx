"use client";

import React, { useEffect, useState } from "react";
import { DataType, loadItemData } from "../actions/dataActions";
import FullScreenModal from "./FullScreenModal";

export interface ItemField<T = any> {
  /** Unique key for the field */
  key: string;
  /** Display label */
  label: string;
  /** Function to extract value from item */
  getValue: (item: T) => any;
  /** Optional custom render function */
  render?: (value: any, item: T) => React.ReactNode;
  /** Field category/section */
  section?: string;
  /** Whether to highlight this field */
  highlight?: boolean;
  /** Field width in grid layout */
  span?: 1 | 2 | 3 | 4;
  /** Show as a badge */
  badge?: boolean;
  /** Badge color */
  badgeColor?: string;
}

export interface ItemAction {
  /** Action label */
  label: string;
  /** Action handler */
  onClick: () => void;
  /** Icon or emoji */
  icon?: string;
  /** Button style variant */
  variant?: "primary" | "secondary" | "danger" | "success";
  /** Is action disabled */
  disabled?: boolean;
}

export interface GenericItemWithDataProps {
  /** Data type to load */
  dataType: DataType;
  /** Item ID to load */
  itemId: string | number;
  /** Configuration for fields to display */
  fields: ItemField<any>[];
  /** Optional title function - receives item */
  getTitle?: (item: any) => string;
  /** Optional subtitle function - receives item */
  getSubtitle?: (item: any) => string;
  /** Optional image URL function - receives item */
  getImageUrl?: (item: any) => string;
  /** Actions/buttons function - receives item */
  getActions?: (item: any) => ItemAction[];
  /** Layout: 'card' | 'panel' | 'details' */
  layout?: "card" | "panel" | "details";
  /** Back button handler */
  onBack?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Hide fullscreen button (when already in fullscreen mode) */
  hideFullscreenButton?: boolean;
}

const GenericItemWithData = ({
  dataType,
  itemId,
  fields,
  getTitle,
  getSubtitle,
  getImageUrl,
  getActions,
  layout = "card",
  onBack,
  className = "",
  hideFullscreenButton = false,
}: GenericItemWithDataProps) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Load data from server action
  useEffect(() => {
    const fetchData = async () => {
      console.log("[GenericItemWithData] Starting to load data - dataType:", dataType, "itemId:", itemId, "type:", typeof itemId);
      setLoading(true);
      setError(null);
      try {
        const result = await loadItemData(dataType, itemId);
        console.log("[GenericItemWithData] Server action result:", result);
        if (result.success) {
          console.log("[GenericItemWithData] Item data loaded:", result.data);
          setItem(result.data);
        } else {
          console.error("[GenericItemWithData] Failed to load:", result.error);
          setError(result.error || "Failed to load data");
        }
      } catch (err) {
        console.error("[GenericItemWithData] Error:", err);
        setError("An error occurred while loading data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType, itemId]);

  // Group fields by section
  const sections = fields.reduce((acc, field) => {
    const section = field.section || "default";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {} as Record<string, ItemField<any>[]>);

  const renderFieldValue = (field: ItemField<any>) => {
    if (!item) return null;
    const value = field.getValue(item);
    const rendered = field.render ? field.render(value, item) : value;

    if (field.badge) {
      return (
        <span
          className="field-badge"
          style={{ background: field.badgeColor || "#667eea" }}
        >
          {rendered}
        </span>
      );
    }

    return <div className="field-value">{rendered}</div>;
  };

  const getVariantClass = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "danger":
        return "btn-danger";
      case "success":
        return "btn-success";
      default:
        return "btn-primary";
    }
  };

  const renderCardLayout = () => {
    if (!item) return null;
    const title = getTitle?.(item);
    const subtitle = getSubtitle?.(item);
    const imageUrl = getImageUrl?.(item);

    return (
      <div className="item-card">
        {imageUrl && (
          <div className="item-image-container">
            <img src={imageUrl} alt={title || "Item"} className="item-image" />
          </div>
        )}

        <div className="item-card-body">
          {(title || subtitle) && (
            <div className="item-header">
              {title && <h2 className="item-title">{title}</h2>}
              {subtitle && <p className="item-subtitle">{subtitle}</p>}
            </div>
          )}

          <div className="item-fields">
            {Object.entries(sections).map(([section, sectionFields]) => (
              <div key={section} className="field-section">
                {section !== "default" && <h4 className="section-title">{section}</h4>}
                <div className="field-grid">
                  {sectionFields.map((field) => (
                    <div
                      key={field.key}
                      className={`field-item ${field.highlight ? "highlight" : ""} span-${field.span || 1}`}
                    >
                      <label className="field-label">{field.label}</label>
                      {renderFieldValue(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPanelLayout = () => {
    if (!item) return null;
    const title = getTitle?.(item);
    const subtitle = getSubtitle?.(item);
    const imageUrl = getImageUrl?.(item);
    const actions = getActions?.(item);

    return (
      <div className="item-panel">
        <div className="panel-header">
          <div className="panel-header-left">
            {imageUrl && <img src={imageUrl} alt={title || "Item"} className="panel-image" />}
            <div>
              {title && <h2 className="item-title">{title}</h2>}
              {subtitle && <p className="item-subtitle">{subtitle}</p>}
            </div>
          </div>

          {actions && actions.length > 0 && (
            <div className="panel-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`action-btn ${getVariantClass(action.variant)}`}
                  disabled={action.disabled}
                >
                  {action.icon && <span className="action-icon">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel-body">
          {Object.entries(sections).map(([section, sectionFields]) => (
            <div key={section} className="field-section">
              {section !== "default" && <h4 className="section-title">{section}</h4>}
              <div className="field-list">
                {sectionFields.map((field) => (
                  <div
                    key={field.key}
                    className={`field-row ${field.highlight ? "highlight" : ""}`}
                  >
                    <label className="field-label">{field.label}</label>
                    {renderFieldValue(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetailsLayout = () => {
    if (!item) return null;
    const title = getTitle?.(item);
    const subtitle = getSubtitle?.(item);
    const imageUrl = getImageUrl?.(item);

    return (
      <div className="item-details">
        {(title || subtitle || imageUrl) && (
          <div className="details-header">
            {imageUrl && (
              <div className="details-image-container">
                <img src={imageUrl} alt={title || "Item"} className="details-image" />
              </div>
            )}
            <div className="details-header-content">
              {title && <h1 className="details-title">{title}</h1>}
              {subtitle && <p className="details-subtitle">{subtitle}</p>}
            </div>
          </div>
        )}

        <div className="details-body">
          {Object.entries(sections).map(([section, sectionFields]) => (
            <div key={section} className="details-section">
              {section !== "default" && <h3 className="section-title">{section}</h3>}
              <div className="details-grid">
                {sectionFields.map((field) => (
                  <div
                    key={field.key}
                    className={`details-field ${field.highlight ? "highlight" : ""} span-${field.span || 1}`}
                  >
                    <label className="field-label">{field.label}</label>
                    {renderFieldValue(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`generic-item ${className}`}>
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading item details...</p>
        </div>
        <style jsx>
          {`
          .generic-item {
            width: 100%;
          }

          .back-button {
            margin-bottom: 16px;
            padding: 8px 16px;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .back-button:hover {
            background: #f9fafb;
            border-color: #9ca3af;
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 64px 24px;
            color: #6b7280;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
      <div className={`generic-item ${className}`}>
        {onBack && (
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
        )}
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
        <style jsx>
          {`
          .generic-item {
            width: 100%;
          }

          .back-button {
            margin-bottom: 16px;
            padding: 8px 16px;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .back-button:hover {
            background: #f9fafb;
            border-color: #9ca3af;
          }

          .error-state {
            padding: 48px 24px;
            text-align: center;
            color: #ef4444;
            font-weight: 500;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        `}
        </style>
      </div>
    );
  }

  const actions = item && getActions?.(item);

  return (
    <>
      <div className={`generic-item ${className}`}>
        {(onBack || !hideFullscreenButton) && (
          <div className="item-header-controls">
            {onBack && (
              <button onClick={onBack} className="back-button">
                ← Back
              </button>
            )}
            {!hideFullscreenButton && (
              <button
                className="fullscreen-button"
                onClick={() => setIsFullscreenOpen(true)}
                aria-label="Open in fullscreen"
                title="Open in fullscreen"
              >
                <svg
                  width="18"
                  height="18"
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

        {layout === "card" && renderCardLayout()}
        {layout === "panel" && renderPanelLayout()}
        {layout === "details" && renderDetailsLayout()}

        {actions && actions.length > 0 && layout !== "panel" && (
          <div className="item-actions">
            {actions.map((action: ItemAction, index: number) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`action-btn ${getVariantClass(action.variant)}`}
                disabled={action.disabled}
              >
                {action.icon && <span className="action-icon">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}

        <style jsx>
          {`
        .generic-item {
          width: 100%;
        }

        .item-header-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .back-button {
          padding: 8px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .fullscreen-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: auto;
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

        /* Card Layout */
        .item-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .item-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-card-body {
          padding: 24px;
        }

        .item-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .item-title {
          margin: 0 0 8px 0;
          font-size: 1.75rem;
          color: #1f2937;
          font-weight: 700;
        }

        .item-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        /* Panel Layout */
        .item-panel {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .panel-header {
          padding: 24px;
          background: linear-gradient(to bottom, #f9fafb, #ffffff);
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .panel-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .panel-image {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: cover;
        }

        .panel-body {
          padding: 24px;
        }

        .panel-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* Details Layout */
        .item-details {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .details-header {
          padding: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .details-image-container {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        .details-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details-title {
          margin: 0 0 8px 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .details-subtitle {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .details-body {
          padding: 32px;
        }

        /* Fields */
        .item-fields,
        .field-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .field-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }

        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .field-grid .span-2 {
          grid-column: span 2;
        }

        .field-grid .span-3 {
          grid-column: span 3;
        }

        .field-grid .span-4 {
          grid-column: span 4;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .details-section {
          margin-bottom: 32px;
        }

        .details-section:last-child {
          margin-bottom: 0;
        }

        .field-item,
        .field-row,
        .details-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-item.highlight,
        .field-row.highlight,
        .details-field.highlight {
          background: #f0f9ff;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          font-size: 0.95rem;
          color: #1f2937;
          word-break: break-word;
        }

        .field-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        /* Actions */
        .item-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 2px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #059669;
        }

        .action-icon {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .field-grid,
          .details-grid {
            grid-template-columns: 1fr;
          }

          .field-grid .span-2,
          .field-grid .span-3,
          .field-grid .span-4 {
            grid-column: span 1;
          }

          .panel-header {
            flex-direction: column;
          }

          .panel-header-left {
            width: 100%;
          }

          .panel-actions {
            width: 100%;
          }

          .action-btn {
            flex: 1;
          }

          .item-header-controls {
            flex-wrap: wrap;
          }

          .fullscreen-button {
            flex: 1;
            justify-content: center;
            margin-left: 0;
          }
        }
      `}
        </style>
      </div>

      <FullScreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        title={item && getTitle ? getTitle(item) : "Item Detail"}
      >
        <GenericItemWithData
          dataType={dataType}
          itemId={itemId}
          fields={fields}
          getTitle={getTitle}
          getSubtitle={getSubtitle}
          getImageUrl={getImageUrl}
          getActions={getActions}
          layout={layout}
          onBack={undefined}
          hideFullscreenButton={true}
        />
      </FullScreenModal>
    </>
  );
};

export default GenericItemWithData;
