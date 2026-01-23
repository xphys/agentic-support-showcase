"use client";

import React, { useState } from "react";
import GenericItemWithData, { ItemField, ItemAction } from "../../components/generic/GenericItemWithData";

export default function GenericItemWithDataExample() {
  const [selectedLayout, setSelectedLayout] = useState<"card" | "panel" | "details">("card");

  const fields: ItemField<any>[] = [
    {
      key: "email",
      label: "Email",
      getValue: (item) => item.email,
      section: "Contact Info"
    },
    {
      key: "phone",
      label: "Phone",
      getValue: (item) => item.phone,
      section: "Contact Info"
    },
    {
      key: "role",
      label: "Role",
      getValue: (item) => item.role,
      badge: true,
      badgeColor: "#8b5cf6",
      section: "Professional Info"
    },
    {
      key: "department",
      label: "Department",
      getValue: (item) => item.department,
      section: "Professional Info"
    },
    {
      key: "joinDate",
      label: "Join Date",
      getValue: (item) => item.joinDate,
      section: "Professional Info"
    },
    {
      key: "bio",
      label: "Bio",
      getValue: (item) => item.bio,
      span: 4,
      section: "About"
    }
  ];

  const getActions = (item: any): ItemAction[] => [
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
    },
    {
      label: "Edit Profile",
      onClick: () => alert("Edit mode activated"),
      icon: "✏️",
      variant: "success"
    }
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "800",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "12px"
      }}>
        GenericItemWithData Example
      </h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "1.1rem" }}>
        Display a single item fetched from server with dynamic layouts
      </p>

      {/* Layout Selector */}
      <div style={{ marginBottom: "32px", display: "flex", gap: "12px" }}>
        <button
          onClick={() => setSelectedLayout("card")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: selectedLayout === "card" ? "2px solid #6366f1" : "2px solid #e2e8f0",
            background: selectedLayout === "card" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "white",
            color: selectedLayout === "card" ? "white" : "#64748b",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Card Layout
        </button>
        <button
          onClick={() => setSelectedLayout("panel")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: selectedLayout === "panel" ? "2px solid #6366f1" : "2px solid #e2e8f0",
            background: selectedLayout === "panel" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "white",
            color: selectedLayout === "panel" ? "white" : "#64748b",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Panel Layout
        </button>
        <button
          onClick={() => setSelectedLayout("details")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: selectedLayout === "details" ? "2px solid #6366f1" : "2px solid #e2e8f0",
            background: selectedLayout === "details" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "white",
            color: selectedLayout === "details" ? "white" : "#64748b",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Details Layout
        </button>
      </div>

      {/* GenericItemWithData Component */}
      <GenericItemWithData
        dataType="users"
        itemId={1}
        fields={fields}
        getTitle={(item) => item.name}
        getSubtitle={(item) => `${item.role} at ${item.department}`}
        getImageUrl={(item) => item.avatar}
        getActions={getActions}
        layout={selectedLayout}
      />
    </div>
  );
}
