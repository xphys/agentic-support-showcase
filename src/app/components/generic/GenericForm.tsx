"use client";

import React, { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  FileInput,
  Button,
  Stack,
  Box,
  Title,
  Text,
  Alert,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
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
      label: field.label,
      name: field.name,
      disabled: field.disabled || isSubmitting,
      required: field.required,
      error: error,
      description: field.helpText,
      withAsterisk: field.required,
    };

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            minRows={field.rows || 4}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            value={value}
            onChange={(val) => handleChange(field.name, val)}
            data={field.options?.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            })) || []}
            placeholder={field.placeholder || "Select an option"}
            clearable={!field.required}
          />
        );

      case "checkbox":
        return (
          <Checkbox.Group
            {...commonProps}
            value={Array.isArray(value) ? value.map(String) : []}
            onChange={(val) => handleChange(field.name, val)}
          >
            <Stack gap="sm">
              {field.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  value={String(option.value)}
                  label={option.label}
                />
              ))}
            </Stack>
          </Checkbox.Group>
        );

      case "radio":
        return (
          <Radio.Group
            {...commonProps}
            value={String(value)}
            onChange={(val) => handleChange(field.name, val)}
          >
            <Stack gap="sm">
              {field.options?.map((option) => (
                <Radio
                  key={option.value}
                  value={String(option.value)}
                  label={option.label}
                />
              ))}
            </Stack>
          </Radio.Group>
        );

      case "file":
        return (
          <FileInput
            {...commonProps}
            value={value}
            onChange={(file) => handleChange(field.name, file)}
            placeholder={field.placeholder || "Select file"}
            multiple={field.multiple}
          />
        );

      case "date":
        return (
          <DatePickerInput
            {...commonProps}
            value={value ? new Date(value) : null}
            onChange={(val: any) => {
              if (val instanceof Date) {
                handleChange(field.name, val.toISOString().split('T')[0]);
              } else {
                handleChange(field.name, val);
              }
            }}
            placeholder={field.placeholder}
            minDate={field.min ? new Date(field.min) : undefined}
            maxDate={field.max ? new Date(field.max) : undefined}
          />
        );

      case "time":
        return (
          <TimeInput
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "datetime-local":
        return (
          <DatePickerInput
            {...commonProps}
            value={value ? new Date(value) : null}
            onChange={(val: any) => {
              if (val instanceof Date) {
                handleChange(field.name, val.toISOString());
              } else {
                handleChange(field.name, val);
              }
            }}
            placeholder={field.placeholder}
            minDate={field.min ? new Date(field.min) : undefined}
            maxDate={field.max ? new Date(field.max) : undefined}
          />
        );

      case "email":
      case "password":
      case "tel":
      case "url":
        return (
          <TextInput
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );

      case "number":
        return (
          <TextInput
            {...commonProps}
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      default:
        return (
          <TextInput
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );
    }
  };

  if (submitted && showSuccessMessage) {
    return (
      <Alert
        variant="light"
        color="green"
        title="Success"
        radius="lg"
        styles={{
          root: {
            padding: "64px 32px",
            textAlign: "center",
          },
          title: {
            fontSize: "1.75rem",
            fontWeight: 800,
            justifyContent: "center",
          },
        }}
      >
        <Box style={{ fontSize: "3.5rem", marginBottom: "20px" }}>✓</Box>
        <Text size="lg" fw={600}>{successMessage}</Text>
      </Alert>
    );
  }

  return (
    <>
      <Box className={className} style={{ width: "100%", maxWidth: "600px" }}>
        {(title || description || !hideFullscreenButton) && (
          <Box
            style={{
              marginBottom: "32px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Box style={{ flex: 1 }}>
              {title && (
                <Title
                  order={3}
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "1.85rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #c026d3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {title}
                </Title>
              )}
              {description && (
                <Text c="dimmed" size="md" style={{ lineHeight: 1.6 }}>
                  {description}
                </Text>
              )}
            </Box>
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
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {fields.map((field) => (
              <Box key={field.name} className={field.className}>
                {renderField(field)}
              </Box>
            ))}

            <Box style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <Button
                type="submit"
                color="violet"
                size="md"
                disabled={isSubmitting}
                loading={isSubmitting}
                fullWidth
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                {submitText}
              </Button>

              {cancelText && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  color="violet"
                  size="md"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {cancelText}
                </Button>
              )}
            </Box>
          </Stack>
        </form>

        <style jsx>
          {`
        .fullscreen-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid rgba(124, 58, 237, 0.2);
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #7c3aed;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .fullscreen-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .fullscreen-button svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .fullscreen-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}
        </style>
      </Box>

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
