# Generic Components Documentation

A collection of fully generic, reusable React components that work with any data structure through configuration. These components are perfect for building data-driven applications quickly without writing repetitive UI code.

## Components Overview

1. **GenericList** - Display lists of any data type with sorting, searching, and multiple layouts
2. **GenericForm** - Dynamic forms with runtime field generation and validation
3. **GenericItem** - Single item detail views with flexible field configuration
4. **DynamicComponentWindow** - Container with beautiful transition animations

## 1. GenericList

A flexible list component that can display any array of objects in grid, table, or list layouts.

### Features
- Multiple layout options (grid, table, list)
- Built-in search functionality
- Column sorting
- Item click handlers
- Status badges
- Fully typed with TypeScript

### Basic Usage

```typescript
import GenericList, { ListColumn, ListConfig } from './components/GenericList';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
  // ... more products
];

// Define columns
const columns: ListColumn<Product>[] = [
  {
    key: 'name',
    label: 'Product Name',
    getValue: (item) => item.name,
    sortable: true,
  },
  {
    key: 'price',
    label: 'Price',
    getValue: (item) => item.price,
    render: (value) => `$${value.toFixed(2)}`,
    sortable: true,
  },
  {
    key: 'category',
    label: 'Category',
    getValue: (item) => item.category,
  },
];

// Create configuration
const config: ListConfig<Product> = {
  columns,
  getItemKey: (item) => item.id,
  onItemClick: (item) => console.log('Clicked:', item),
  searchable: true,
  searchFields: ['name', 'category'],
  showNumbers: true,
};

// Render
<GenericList
  items={products}
  config={config}
  title="Product Catalog"
  layout="table"
/>
```

### Advanced Features

#### Custom Rendering
```typescript
{
  key: 'status',
  label: 'Status',
  getValue: (item) => item.status,
  render: (value) => (
    <span style={{ color: value === 'active' ? 'green' : 'red' }}>
      {value}
    </span>
  ),
}
```

#### Status Badges
```typescript
const config: ListConfig<Product> = {
  // ... other config
  getItemStatus: (item) => ({
    label: item.inStock ? 'In Stock' : 'Out of Stock',
    color: item.inStock ? '#10b981' : '#ef4444',
  }),
};
```

## 2. GenericForm

A dynamic form component that generates form fields at runtime based on configuration.

### Features
- 14+ field types (text, email, number, select, checkbox, radio, etc.)
- Built-in validation
- Custom validation functions
- Success messages
- Horizontal/vertical layouts
- TypeScript support

### Basic Usage

```typescript
import GenericForm, { FormField } from './components/GenericForm';

const fields: FormField[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'user@example.com',
    required: true,
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ],
  },
  {
    name: 'bio',
    label: 'Biography',
    type: 'textarea',
    rows: 4,
    helpText: 'Tell us about yourself',
  },
];

const handleSubmit = (data: Record<string, any>) => {
  console.log('Form data:', data);
  // Submit to API
};

<GenericForm
  fields={fields}
  onSubmit={handleSubmit}
  title="User Registration"
  submitText="Sign Up"
  showSuccessMessage
/>
```

### Field Types

All supported field types:
- `text`, `email`, `password`, `number`, `tel`, `url`
- `date`, `time`, `datetime-local`
- `textarea`
- `select` (single or multiple)
- `checkbox` (multiple options)
- `radio` (single option from many)
- `file` (single or multiple)

### Custom Validation

```typescript
{
  name: 'age',
  label: 'Age',
  type: 'number',
  required: true,
  validate: (value) => {
    if (value < 18) return 'Must be 18 or older';
    if (value > 100) return 'Invalid age';
    return null; // Valid
  },
}
```

### Initial Data

```typescript
const initialData = {
  username: 'john_doe',
  email: 'john@example.com',
  role: 'user',
};

<GenericForm
  fields={fields}
  onSubmit={handleSubmit}
  initialData={initialData}
/>
```

## 3. GenericItem

A component for displaying detailed information about a single item.

### Features
- Multiple layouts (card, panel, details)
- Field sections/grouping
- Custom rendering
- Action buttons
- Badge support
- Highlighted fields

### Basic Usage

```typescript
import GenericItem, { ItemField, ItemAction } from './components/GenericItem';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Developer',
  department: 'Engineering',
  joinDate: '2023-01-15',
};

const fields: ItemField<User>[] = [
  {
    key: 'name',
    label: 'Full Name',
    getValue: (item) => item.name,
    highlight: true,
  },
  {
    key: 'email',
    label: 'Email',
    getValue: (item) => item.email,
    section: 'Contact',
  },
  {
    key: 'role',
    label: 'Role',
    getValue: (item) => item.role,
    badge: true,
    badgeColor: '#667eea',
    section: 'Work Info',
  },
  {
    key: 'department',
    label: 'Department',
    getValue: (item) => item.department,
    section: 'Work Info',
  },
];

const actions: ItemAction[] = [
  {
    label: 'Edit',
    icon: '✏️',
    variant: 'primary',
    onClick: () => console.log('Edit user'),
  },
  {
    label: 'Delete',
    icon: '🗑️',
    variant: 'danger',
    onClick: () => console.log('Delete user'),
  },
];

<GenericItem
  item={user}
  fields={fields}
  title={user.name}
  subtitle={user.role}
  actions={actions}
  layout="card"
/>
```

### Layout Options

- **card**: Vertical card layout with image support
- **panel**: Horizontal panel with header actions
- **details**: Full-width detailed view with gradient header

### Field Sections

Group related fields together:

```typescript
const fields: ItemField<Product>[] = [
  { key: 'name', label: 'Name', getValue: (i) => i.name, section: 'Basic' },
  { key: 'price', label: 'Price', getValue: (i) => i.price, section: 'Basic' },
  { key: 'stock', label: 'Stock', getValue: (i) => i.stock, section: 'Inventory' },
  { key: 'warehouse', label: 'Location', getValue: (i) => i.warehouse, section: 'Inventory' },
];
```

## 4. DynamicComponentWindow

A container component that displays other components with smooth transition animations.

### Features
- 4 animation types (fade, slide, scale, flip)
- Configurable duration
- Optional title header
- Customizable dimensions

### Usage

```typescript
import DynamicComponentWindow from './components/DynamicComponentWindow';

const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(<ComponentA />);

<DynamicComponentWindow
  component={currentComponent}
  title="Dynamic Content"
  animationType="slide"
  animationDuration={400}
  height="600px"
  width="100%"
/>
```

When you change `currentComponent`, it will animate out the old component and animate in the new one.

## Complete Example: CRUD Application

Here's a complete example combining all components:

```typescript
import { useState } from 'react';
import GenericList from './components/GenericList';
import GenericForm from './components/GenericForm';
import GenericItem from './components/GenericItem';
import DynamicComponentWindow from './components/DynamicComponentWindow';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

function ProductManager() {
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([/* ... */]);

  // List configuration
  const listConfig = {
    columns: [
      { key: 'name', label: 'Name', getValue: (i) => i.name, sortable: true },
      { key: 'price', label: 'Price', getValue: (i) => i.price,
        render: (v) => `$${v}`, sortable: true },
    ],
    getItemKey: (item) => item.id,
    onItemClick: (item) => {
      setSelectedProduct(item);
      setView('detail');
    },
    searchable: true,
  };

  // Form fields
  const formFields = [
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true, min: 0 },
    { name: 'category', label: 'Category', type: 'select', required: true,
      options: [{ label: 'Electronics', value: 'electronics' }] },
  ];

  // Item fields
  const itemFields = [
    { key: 'name', label: 'Name', getValue: (i) => i.name, highlight: true },
    { key: 'price', label: 'Price', getValue: (i) => i.price,
      render: (v) => `$${v}` },
  ];

  const renderView = () => {
    switch (view) {
      case 'list':
        return <GenericList items={products} config={listConfig} />;
      case 'form':
        return <GenericForm fields={formFields}
          onSubmit={(data) => {
            // Add product
            setView('list');
          }} />;
      case 'detail':
        return selectedProduct && (
          <GenericItem item={selectedProduct} fields={itemFields}
            onBack={() => setView('list')} />
        );
    }
  };

  return (
    <div>
      <button onClick={() => setView('list')}>List</button>
      <button onClick={() => setView('form')}>Add New</button>

      <DynamicComponentWindow
        component={renderView()}
        animationType="fade"
      />
    </div>
  );
}
```

## TypeScript Support

All components are fully typed. Import types from:

```typescript
import type {
  ListColumn,
  ListConfig,
  GenericListProps,
  FormField,
  FieldOption,
  GenericFormProps,
  ItemField,
  ItemAction,
  GenericItemProps,
  DynamicComponentWindowProps,
} from './components/types';
```

## Best Practices

1. **Type Safety**: Always define your data interfaces and use them with the generic components
2. **Configuration Reuse**: Extract configurations into separate files for reusability
3. **Custom Rendering**: Use render functions for complex display logic
4. **Validation**: Use built-in validation first, then custom validators for complex rules
5. **Performance**: For large lists, consider pagination or virtual scrolling
6. **Accessibility**: Add proper ARIA labels when using custom render functions

## Styling

All components use CSS-in-JS with styled-jsx. To customize:

1. Use the `className` prop to add custom classes
2. Override CSS variables if needed
3. Use the `render` functions for inline styling

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- CSS Grid and Flexbox support required
