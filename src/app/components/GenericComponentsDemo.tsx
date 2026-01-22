"use client";

import React, { useState } from "react";
import GenericList, { ListColumn, ListConfig } from "./GenericList";
import GenericForm, { FormField } from "./GenericForm";
import GenericItem, { ItemAction, ItemField } from "./GenericItem";

// Sample data types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "available" | "low_stock" | "out_of_stock";
  description: string;
  rating: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  active: boolean;
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Laptop Pro 15",
    category: "Electronics",
    price: 1299.99,
    stock: 45,
    status: "available",
    description: "High-performance laptop with 15-inch display",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    category: "Accessories",
    price: 29.99,
    stock: 8,
    status: "low_stock",
    description: "Ergonomic wireless mouse with 6 buttons",
    rating: 4.2,
  },
  {
    id: 3,
    name: "USB-C Hub",
    category: "Accessories",
    price: 49.99,
    stock: 0,
    status: "out_of_stock",
    description: "7-in-1 USB-C hub with multiple ports",
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Monitor 27"',
    category: "Electronics",
    price: 399.99,
    stock: 23,
    status: "available",
    description: "4K UHD monitor with HDR support",
    rating: 4.8,
  },
];

const sampleUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Admin",
    department: "IT",
    joinDate: "2023-01-15",
    active: true,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    department: "Sales",
    joinDate: "2023-03-20",
    active: true,
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    role: "Developer",
    department: "Engineering",
    joinDate: "2022-11-05",
    active: false,
  },
];

type DemoView = "product-list" | "user-list" | "product-form" | "user-form" | "product-item" | "user-item";

const GenericComponentsDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<DemoView>("product-list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Product List Configuration
  const productColumns: ListColumn<Product>[] = [
    {
      key: "name",
      label: "Product Name",
      getValue: (item) => item.name,
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      getValue: (item) => item.category,
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      getValue: (item) => item.price,
      render: (value) => `$${value.toFixed(2)}`,
      sortable: true,
    },
    {
      key: "stock",
      label: "Stock",
      getValue: (item) => item.stock,
      sortable: true,
    },
  ];

  const productListConfig: ListConfig<Product> = {
    columns: productColumns,
    getItemKey: (item) => item.id,
    onItemClick: (item) => {
      setSelectedProduct(item);
      setCurrentView("product-item");
    },
    getItemStatus: (item) => {
      const statusMap = {
        available: { label: "Available", color: "#10b981" },
        low_stock: { label: "Low Stock", color: "#f59e0b" },
        out_of_stock: { label: "Out of Stock", color: "#ef4444" },
      };
      return statusMap[item.status];
    },
    showNumbers: true,
    searchable: true,
    searchFields: ["name", "category"],
  };

  // User List Configuration
  const userColumns: ListColumn<User>[] = [
    {
      key: "name",
      label: "Name",
      getValue: (item) => `${item.firstName} ${item.lastName}`,
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      getValue: (item) => item.email,
    },
    {
      key: "role",
      label: "Role",
      getValue: (item) => item.role,
      sortable: true,
    },
    {
      key: "department",
      label: "Department",
      getValue: (item) => item.department,
      sortable: true,
    },
  ];

  const userListConfig: ListConfig<User> = {
    columns: userColumns,
    getItemKey: (item) => item.id,
    onItemClick: (item) => {
      setSelectedUser(item);
      setCurrentView("user-item");
    },
    getItemStatus: (item) => ({
      label: item.active ? "Active" : "Inactive",
      color: item.active ? "#10b981" : "#6b7280",
    }),
    searchable: true,
    searchFields: ["firstName", "lastName", "email", "department"],
  };

  // Product Form Configuration
  const productFormFields: FormField[] = [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Accessories", value: "accessories" },
        { label: "Furniture", value: "furniture" },
        { label: "Office Supplies", value: "office_supplies" },
      ],
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "0.00",
      required: true,
      min: 0.01,
      step: 0.01,
      helpText: "Enter price in USD",
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      placeholder: "0",
      required: true,
      min: 0,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter product description",
      required: true,
      rows: 4,
      maxLength: 500,
    },
    {
      name: "features",
      label: "Features",
      type: "checkbox",
      options: [
        { label: "Free Shipping", value: "free_shipping" },
        { label: "Warranty Included", value: "warranty" },
        { label: "Eco-Friendly", value: "eco_friendly" },
      ],
    },
  ];

  // User Form Configuration
  const userFormFields: FormField[] = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "John",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john.doe@example.com",
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "radio",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Developer", value: "developer" },
        { label: "User", value: "user" },
      ],
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      required: true,
      options: [
        { label: "IT", value: "it" },
        { label: "Sales", value: "sales" },
        { label: "Engineering", value: "engineering" },
        { label: "Marketing", value: "marketing" },
      ],
    },
    {
      name: "joinDate",
      label: "Join Date",
      type: "date",
      required: true,
    },
  ];

  // Product Item Configuration
  const productItemFields: ItemField<Product>[] = [
    {
      key: "name",
      label: "Product Name",
      getValue: (item) => item.name,
      highlight: true,
      span: 2,
    },
    {
      key: "category",
      label: "Category",
      getValue: (item) => item.category,
      section: "Basic Information",
    },
    {
      key: "price",
      label: "Price",
      getValue: (item) => item.price,
      render: (value) => `$${value.toFixed(2)}`,
      section: "Basic Information",
    },
    {
      key: "stock",
      label: "Stock",
      getValue: (item) => item.stock,
      section: "Inventory",
    },
    {
      key: "status",
      label: "Status",
      getValue: (item) => item.status,
      render: (value) => {
        const statusColors = {
          available: "#10b981",
          low_stock: "#f59e0b",
          out_of_stock: "#ef4444",
        };
        const color = statusColors[value as keyof typeof statusColors] || "#6b7280";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "white",
              background: color,
              textTransform: "uppercase",
            }}
          >
            {value.replace("_", " ")}
          </span>
        );
      },
      section: "Inventory",
    },
    {
      key: "description",
      label: "Description",
      getValue: (item) => item.description,
      span: 2,
      section: "Details",
    },
    {
      key: "rating",
      label: "Rating",
      getValue: (item) => item.rating,
      render: (value) => `${value} / 5 ⭐`,
      section: "Details",
    },
  ];

  const productActions: ItemAction[] = [
    {
      label: "Edit",
      icon: "✏️",
      variant: "primary",
      onClick: () => alert("Edit product functionality"),
    },
    {
      label: "Delete",
      icon: "🗑️",
      variant: "danger",
      onClick: () => alert("Delete product functionality"),
    },
  ];

  // User Item Configuration
  const userItemFields: ItemField<User>[] = [
    {
      key: "name",
      label: "Full Name",
      getValue: (item) => `${item.firstName} ${item.lastName}`,
      highlight: true,
      span: 2,
    },
    {
      key: "email",
      label: "Email",
      getValue: (item) => item.email,
      section: "Contact Information",
    },
    {
      key: "role",
      label: "Role",
      getValue: (item) => item.role,
      badge: true,
      badgeColor: "#667eea",
      section: "Work Information",
    },
    {
      key: "department",
      label: "Department",
      getValue: (item) => item.department,
      section: "Work Information",
    },
    {
      key: "joinDate",
      label: "Join Date",
      getValue: (item) => item.joinDate,
      render: (value) => new Date(value).toLocaleDateString(),
      section: "Work Information",
    },
    {
      key: "status",
      label: "Status",
      getValue: (item) => item.active,
      render: (value) => {
        const color = value ? "#10b981" : "#6b7280";
        const label = value ? "Active" : "Inactive";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "white",
              background: color,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        );
      },
      section: "Account Status",
    },
  ];

  const userActions: ItemAction[] = [
    {
      label: "Edit Profile",
      icon: "✏️",
      variant: "primary",
      onClick: () => alert("Edit user functionality"),
    },
    {
      label: "Reset Password",
      icon: "🔑",
      variant: "secondary",
      onClick: () => alert("Reset password functionality"),
    },
  ];

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully! Check console for data.");
  };

  const renderContent = () => {
    switch (currentView) {
      case "product-list":
        return (
          <GenericList
            items={sampleProducts}
            config={productListConfig}
            title="Product Catalog"
            description="Browse and manage products"
            layout="table"
          />
        );

      case "user-list":
        return (
          <GenericList
            items={sampleUsers}
            config={userListConfig}
            title="User Directory"
            description="View and manage users"
            layout="grid"
          />
        );

      case "product-form":
        return (
          <GenericForm
            fields={productFormFields}
            onSubmit={handleFormSubmit}
            title="Add New Product"
            description="Fill in the product details"
            submitText="Create Product"
            cancelText="Cancel"
            onCancel={() => setCurrentView("product-list")}
            showSuccessMessage
          />
        );

      case "user-form":
        return (
          <GenericForm
            fields={userFormFields}
            onSubmit={handleFormSubmit}
            title="Add New User"
            description="Enter user information"
            submitText="Create User"
            cancelText="Cancel"
            onCancel={() => setCurrentView("user-list")}
            showSuccessMessage
            layout="vertical"
          />
        );

      case "product-item":
        return selectedProduct
          ? (
            <GenericItem
              item={selectedProduct}
              fields={productItemFields}
              title={selectedProduct.name}
              subtitle={selectedProduct.category}
              actions={productActions}
              layout="panel"
              onBack={() => setCurrentView("product-list")}
            />
          )
          : null;

      case "user-item":
        return selectedUser
          ? (
            <GenericItem
              item={selectedUser}
              fields={userItemFields}
              title={`${selectedUser.firstName} ${selectedUser.lastName}`}
              subtitle={selectedUser.role}
              actions={userActions}
              layout="card"
              onBack={() => setCurrentView("user-list")}
            />
          )
          : null;

      default:
        return null;
    }
  };

  return (
    <div className="generic-demo">
      <div className="demo-controls">
        <div className="control-group">
          <span className="control-label">Products:</span>
          <button
            onClick={() => setCurrentView("product-list")}
            className={`demo-btn ${currentView === "product-list" ? "active" : ""}`}
          >
            📋 List
          </button>
          <button
            onClick={() => setCurrentView("product-form")}
            className={`demo-btn ${currentView === "product-form" ? "active" : ""}`}
          >
            ➕ Form
          </button>
        </div>

        <div className="control-group">
          <span className="control-label">Users:</span>
          <button
            onClick={() => setCurrentView("user-list")}
            className={`demo-btn ${currentView === "user-list" ? "active" : ""}`}
          >
            👥 List
          </button>
          <button
            onClick={() => setCurrentView("user-form")}
            className={`demo-btn ${currentView === "user-form" ? "active" : ""}`}
          >
            ➕ Form
          </button>
        </div>
      </div>

      <div className="demo-content">{renderContent()}</div>

      <style jsx>
        {`
        .generic-demo {
          width: 100%;
        }

        .demo-controls {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .demo-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
        }

        .demo-btn:hover {
          border-color: #667eea;
          background: #f9fafb;
        }

        .demo-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .demo-content {
          min-height: 400px;
        }
      `}
      </style>
    </div>
  );
};

export default GenericComponentsDemo;
