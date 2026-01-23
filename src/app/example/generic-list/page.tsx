"use client";

import React, { useState } from "react";
import GenericList, { ListColumn, ListConfig } from "../../components/generic/GenericList";
import GenericItem, { ItemField } from "../../components/generic/GenericItem";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  avatar: string;
  phone: string;
  bio: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-01-15",
    avatar: "https://i.pravatar.cc/150?img=1",
    phone: "+1-555-0101",
    bio: "Passionate about building scalable systems"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Product Manager",
    department: "Product",
    status: "active",
    joinDate: "2021-06-20",
    avatar: "https://i.pravatar.cc/150?img=2",
    phone: "+1-555-0102",
    bio: "Focused on delivering user value"
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    role: "UX Designer",
    department: "Design",
    status: "inactive",
    joinDate: "2023-03-10",
    avatar: "https://i.pravatar.cc/150?img=3",
    phone: "+1-555-0103",
    bio: "Creating beautiful and intuitive experiences"
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-11-05",
    avatar: "https://i.pravatar.cc/150?img=4",
    phone: "+1-555-0104",
    bio: "Infrastructure automation enthusiast"
  },
  {
    id: 5,
    name: "Eve Davis",
    email: "eve@example.com",
    role: "Marketing Manager",
    department: "Marketing",
    status: "pending",
    joinDate: "2024-01-12",
    avatar: "https://i.pravatar.cc/150?img=5",
    phone: "+1-555-0105",
    bio: "Building brands and growing communities"
  }
];

export default function GenericListExample() {
  const [selectedLayout, setSelectedLayout] = useState<"grid" | "table" | "list">("grid");

  const columns: ListColumn<User>[] = [
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
      render: (date) => new Date(date).toLocaleDateString(),
      sortable: true
    }
  ];

  const config: ListConfig<User> = {
    columns,
    getItemKey: (user) => user.id,
    getItemStatus: (user) => {
      const statusMap = {
        active: { label: "Active", color: "#10b981" },
        inactive: { label: "Inactive", color: "#ef4444" },
        pending: { label: "Pending", color: "#f59e0b" }
      };
      return statusMap[user.status];
    },
    showNumbers: true,
    searchable: true,
    searchFields: ["name", "email", "role", "department"]
  };

  // For internal navigation example
  const userFields: ItemField<User>[] = [
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
      render: (date) => new Date(date).toLocaleDateString(),
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

  const renderUserView = (user: User, onBack: () => void) => (
    <GenericItem
      item={user}
      fields={userFields}
      title={user.name}
      subtitle={`${user.role} at ${user.department}`}
      imageUrl={user.avatar}
      layout="panel"
      onBack={onBack}
      actions={[
        {
          label: "Send Email",
          onClick: () => alert(`Sending email to ${user.email}`),
          icon: "✉️",
          variant: "primary"
        },
        {
          label: "Call",
          onClick: () => alert(`Calling ${user.phone}`),
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
        GenericList Examples
      </h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "1.1rem" }}>
        Display lists with search, sort, and multiple layouts
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

      {/* Basic List */}
      <section style={{ marginBottom: "64px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>
          Basic List with External Navigation
        </h2>
        <GenericList
          items={mockUsers}
          config={{
            ...config,
            onItemClick: (user) => alert(`Clicked on ${user.name}`)
          }}
          title="Team Members"
          description="Click on any user to view details"
          layout={selectedLayout}
        />
      </section>

      {/* List with Internal Navigation */}
      <section>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>
          List with Internal Navigation
        </h2>
        <GenericList
          items={mockUsers}
          config={config}
          title="Team Directory"
          description="Click on any user to view their profile within this component"
          layout={selectedLayout}
          renderItemView={renderUserView}
        />
      </section>
    </div>
  );
}
