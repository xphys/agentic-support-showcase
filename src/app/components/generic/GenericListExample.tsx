'use client';

import React from 'react';
import GenericList, { ListColumn, ListConfig } from './GenericList';
import GenericItem, { ItemField, ItemAction } from './GenericItem';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  description: string;
  rating: number;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro 15',
    category: 'Electronics',
    price: 1299.99,
    stock: 45,
    status: 'available',
    description: 'High-performance laptop with 15-inch display',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 29.99,
    stock: 8,
    status: 'low_stock',
    description: 'Ergonomic wireless mouse with 6 buttons',
    rating: 4.2,
  },
];

const GenericListExample: React.FC = () => {
  // List configuration
  const productColumns: ListColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      getValue: (item) => item.name,
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      getValue: (item) => item.category,
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
      key: 'stock',
      label: 'Stock',
      getValue: (item) => item.stock,
      sortable: true,
    },
  ];

  const productListConfig: ListConfig<Product> = {
    columns: productColumns,
    getItemKey: (item) => item.id,
    getItemStatus: (item) => {
      const statusMap = {
        available: { label: 'Available', color: '#10b981' },
        low_stock: { label: 'Low Stock', color: '#f59e0b' },
        out_of_stock: { label: 'Out of Stock', color: '#ef4444' },
      };
      return statusMap[item.status];
    },
    showNumbers: true,
    searchable: true,
    searchFields: ['name', 'category'],
  };

  // Item view configuration
  const productItemFields: ItemField<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      getValue: (item) => item.name,
      highlight: true,
      span: 2,
    },
    {
      key: 'category',
      label: 'Category',
      getValue: (item) => item.category,
      section: 'Basic Information',
    },
    {
      key: 'price',
      label: 'Price',
      getValue: (item) => item.price,
      render: (value) => `$${value.toFixed(2)}`,
      section: 'Basic Information',
    },
    {
      key: 'description',
      label: 'Description',
      getValue: (item) => item.description,
      span: 2,
      section: 'Details',
    },
    {
      key: 'rating',
      label: 'Rating',
      getValue: (item) => item.rating,
      render: (value) => `${value} / 5 ⭐`,
      section: 'Details',
    },
  ];

  const productActions: ItemAction[] = [
    {
      label: 'Edit',
      icon: '✏️',
      variant: 'primary',
      onClick: () => alert('Edit product functionality'),
    },
    {
      label: 'Delete',
      icon: '🗑️',
      variant: 'danger',
      onClick: () => alert('Delete product functionality'),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>GenericList with Internal Navigation Example</h1>
      <p>Click on any product to see its details within the same component</p>

      <GenericList
        items={sampleProducts}
        config={productListConfig}
        title="Product Catalog"
        description="Browse and manage products"
        layout="table"
        renderItemView={(item, onBack) => (
          <GenericItem
            item={item}
            fields={productItemFields}
            title={item.name}
            subtitle={item.category}
            actions={productActions}
            layout="panel"
            onBack={onBack}
          />
        )}
      />
    </div>
  );
};

export default GenericListExample;
