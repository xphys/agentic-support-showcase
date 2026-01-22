'use client';

import React from 'react';

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
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** Is action disabled */
  disabled?: boolean;
}

export interface GenericItemProps<T = any> {
  /** The item to display */
  item: T;
  /** Configuration for fields to display */
  fields: ItemField<T>[];
  /** Optional title */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional image URL */
  imageUrl?: string;
  /** Actions/buttons */
  actions?: ItemAction[];
  /** Layout: 'card' | 'panel' | 'details' */
  layout?: 'card' | 'panel' | 'details';
  /** Back button handler */
  onBack?: () => void;
  /** Additional CSS class */
  className?: string;
}

const GenericItem = <T extends Record<string, any>>({
  item,
  fields,
  title,
  subtitle,
  imageUrl,
  actions,
  layout = 'card',
  onBack,
  className = '',
}: GenericItemProps<T>) => {
  // Group fields by section
  const sections = fields.reduce((acc, field) => {
    const section = field.section || 'default';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {} as Record<string, ItemField<T>[]>);

  const renderFieldValue = (field: ItemField<T>) => {
    const value = field.getValue(item);
    const rendered = field.render ? field.render(value, item) : value;

    if (field.badge) {
      return (
        <span
          className="field-badge"
          style={{ background: field.badgeColor || '#667eea' }}
        >
          {rendered}
        </span>
      );
    }

    return <div className="field-value">{rendered}</div>;
  };

  const getVariantClass = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'danger':
        return 'btn-danger';
      case 'success':
        return 'btn-success';
      default:
        return 'btn-primary';
    }
  };

  const renderCardLayout = () => (
    <div className="item-card">
      {imageUrl && (
        <div className="item-image-container">
          <img src={imageUrl} alt={title || 'Item'} className="item-image" />
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
              {section !== 'default' && (
                <h4 className="section-title">{section}</h4>
              )}
              <div className="field-grid">
                {sectionFields.map((field) => (
                  <div
                    key={field.key}
                    className={`field-item ${field.highlight ? 'highlight' : ''} span-${field.span || 1}`}
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

  const renderPanelLayout = () => (
    <div className="item-panel">
      <div className="panel-header">
        <div className="panel-header-left">
          {imageUrl && (
            <img src={imageUrl} alt={title || 'Item'} className="panel-image" />
          )}
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
            {section !== 'default' && (
              <h4 className="section-title">{section}</h4>
            )}
            <div className="field-list">
              {sectionFields.map((field) => (
                <div
                  key={field.key}
                  className={`field-row ${field.highlight ? 'highlight' : ''}`}
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

  const renderDetailsLayout = () => (
    <div className="item-details">
      {(title || subtitle || imageUrl) && (
        <div className="details-header">
          {imageUrl && (
            <div className="details-image-container">
              <img src={imageUrl} alt={title || 'Item'} className="details-image" />
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
            {section !== 'default' && (
              <h3 className="section-title">{section}</h3>
            )}
            <div className="details-grid">
              {sectionFields.map((field) => (
                <div
                  key={field.key}
                  className={`details-field ${field.highlight ? 'highlight' : ''} span-${field.span || 1}`}
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

  return (
    <div className={`generic-item ${className}`}>
      {onBack && (
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
      )}

      {layout === 'card' && renderCardLayout()}
      {layout === 'panel' && renderPanelLayout()}
      {layout === 'details' && renderDetailsLayout()}

      {actions && actions.length > 0 && layout !== 'panel' && (
        <div className="item-actions">
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

      <style jsx>{`
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
        }
      `}</style>
    </div>
  );
};

export default GenericItem;
