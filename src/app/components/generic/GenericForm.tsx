"use client";

import React, { useEffect, useState } from "react";
import FullScreenModal from "../FullScreenModal";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  /** Unique field name/key */
  name: string;
  /** Display label */
  label: string;
  /** Field type */
  type: FieldType;
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  defaultValue?: any;
  /** Is field required */
  required?: boolean;
  /** Validation pattern (regex string) */
  pattern?: string;
  /** Min value (for numbers/dates) */
  min?: number | string;
  /** Max value (for numbers/dates) */
  max?: number | string;
  /** Min length (for text) */
  minLength?: number;
  /** Max length (for text) */
  maxLength?: number;
  /** Options for select/radio */
  options?: FieldOption[];
  /** Help text */
  helpText?: string;
  /** Custom validation function */
  validate?: (value: any) => string | null;
  /** Field is disabled */
  disabled?: boolean;
  /** Number of rows for textarea */
  rows?: number;
  /** Multiple selection (for select/file) */
  multiple?: boolean;
  /** Step for number input */
  step?: number;
  /** Custom CSS class */
  className?: string;
}

export interface GenericFormProps {
  /** Array of field configurations */
  fields: FormField[];
  /** Form submission handler */
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  /** Optional initial data */
  initialData?: Record<string, any>;
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text (if provided, shows cancel button) */
  cancelText?: string;
  /** Cancel handler */
  onCancel?: () => void;
  /** Show success message after submit */
  showSuccessMessage?: boolean;
  /** Custom success message */
  successMessage?: string;
  /** Layout: vertical or horizontal */
  layout?: "vertical" | "horizontal";
  /** Additional CSS class */
  className?: string;
  /** Hide fullscreen button (when already in fullscreen mode) */
  hideFullscreenButton?: boolean;
}

const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  title,
  description,
  submitText = "Submit",
  cancelText,
  onCancel,
  showSuccessMessage = false,
  successMessage = "Form submitted successfully!",
  layout = "vertical",
  className = "",
  hideFullscreenButton = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.name] = initialData[field.name] ?? field.defaultValue ?? "";
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
      return `${field.label} is required`;
    }

    if (field.validate) {
      return field.validate(value);
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return `${field.label} format is invalid`;
      }
    }

    if (field.minLength && value && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `${field.label} must be at most ${field.maxLength} characters`;
    }

    if (field.min !== undefined && value < field.min) {
      return `${field.label} must be at least ${field.min}`;
    }

    if (field.max !== undefined && value > field.max) {
      return `${field.label} must be at most ${field.max}`;
    }

    return null;
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);

      if (showSuccessMessage) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          // Reset form
          const initial: Record<string, any> = {};
          fields.forEach((field) => {
            initial[field.name] = field.defaultValue ?? "";
          });
          setFormData(initial);
        }, 2000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? "";
    const error = errors[field.name];

    const commonProps = {
      id: field.name,
      name: field.name,
      disabled: field.disabled || isSubmitting,
      required: field.required,
      className: `form-control ${error ? "error" : ""}`,
    };

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );

      case "select":
        return (
          <select
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            multiple={field.multiple}
          >
            {!field.required && <option value="">Select an option</option>}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="checkbox-group">
            {field.options?.map((option) => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const currentValue = Array.isArray(value) ? value : [];
                    const newValue = checked ? [...currentValue, option.value] : currentValue.filter((v) => v !== option.value);
                    handleChange(field.name, newValue);
                  }}
                  disabled={field.disabled || isSubmitting}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="radio-group">
            {field.options?.map((option) => (
              <label key={option.value} className="radio-label">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={field.disabled || isSubmitting}
                  required={field.required}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "file":
        return (
          <input
            {...commonProps}
            type="file"
            onChange={(e) => handleChange(field.name, e.target.files)}
            multiple={field.multiple}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            minLength={field.minLength}
            maxLength={field.maxLength}
            step={field.step}
            pattern={field.pattern}
          />
        );
    }
  };

  if (submitted && showSuccessMessage) {
    return (
      <div className="generic-form-success">
        <div className="success-icon">✓</div>
        <h4>{successMessage}</h4>
      </div>
    );
  }

  return (
    <>
      <div className={`generic-form ${layout} ${className}`}>
        {(title || description || !hideFullscreenButton) && (
          <div className="form-header">
            <div className="header-content">
              {title && <h3>{title}</h3>}
              {description && <p className="description">{description}</p>}
            </div>
            {!hideFullscreenButton && (
              <button
                type="button"
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

        <form onSubmit={handleSubmit} className="form-body">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`form-group ${field.className || ""}`}
            >
              <label htmlFor={field.name} className="form-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>

              {renderField(field)}

              {field.helpText && !errors[field.name] && <small className="help-text">{field.helpText}</small>}

              {errors[field.name] && <small className="error-text">{errors[field.name]}</small>}
            </div>
          ))}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : submitText}
            </button>

            {cancelText && onCancel && (
              <button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {cancelText}
              </button>
            )}
          </div>
        </form>

        <style jsx>
          {`
        .generic-form {
          width: 100%;
          max-width: 600px;
        }

        .form-header {
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .header-content {
          flex: 1;
        }

        .form-header h3 {
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

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .generic-form.horizontal .form-group {
          flex-direction: row;
          align-items: flex-start;
        }

        .generic-form.horizontal .form-label {
          width: 200px;
          padding-top: 12px;
          flex-shrink: 0;
        }

        .generic-form.horizontal .form-group > div {
          flex: 1;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .required {
          color: #ef4444;
          margin-left: 4px;
        }

        .form-control {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-control.error {
          border-color: #ef4444;
        }

        .form-control.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-control:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        textarea.form-control {
          resize: vertical;
          min-height: 100px;
        }

        select.form-control {
          cursor: pointer;
        }

        .checkbox-group,
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-label,
        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #374151;
        }

        .checkbox-label input,
        .radio-label input {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }

        .help-text {
          color: #6b7280;
          font-size: 0.8rem;
          margin-top: -4px;
        }

        .error-text {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: -4px;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .btn-submit,
        .btn-cancel {
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          flex: 1;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: white;
          color: #374151;
          border: 2px solid #d1d5db;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .generic-form-success {
          text-align: center;
          padding: 48px 24px;
          animation: fadeIn 0.3s ease-out;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 24px;
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .generic-form-success h4 {
          margin: 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .generic-form.horizontal .form-group {
            flex-direction: column;
          }

          .generic-form.horizontal .form-label {
            width: 100%;
            padding-top: 0;
          }

          .form-header {
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
        title={title || "Form"}
      >
        <GenericForm
          fields={fields}
          onSubmit={onSubmit}
          initialData={formData}
          title={undefined}
          description={description}
          submitText={submitText}
          cancelText={cancelText}
          onCancel={onCancel}
          showSuccessMessage={showSuccessMessage}
          successMessage={successMessage}
          layout={layout}
          hideFullscreenButton={true}
        />
      </FullScreenModal>
    </>
  );
};

export default GenericForm;
