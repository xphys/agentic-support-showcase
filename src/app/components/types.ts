/**
 * Generic Components Type Definitions
 *
 * This file contains all type definitions for the generic components system.
 * These components are designed to work with any data structure through configuration.
 */

// ============================================
// GENERIC LIST TYPES
// ============================================

/**
 * Configuration for a single column in GenericList
 * @template T - The type of items in the list
 */
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

/**
 * Configuration object for GenericList
 * @template T - The type of items in the list
 */
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

/**
 * Props for GenericList component
 * @template T - The type of items in the list
 */
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

// ============================================
// GENERIC FORM TYPES
// ============================================

/**
 * Supported field types in GenericForm
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

/**
 * Option for select, radio, or checkbox fields
 */
export interface FieldOption {
  label: string;
  value: string | number;
}

/**
 * Configuration for a single form field
 */
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
  /** Options for select/radio/checkbox */
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

/**
 * Props for GenericForm component
 */
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
  layout?: 'vertical' | 'horizontal';
  /** Additional CSS class */
  className?: string;
}

// ============================================
// GENERIC ITEM TYPES
// ============================================

/**
 * Configuration for a single field in GenericItem
 * @template T - The type of the item
 */
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

/**
 * Configuration for an action button in GenericItem
 */
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

/**
 * Props for GenericItem component
 * @template T - The type of the item
 */
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

// ============================================
// DYNAMIC COMPONENT WINDOW TYPES
// ============================================

/**
 * Props for DynamicComponentWindow
 */
export interface DynamicComponentWindowProps {
  /** The component to render inside the window */
  component: React.ReactNode;
  /** Window title (optional) */
  title?: string;
  /** Animation type: 'fade', 'slide', 'scale', 'flip' */
  animationType?: 'fade' | 'slide' | 'scale' | 'flip';
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Window height */
  height?: string;
  /** Window width */
  width?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Helper type to ensure an object has an id field
 */
export type WithId<T> = T & { id: string | number };

/**
 * Helper type for objects with timestamps
 */
export type WithTimestamps<T> = T & {
  createdAt: Date | string;
  updatedAt: Date | string;
};

/**
 * Helper type for items with status
 */
export type WithStatus<T, S extends string = string> = T & {
  status: S;
};

// ============================================
// EXAMPLE USAGE
// ============================================

/**
 * Example: Product type with all common fields
 */
export interface ExampleProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: string;
}

/**
 * Example: User type with all common fields
 */
export interface ExampleUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  joinDate: string;
}
