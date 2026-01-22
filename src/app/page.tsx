"use client";

import { useFrontendTool } from "@copilotkit/react-core";
import { Container, Grid, SegmentedControl } from "@mantine/core";
import { useState } from "react";
import StackDynamicComponentWindow from "./components/StackDynamicComponentWindow";
import GenericListWithData, { ListConfig } from "./components/generic/GenericListWithData";
import GenericItemWithData, { ItemAction, ItemField } from "./components/generic/GenericItemWithData";
import GenericForm, { FormField } from "./components/generic/GenericForm";
import { DataType } from "./actions/dataActions";
import { CustomCopilotChat } from "./components/CustomCopilotChat";

type AnimationType = "fade" | "slide" | "scale" | "flip";
type ComponentType = "list" | "form" | "item" | "demo";

interface DisplayState {
  component: React.ReactNode;
  type: ComponentType;
  dataType: DataType | "custom";
}

export default function HomePage() {
  const [animationType, setAnimationType] = useState<AnimationType>("fade");
  const [displayState, setDisplayState] = useState<DisplayState>({
    component: (
      <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
        <h2>Ask the AI to show you different components!</h2>
        <p style={{ marginTop: "1rem" }}>
          Try: "Show me products" or "Display user list" or "Show me order #1001"
        </p>
      </div>
    ),
    type: "demo",
    dataType: "products",
  });

  // Config generators for different data types
  const getListConfig = (dataType: DataType, handleItemClick: (itemId: string | number) => void): ListConfig<any> => {
    switch (dataType) {
      case "products":
        return {
          columns: [
            { key: "name", label: "Product", getValue: (i) => i.name, sortable: true },
            { key: "category", label: "Category", getValue: (i) => i.category, sortable: true },
            { key: "price", label: "Price", getValue: (i) => i.price, render: (v) => v != null ? `$${v.toFixed(2)}` : "N/A", sortable: true },
            { key: "stock", label: "Stock", getValue: (i) => i.stock, sortable: true },
          ],
          getItemKey: (i) => i.id,
          getItemStatus: (i) => ({ label: i.inStock ? "In Stock" : "Out of Stock", color: i.inStock ? "#10b981" : "#ef4444" }),
          searchable: true,
          searchFields: ["name", "category"],
          showNumbers: true,
          onItemClick: handleItemClick,
        };

      case "users":
        return {
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

      case "employees":
        return {
          columns: [
            { key: "name", label: "Name", getValue: (i) => i.name, sortable: true },
            { key: "position", label: "Position", getValue: (i) => i.position, sortable: true },
            { key: "salary", label: "Salary", getValue: (i) => i.salary, render: (v) => v != null ? `$${v.toLocaleString()}` : "N/A", sortable: true },
            { key: "experience", label: "Experience", getValue: (i) => i.experience, render: (v) => v != null ? `${v} years` : "N/A", sortable: true },
          ],
          getItemKey: (i) => i.id,
          getItemStatus: (i) => ({ label: i.status, color: i.status === "active" ? "#10b981" : "#f59e0b" }),
          searchable: true,
          onItemClick: handleItemClick,
        };

      case "orders":
        return {
          columns: [
            { key: "id", label: "Order ID", getValue: (i) => i.id, sortable: true },
            { key: "customer", label: "Customer", getValue: (i) => i.customer, sortable: true },
            { key: "product", label: "Product", getValue: (i) => i.product },
            { key: "amount", label: "Amount", getValue: (i) => i.amount, render: (v) => v != null ? `$${v.toFixed(2)}` : "N/A", sortable: true },
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
    }
  };

  const getItemFields = (dataType: DataType): ItemField<any>[] => {
    switch (dataType) {
      case "products":
        return [
          { key: "name", label: "Product Name", getValue: (i) => i.name, highlight: true, span: 2 },
          { key: "category", label: "Category", getValue: (i) => i.category, section: "Basic Info" },
          { key: "price", label: "Price", getValue: (i) => i.price, render: (v) => v != null ? `$${v.toFixed(2)}` : "N/A", section: "Basic Info" },
          { key: "stock", label: "Stock", getValue: (i) => i.stock, section: "Inventory" },
          { key: "rating", label: "Rating", getValue: (i) => i.rating, render: (v) => v != null ? `${v} / 5 ⭐` : "N/A", section: "Reviews" },
        ];

      case "users":
        return [
          { key: "name", label: "Full Name", getValue: (i) => `${i.firstName} ${i.lastName}`, highlight: true, span: 2 },
          { key: "email", label: "Email", getValue: (i) => i.email, section: "Contact" },
          { key: "role", label: "Role", getValue: (i) => i.role, badge: true, badgeColor: "#667eea", section: "Work Info" },
          { key: "department", label: "Department", getValue: (i) => i.department, section: "Work Info" },
          { key: "joinDate", label: "Join Date", getValue: (i) => i.joinDate, render: (v) => v ? new Date(v).toLocaleDateString() : "N/A", section: "Work Info" },
        ];

      case "employees":
        return [
          { key: "name", label: "Name", getValue: (i) => i.name, highlight: true, span: 2 },
          { key: "position", label: "Position", getValue: (i) => i.position, section: "Position" },
          { key: "salary", label: "Salary", getValue: (i) => i.salary, render: (v) => v != null ? `$${v.toLocaleString()}` : "N/A", section: "Compensation" },
          { key: "experience", label: "Experience", getValue: (i) => i.experience, render: (v) => v != null ? `${v} years` : "N/A", section: "Experience" },
        ];

      case "orders":
        return [
          { key: "id", label: "Order ID", getValue: (i) => `#${i.id}`, highlight: true },
          { key: "customer", label: "Customer", getValue: (i) => i.customer, section: "Details" },
          { key: "product", label: "Product", getValue: (i) => i.product, section: "Details" },
          { key: "amount", label: "Amount", getValue: (i) => i.amount, render: (v) => v != null ? `$${v.toFixed(2)}` : "N/A", section: "Payment" },
          { key: "date", label: "Date", getValue: (i) => i.date, section: "Timeline" },
        ];
    }
  };

  const getItemActions = (dataType: DataType): (item: any) => ItemAction[] => {
    switch (dataType) {
      case "products":
        return () => [
          { label: "Edit", icon: "✏️", variant: "primary", onClick: () => alert("Edit product") },
          { label: "Delete", icon: "🗑️", variant: "danger", onClick: () => alert("Delete product") },
        ];

      case "users":
        return () => [
          { label: "Edit Profile", icon: "✏️", variant: "primary", onClick: () => alert("Edit user") },
          { label: "Reset Password", icon: "🔑", variant: "secondary", onClick: () => alert("Reset password") },
        ];

      case "employees":
      case "orders":
        return () => [];
    }
  };

  const getItemTitle = (dataType: DataType): (item: any) => string => {
    switch (dataType) {
      case "products":
        return (item) => item.name;
      case "users":
        return (item) => `${item.firstName} ${item.lastName}`;
      case "employees":
        return (item) => item.name;
      case "orders":
        return (item) => `Order #${item.id}`;
    }
  };

  const getItemSubtitle = (dataType: DataType): ((item: any) => string) | undefined => {
    switch (dataType) {
      case "users":
        return (item) => item.role;
      case "employees":
        return (item) => item.position;
      default:
        return undefined;
    }
  };

  const getTitles = (dataType: DataType) => {
    switch (dataType) {
      case "products":
        return { list: "Product Catalog", form: "Add New Product" };
      case "users":
        return { list: "User Directory", form: "Create User Account" };
      case "employees":
        return { list: "Employee Directory", form: "Add Employee" };
      case "orders":
        return { list: "Order Management", form: "Create Order" };
    }
  };

  // Show list
  const showList = (dataType: DataType, layout?: string) => {
    const titles = getTitles(dataType);

    const handleItemClick = (itemId: string | number) => {
      console.log("[page.tsx] handleItemClick - dataType:", dataType, "itemId:", itemId, "type:", typeof itemId);
      // Show item detail with back navigation data
      showItem(dataType, itemId, layout, { dataType, layout });
    };

    const config = getListConfig(dataType, handleItemClick);
    const component = (
      <GenericListWithData
        dataType={dataType}
        config={config}
        title={titles.list}
        layout={layout as any || "table"}
      />
    );

    setDisplayState({ component, type: "list", dataType });
  };

  // Show item detail
  const showItem = (
    dataType: DataType,
    itemId: string | number,
    layout?: string,
    backToList?: { dataType: DataType; layout?: string },
  ) => {
    const fields = getItemFields(dataType);
    const getActions = getItemActions(dataType);
    const getTitle = getItemTitle(dataType);
    const getSubtitle = getItemSubtitle(dataType);

    const component = (
      <GenericItemWithData
        dataType={dataType}
        itemId={itemId}
        fields={fields}
        getTitle={getTitle}
        getSubtitle={getSubtitle}
        getActions={getActions}
        layout={layout as any || "panel"}
        onBack={backToList
          ? () => {
            // Navigate back to the list
            showList(backToList.dataType, backToList.layout);
          }
          : undefined}
      />
    );

    setDisplayState({ component, type: "item", dataType });
  };

  useFrontendTool({
    name: "displayComponent",
    description:
      "Display a generic component (list, form, or item detail). Use this when the user wants to view or manage data. AI extracts parameters from conversation but does NOT provide actual data.",
    parameters: [
      {
        name: "componentType",
        type: "string",
        description: "Type of component to display: 'list' (show multiple items), 'form' (create new item), or 'item' (show single item detail)",
        required: true,
      },
      {
        name: "dataType",
        type: "string",
        description: "Type of data: 'products', 'users', 'employees', 'orders'",
        required: true,
      },
      {
        name: "itemId",
        type: "string",
        description: "Item ID for 'item' component type (e.g., '1', '1001'). Only required when componentType is 'item'.",
        required: false,
      },
      {
        name: "layout",
        type: "string",
        description: "Layout style: for list use 'table', 'grid', or 'list'; for item use 'card', 'panel', or 'details'",
        required: false,
      },
    ],
    async handler({ componentType, dataType, itemId, layout }) {
      console.log(" === handler ===", { componentType, dataType, itemId, layout });

      const compType = componentType as ComponentType;
      const dType = dataType as DataType;

      // Simulate brief delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (compType === "list") {
        showList(dType, layout);
        return { success: true, componentType: compType, dataType: dType, layout: layout || "table" };
      } else if (compType === "item") {
        if (!itemId) {
          return { success: false, error: "itemId is required for item component" };
        }
        showItem(dType, itemId, layout);
        return { success: true, componentType: compType, dataType: dType, itemId, layout: layout || "panel" };
      } else if (compType === "form") {
        // Form implementation (keeping simple for now)
        const titles = getTitles(dType);
        let fields: FormField[] = [];

        switch (dType) {
          case "products":
            fields = [
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
            ];
            break;
            // Add more cases as needed
        }

        const component = <GenericForm fields={fields} onSubmit={(data) => console.log("Submitted:", data)} title={titles.form} submitText="Submit" showSuccessMessage />;
        setDisplayState({ component, type: "form", dataType: dType });
        return { success: true, componentType: compType, dataType: dType };
      }

      return { success: false, error: "Invalid component type" };
    },
    render: ({ args, result }) => {
      return (<h1>Loading component...</h1>)
      return (
        <div style={{ padding: "16px", background: "#f0f9ff", borderRadius: "8px", border: "2px solid #3b82f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>🤖</span>
            <strong style={{ color: "#1e40af" }}>Loading component...</strong>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#1e40af" }}>
            Type: <strong>{args.componentType}</strong> | Data: <strong>{args.dataType}</strong>
            {args.itemId && (
              <span>
                | ID: <strong>{args.itemId}</strong>
              </span>
            )}
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
        <Grid.Col span={8} style={{ padding: "2rem", overflowY: "auto" }}>
          <Container
            fluid
            px={12}
            py={6}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "1.25rem",
              background: "#f3f4f6",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
              minHeight: 48,
              flexWrap: "wrap",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontWeight: 600,
                  color: "#1f2937",
                  fontSize: "1rem",
                  marginRight: "8px",
                }}
              >
                Space
              </span>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "0.95rem",
                  marginRight: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ opacity: 0.75 }}>Current:</span>
                <span style={{
                  fontWeight: 500,
                  background: "#f0fdf4",
                  borderRadius: "4px",
                  padding: "2px 7px",
                  fontSize: "0.85rem",
                  border: "1px solid #bbf7d0",
                  color: "#16a34a"
                }}>
                  {displayState.type} - {displayState.dataType}
                </span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 80, marginLeft: "auto" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: 500,
                  marginRight: "4px",
                }}
              >
                Animation:
              </span>
              <SegmentedControl
                value={animationType}
                onChange={(val) => setAnimationType(val as AnimationType)}
                data={[
                  { label: "Fade", value: "fade" },
                  { label: "Slide", value: "slide" },
                  { label: "Scale", value: "scale" },
                  { label: "Flip", value: "flip" },
                ]}
                size="sm"
                transitionDuration={200}
              />
            </div>
          </Container>

          <StackDynamicComponentWindow
            component={displayState.component}
            animationType={animationType}
            animationDuration={400}
            height="calc(100vh - 200px)"
          />
        </Grid.Col>
        <Grid.Col span={4} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <CustomCopilotChat />
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
