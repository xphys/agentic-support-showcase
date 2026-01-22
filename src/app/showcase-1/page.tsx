"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import { useFrontendTool } from "@copilotkit/react-core";
import { Container, Grid } from "@mantine/core";
import { useState } from "react";
import DynamicComponentWindow from "../components/DynamicComponentWindow";
import GenericList, { ListColumn, ListConfig } from "../components/generic/GenericList";
import GenericForm, { FormField } from "../components/generic/GenericForm";
import GenericItem, { ItemAction, ItemField } from "../components/generic/GenericItem";

type AnimationType = "fade" | "slide" | "scale" | "flip";
type ComponentType = "list" | "form" | "item" | "demo";
type DataType = "products" | "users" | "employees" | "orders" | "custom";

interface DisplayState {
  component: React.ReactNode;
  type: ComponentType;
  dataType: DataType;
}

export default function HomePage() {
  const [animationType, setAnimationType] = useState<AnimationType>("fade");
  const [displayState, setDisplayState] = useState<DisplayState>({
    component: (
      <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
        <h2>Ask the AI to show you different components!</h2>
        <p style={{ marginTop: "1rem" }}>Try: "Show me a product list" or "Display a user form"</p>
      </div>
    ),
    type: "demo",
    dataType: "products",
  });

  // State to track current list items for navigation
  const [currentListData, setCurrentListData] = useState<
    {
      items: any[];
      dataType: DataType;
      layout?: string;
    } | null
  >(null);

  // Mockup data generators
  const generateMockProducts = () => [
    { id: 1, name: "Laptop Pro 15", category: "Electronics", price: 1299.99, stock: 45, inStock: true, rating: 4.5 },
    { id: 2, name: "Wireless Mouse", category: "Accessories", price: 29.99, stock: 8, inStock: true, rating: 4.2 },
    { id: 3, name: "USB-C Hub", category: "Accessories", price: 49.99, stock: 0, inStock: false, rating: 4.7 },
    { id: 4, name: "4K Monitor", category: "Electronics", price: 399.99, stock: 23, inStock: true, rating: 4.8 },
    { id: 5, name: "Mechanical Keyboard", category: "Accessories", price: 149.99, stock: 15, inStock: true, rating: 4.6 },
  ];

  const generateMockUsers = () => [
    { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", role: "Admin", department: "IT", active: true, joinDate: "2023-01-15" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", role: "Manager", department: "Sales", active: true, joinDate: "2023-03-20" },
    { id: 3, firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", role: "Developer", department: "Engineering", active: true, joinDate: "2022-11-05" },
    { id: 4, firstName: "Alice", lastName: "Williams", email: "alice.williams@example.com", role: "Designer", department: "Marketing", active: false, joinDate: "2023-06-10" },
  ];

  const generateMockEmployees = () => [
    { id: 1, name: "Sarah Connor", position: "CEO", salary: 250000, experience: 15, status: "active" },
    { id: 2, name: "Kyle Reese", position: "CTO", salary: 200000, experience: 12, status: "active" },
    { id: 3, name: "John Connor", position: "Lead Developer", salary: 150000, experience: 8, status: "active" },
    { id: 4, name: "Ellen Ripley", position: "Security Lead", salary: 140000, experience: 10, status: "vacation" },
  ];

  const generateMockOrders = () => [
    { id: 1001, customer: "Acme Corp", product: "Enterprise License", amount: 5999.99, status: "completed", date: "2024-01-15" },
    { id: 1002, customer: "TechStart Inc", product: "Starter Package", amount: 999.99, status: "pending", date: "2024-01-18" },
    { id: 1003, customer: "Global Systems", product: "Premium Support", amount: 2499.99, status: "processing", date: "2024-01-20" },
    { id: 1004, customer: "Innovation Labs", product: "Custom Solution", amount: 12999.99, status: "completed", date: "2024-01-22" },
  ];

  // Helper function to show item detail
  const showItemDetail = (
    item: any,
    dataType: DataType,
    layout?: string,
    backToList?: { items: any[]; dataType: DataType; layout?: string },
  ) => {
    let fields: ItemField<any>[] = [];
    let actions: ItemAction[] = [];
    let title = "";
    let subtitle = "";

    switch (dataType) {
      case "products":
        title = item.name;
        fields = [
          { key: "name", label: "Product Name", getValue: (i) => i.name, highlight: true, span: 2 },
          { key: "category", label: "Category", getValue: (i) => i.category, section: "Basic Info" },
          { key: "price", label: "Price", getValue: (i) => i.price, render: (v) => `$${v.toFixed(2)}`, section: "Basic Info" },
          { key: "stock", label: "Stock", getValue: (i) => i.stock, section: "Inventory" },
          { key: "rating", label: "Rating", getValue: (i) => i.rating, render: (v) => `${v} / 5 ⭐`, section: "Reviews" },
        ];
        actions = [
          { label: "Edit", icon: "✏️", variant: "primary", onClick: () => alert("Edit product") },
          { label: "Delete", icon: "🗑️", variant: "danger", onClick: () => alert("Delete product") },
        ];
        break;

      case "users":
        title = `${item.firstName} ${item.lastName}`;
        subtitle = item.role;
        fields = [
          { key: "name", label: "Full Name", getValue: (i) => `${i.firstName} ${i.lastName}`, highlight: true, span: 2 },
          { key: "email", label: "Email", getValue: (i) => i.email, section: "Contact" },
          { key: "role", label: "Role", getValue: (i) => i.role, badge: true, badgeColor: "#667eea", section: "Work Info" },
          { key: "department", label: "Department", getValue: (i) => i.department, section: "Work Info" },
          { key: "joinDate", label: "Join Date", getValue: (i) => i.joinDate, render: (v) => new Date(v).toLocaleDateString(), section: "Work Info" },
        ];
        actions = [
          { label: "Edit Profile", icon: "✏️", variant: "primary", onClick: () => alert("Edit user") },
          { label: "Reset Password", icon: "🔑", variant: "secondary", onClick: () => alert("Reset password") },
        ];
        break;

      case "employees":
        title = item.name;
        subtitle = item.position;
        fields = [
          { key: "name", label: "Name", getValue: (i) => i.name, highlight: true, span: 2 },
          { key: "position", label: "Position", getValue: (i) => i.position, section: "Position" },
          { key: "salary", label: "Salary", getValue: (i) => i.salary, render: (v) => `$${v.toLocaleString()}`, section: "Compensation" },
          { key: "experience", label: "Experience", getValue: (i) => i.experience, render: (v) => `${v} years`, section: "Experience" },
        ];
        break;

      case "orders":
        title = `Order #${item.id}`;
        fields = [
          { key: "id", label: "Order ID", getValue: (i) => `#${i.id}`, highlight: true },
          { key: "customer", label: "Customer", getValue: (i) => i.customer, section: "Details" },
          { key: "product", label: "Product", getValue: (i) => i.product, section: "Details" },
          { key: "amount", label: "Amount", getValue: (i) => i.amount, render: (v) => `$${v.toFixed(2)}`, section: "Payment" },
          { key: "date", label: "Date", getValue: (i) => i.date, section: "Timeline" },
        ];
        break;
    }

    const component = (
      <GenericItem
        item={item}
        fields={fields}
        title={title}
        subtitle={subtitle}
        actions={actions}
        layout={layout as any || "panel"}
        onBack={backToList
          ? () => {
            // Navigate back to the list
            generateList(backToList.items, backToList.dataType, backToList.layout);
          }
          : undefined}
      />
    );

    setDisplayState({ component, type: "item", dataType });
  };

  // Helper function to generate list with item click handler
  const generateList = (items: any[], dataType: DataType, layout?: string) => {
    let config: ListConfig<any>;
    let title = "";

    const handleItemClick = (item: any) => {
      showItemDetail(item, dataType, layout, { items, dataType, layout });
    };

    switch (dataType) {
      case "products":
        title = "Product Catalog";
        config = {
          columns: [
            { key: "name", label: "Product", getValue: (i) => i.name, sortable: true },
            { key: "category", label: "Category", getValue: (i) => i.category, sortable: true },
            { key: "price", label: "Price", getValue: (i) => i.price, render: (v) => `$${v.toFixed(2)}`, sortable: true },
            { key: "stock", label: "Stock", getValue: (i) => i.stock, sortable: true },
          ],
          getItemKey: (i) => i.id,
          getItemStatus: (i) => ({ label: i.inStock ? "In Stock" : "Out of Stock", color: i.inStock ? "#10b981" : "#ef4444" }),
          searchable: true,
          searchFields: ["name", "category"],
          showNumbers: true,
          onItemClick: handleItemClick,
        };
        break;

      case "users":
        title = "User Directory";
        config = {
          columns: [
            { key: "name", label: "Name", getValue: (i) => `${i.firstName} ${i.lastName}`, sortable: true },
            { key: "email", label: "Email", getValue: (i) => i.email },
            { key: "role", label: "Role", getValue: (i) => i.role, sortable: true },
            { key: "department", label: "Department", getValue: (i) => i.department, sortable: true },
          ],
          getItemKey: (i) => i.id,
          getItemStatus: (i) => ({ label: i.active ? "Active" : "Inactive", color: i.active ? "#10b981" : "#6b7280" }),
          searchable: true,
          showNumbers: true,
          onItemClick: handleItemClick,
        };
        break;

      case "employees":
        title = "Employee Directory";
        config = {
          columns: [
            { key: "name", label: "Name", getValue: (i) => i.name, sortable: true },
            { key: "position", label: "Position", getValue: (i) => i.position, sortable: true },
            { key: "salary", label: "Salary", getValue: (i) => i.salary, render: (v) => `$${v.toLocaleString()}`, sortable: true },
            { key: "experience", label: "Experience", getValue: (i) => i.experience, render: (v) => `${v} years`, sortable: true },
          ],
          getItemKey: (i) => i.id,
          getItemStatus: (i) => ({ label: i.status, color: i.status === "active" ? "#10b981" : "#f59e0b" }),
          searchable: true,
          onItemClick: handleItemClick,
        };
        break;

      case "orders":
        title = "Order Management";
        config = {
          columns: [
            { key: "id", label: "Order ID", getValue: (i) => i.id, sortable: true },
            { key: "customer", label: "Customer", getValue: (i) => i.customer, sortable: true },
            { key: "product", label: "Product", getValue: (i) => i.product },
            { key: "amount", label: "Amount", getValue: (i) => i.amount, render: (v) => `$${v.toFixed(2)}`, sortable: true },
            { key: "date", label: "Date", getValue: (i) => i.date, sortable: true },
          ],
          getItemKey: (i) => i.id,
          getItemStatus: (i) => {
            const statusColors: any = { completed: "#10b981", pending: "#f59e0b", processing: "#3b82f6" };
            return { label: i.status, color: statusColors[i.status] };
          },
          searchable: true,
          onItemClick: handleItemClick,
        };
        break;

      default:
        return;
    }

    const component = <GenericList items={items} config={config} title={title} layout={layout as any || "table"} />;
    setDisplayState({ component, type: "list", dataType });
    setCurrentListData({ items, dataType, layout });
  };

  useFrontendTool({
    name: "displayComponent",
    description: "Display a generic component (list, form, or item detail) with mockup data. Use this to show the user different data visualizations and forms.",
    parameters: [
      {
        name: "componentType",
        type: "string",
        description: "Type of component to display: 'list' (data table/grid), 'form' (input form), or 'item' (detail view)",
        required: true,
      },
      {
        name: "dataType",
        type: "string",
        description: "Type of data to display: 'products', 'users', 'employees', 'orders'",
        required: true,
      },
      {
        name: "layout",
        type: "string",
        description: "Layout style: for list use 'table', 'grid', or 'list'; for item use 'card', 'panel', or 'details'",
        required: false,
      },
    ],
    async handler({ componentType, dataType, layout }) {
      console.log(" === handler ===");

      const compType = componentType as ComponentType;
      const dType = dataType as DataType;

      let component: React.ReactNode = null;

      // Simulate 2 second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate appropriate component based on parameters
      if (compType === "list") {
        let items: any[] = [];
        switch (dType) {
          case "products":
            items = generateMockProducts();
            break;
          case "users":
            items = generateMockUsers();
            break;
          case "employees":
            items = generateMockEmployees();
            break;
          case "orders":
            items = generateMockOrders();
            break;
        }
        generateList(items, dType, layout);
        component = true as any; // Flag to indicate component was set
      } else if (compType === "form") {
        switch (dType) {
          case "products":
            const productFields: FormField[] = [
              { name: "name", label: "Product Name", type: "text", required: true, placeholder: "Enter product name" },
              {
                name: "category",
                label: "Category",
                type: "select",
                required: true,
                options: [
                  { label: "Electronics", value: "electronics" },
                  { label: "Accessories", value: "accessories" },
                ],
              },
              { name: "price", label: "Price", type: "number", required: true, min: 0.01, step: 0.01 },
              { name: "stock", label: "Stock Quantity", type: "number", required: true, min: 0 },
              { name: "description", label: "Description", type: "textarea", rows: 4 },
            ];
            component = <GenericForm fields={productFields} onSubmit={(data) => console.log("Product submitted:", data)} title="Add New Product" submitText="Create Product" showSuccessMessage />;
            break;

          case "users":
            const userFields: FormField[] = [
              { name: "firstName", label: "First Name", type: "text", required: true },
              { name: "lastName", label: "Last Name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              {
                name: "role",
                label: "Role",
                type: "radio",
                required: true,
                options: [
                  { label: "Admin", value: "admin" },
                  { label: "Manager", value: "manager" },
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
                ],
              },
            ];
            component = <GenericForm fields={userFields} onSubmit={(data) => console.log("User submitted:", data)} title="Create User Account" submitText="Create User" showSuccessMessage />;
            break;

          case "employees":
            const empFields: FormField[] = [
              { name: "name", label: "Full Name", type: "text", required: true },
              { name: "position", label: "Position", type: "text", required: true },
              { name: "salary", label: "Annual Salary", type: "number", required: true, min: 0 },
              { name: "experience", label: "Years of Experience", type: "number", required: true, min: 0, max: 50 },
              { name: "startDate", label: "Start Date", type: "date", required: true },
            ];
            component = <GenericForm fields={empFields} onSubmit={(data) => console.log("Employee submitted:", data)} title="Add Employee" submitText="Add Employee" showSuccessMessage />;
            break;

          case "orders":
            const orderFields: FormField[] = [
              { name: "customer", label: "Customer Name", type: "text", required: true },
              {
                name: "product",
                label: "Product",
                type: "select",
                required: true,
                options: [
                  { label: "Enterprise License", value: "enterprise" },
                  { label: "Starter Package", value: "starter" },
                ],
              },
              { name: "amount", label: "Amount", type: "number", required: true, min: 0.01, step: 0.01 },
              { name: "orderDate", label: "Order Date", type: "date", required: true },
              { name: "notes", label: "Notes", type: "textarea", rows: 3 },
            ];
            component = <GenericForm fields={orderFields} onSubmit={(data) => console.log("Order submitted:", data)} title="Create Order" submitText="Place Order" showSuccessMessage />;
            break;
        }
      } else if (compType === "item") {
        let item: any;
        switch (dType) {
          case "products":
            item = generateMockProducts()[0];
            break;
          case "users":
            item = generateMockUsers()[0];
            break;
          case "employees":
            item = generateMockEmployees()[0];
            break;
          case "orders":
            item = generateMockOrders()[0];
            break;
        }
        showItemDetail(item, dType, layout);
        component = true as any; // Flag to indicate component was set
      }

      if (component) {
        // For list and item, the state is already set by helper functions
        // For form, we need to set it here
        if (compType === "form" && component !== true) {
          setDisplayState({ component, type: compType, dataType: dType });
        }
        return { success: true, componentType: compType, dataType: dType, layout: layout || "default" };
      }

      return { success: false, error: "Invalid component or data type" };
    },
    render: ({ args, result }) => {
      console.log(" === render ===");
      return (
        <div style={{ padding: "16px", background: "#f0f9ff", borderRadius: "8px", border: "2px solid #3b82f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>🤖</span>
            <strong style={{ color: "#1e40af" }}>AI is generating component...</strong>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#1e40af" }}>
            Type: <strong>{args.componentType}</strong> | Data: <strong>{args.dataType}</strong>
            {args.layout && (
              <span>
                | Layout: <strong>{args.layout}</strong>
              </span>
            )}
          </div>
        </div>
      );
    },
  });

  return (
    <Container size="xl" style={{ height: "100vh", padding: 0 }}>
      <Grid gutter={0} style={{ height: "100%" }}>
        <Grid.Col span={6} style={{ padding: "2rem", overflowY: "auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "1.75rem", color: "#1f2937" }}>
              AI-Powered Generic Components
            </h1>
            <p style={{ margin: "0 0 16px 0", color: "#6b7280", fontSize: "0.95rem" }}>
              Chat with AI to dynamically generate components with any data
            </p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: "8px 12px",
                  background: "#f0fdf4",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  border: "1px solid #86efac",
                }}
              >
                <strong>Current:</strong> {displayState.type} - {displayState.dataType}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>
                Animation:
              </span>
              {(["fade", "slide", "scale", "flip"] as AnimationType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setAnimationType(type)}
                  className={`animation-button ${animationType === type ? "active" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Component Window - AI Controlled */}
          <DynamicComponentWindow
            component={displayState.component}
            animationType={animationType}
            animationDuration={400}
            height="calc(100vh - 200px)"
          />
        </Grid.Col>
        <Grid.Col span={6} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <div className="chat-container">
            <CopilotChat />
          </div>
        </Grid.Col>
      </Grid>

      <style jsx>
        {`
        .animation-button {
          padding: 6px 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          text-transform: capitalize;
        }

        .animation-button:hover {
          border-color: #9ca3af;
          background: #f9fafb;
        }

        .animation-button.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
      `}
      </style>
    </Container>
  );
}
