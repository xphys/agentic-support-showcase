"use client";

import React, { useState } from "react";
import GenericListWithData, { ListColumn, ListConfig } from "../../components/generic/GenericListWithData";
import GenericItemWithData, { ItemField } from "../../components/generic/GenericItemWithData";

export default function GenericListWithDataExample() {
  const [selectedLayout, setSelectedLayout] = useState<"grid" | "table" | "list">("grid");

  const columns: ListColumn<any>[] = [
    {
      key: "name",
      label: "Name",
      getValue: (user) => user.name,
      sortable: true
    },
    {
      key: "email",
      label: "Email",
      getValue: (user) => user.email,
      sortable: true
    },
    {
      key: "role",
      label: "Role",
      getValue: (user) => user.role,
      sortable: true
    },
    {
      key: "department",
      label: "Department",
      getValue: (user) => user.department,
      sortable: true
    },
    {
      key: "joinDate",
      label: "Join Date",
      getValue: (user) => user.joinDate,
      render: (date: string) => new Date(date).toLocaleDateString(),
      sortable: true
    }
  ];

  const config: ListConfig<any> = {
    columns,
    getItemKey: (user) => user.id,
    getItemStatus: (user) => {
      const statusMap: Record<string, { label: string; color: string }> = {
        active: { label: "Active", color: "#10b981" },
        inactive: { label: "Inactive", color: "#ef4444" },
        pending: { label: "Pending", color: "#f59e0b" }
      };
      return statusMap[user.status] || statusMap.active;
    },
    showNumbers: true,
    searchable: true,
    searchFields: ["name", "email", "role", "department"]
  };

  // User detail fields for internal navigation
  const userFields: ItemField<any>[] = [
    {
      key: "email",
      label: "Email",
      getValue: (user) => user.email,
      section: "Contact"
    },
    {
      key: "phone",
      label: "Phone",
      getValue: (user) => user.phone,
      section: "Contact"
    },
    {
      key: "role",
      label: "Role",
      getValue: (user) => user.role,
      badge: true,
      badgeColor: "#667eea",
      section: "Professional"
    },
    {
      key: "department",
      label: "Department",
      getValue: (user) => user.department,
      section: "Professional"
    },
    {
      key: "joinDate",
      label: "Join Date",
      getValue: (user) => user.joinDate,
      render: (date: string) => new Date(date).toLocaleDateString(),
      section: "Professional"
    },
    {
      key: "bio",
      label: "Bio",
      getValue: (user) => user.bio,
      span: 4,
      section: "About"
    }
  ];

  const renderUserView = (user: any, onBack: () => void) => (
    <GenericItemWithData
      dataType="users"
      itemId={user.id}
      fields={userFields}
      getTitle={(item) => item.name}
      getSubtitle={(item) => `${item.role} at ${item.department}`}
      getImageUrl={(item) => item.avatar}
      layout="panel"
      onBack={onBack}
      getActions={(item) => [
        {
          label: "Send Email",
          onClick: () => alert(`Sending email to ${item.email}`),
          icon: "✉️",
          variant: "primary"
        },
        {
          label: "Call",
          onClick: () => alert(`Calling ${item.phone}`),
          icon: "📞",
          variant: "secondary"
        }
      ]}
    />
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "800",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "12px"
      }}>
        GenericListWithData Example
      </h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "1.1rem" }}>
        Display server-fetched lists with search, sort, and internal navigation
      </p>

      {/* Layout Selector */}
      <div style={{ marginBottom: "32px", display: "flex", gap: "12px" }}>
        <button
          onClick={() => setSelectedLayout("grid")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: selectedLayout === "grid" ? "2px solid #6366f1" : "2px solid #e2e8f0",
            background: selectedLayout === "grid" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "white",
            color: selectedLayout === "grid" ? "white" : "#64748b",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Grid Layout
        </button>
        <button
          onClick={() => setSelectedLayout("table")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: selectedLayout === "table" ? "2px solid #6366f1" : "2px solid #e2e8f0",
            background: selectedLayout === "table" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "white",
            color: selectedLayout === "table" ? "white" : "#64748b",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Table Layout
        </button>
        <button
          onClick={() => setSelectedLayout("list")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: selectedLayout === "list" ? "2px solid #6366f1" : "2px solid #e2e8f0",
            background: selectedLayout === "list" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "white",
            color: selectedLayout === "list" ? "white" : "#64748b",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          List Layout
        </button>
      </div>

      {/* List with Internal Navigation */}
      <GenericListWithData
        dataType="users"
        config={config}
        title="Team Directory"
        description="Data loaded from server. Click on any user to view their profile."
        layout={selectedLayout}
        renderItemView={renderUserView}
      />
    </div>
  );
}
