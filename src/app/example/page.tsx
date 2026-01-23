"use client";

import React from "react";
import Link from "next/link";

const examples = [
  {
    title: "GenericItem",
    description: "Display a single item with different layouts (card, panel, details)",
    path: "/example/generic-item",
    icon: "📄",
    features: ["Multiple layouts", "Custom fields", "Actions/buttons", "Sections support"]
  },
  {
    title: "GenericItemWithData",
    description: "Display a single item fetched from server with dynamic layouts",
    path: "/example/generic-item-with-data",
    icon: "🔄",
    features: ["Server-side data", "Loading states", "Error handling", "Fullscreen modal"]
  },
  {
    title: "GenericForm",
    description: "Dynamic forms with validation and custom layouts",
    path: "/example/generic-form",
    icon: "📝",
    features: ["Field validation", "Multiple input types", "Success messages", "Fullscreen support"]
  },
  {
    title: "GenericList",
    description: "Display lists with search, sort, and multiple layouts",
    path: "/example/generic-list",
    icon: "📋",
    features: ["Search & filter", "Sortable columns", "3 layout types", "Internal navigation"]
  },
  {
    title: "GenericListWithData",
    description: "Display server-fetched lists with search, sort, and navigation",
    path: "/example/generic-list-with-data",
    icon: "🌐",
    features: ["Server data loading", "Search & sort", "Internal navigation", "Fullscreen modal"]
  }
];

export default function ExamplesIndex() {
  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <header style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: "900",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "16px"
        }}>
          Generic Components Examples
        </h1>
        <p style={{
          fontSize: "1.25rem",
          color: "#64748b",
          maxWidth: "700px",
          margin: "0 auto",
          lineHeight: "1.8"
        }}>
          Explore comprehensive examples of all generic components with different configurations and use cases
        </p>
      </header>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: "32px"
      }}>
        {examples.map((example) => (
          <Link
            key={example.path}
            href={example.path}
            style={{
              textDecoration: "none",
              display: "block",
              background: "linear-gradient(135deg, #ffffff 0%, #fefeff 100%)",
              borderRadius: "20px",
              padding: "32px",
              border: "2px solid rgba(99, 102, 241, 0.1)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "#6366f1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.1)";
            }}
          >
            <div style={{
              fontSize: "3rem",
              marginBottom: "16px"
            }}>
              {example.icon}
            </div>

            <h2 style={{
              fontSize: "1.75rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "12px"
            }}>
              {example.title}
            </h2>

            <p style={{
              color: "#64748b",
              fontSize: "1rem",
              lineHeight: "1.7",
              marginBottom: "20px"
            }}>
              {example.description}
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "20px"
            }}>
              {example.features.map((feature, index) => (
                <span
                  key={index}
                  style={{
                    padding: "6px 14px",
                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#6366f1",
                    border: "1px solid rgba(99, 102, 241, 0.2)"
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>

            <div style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#6366f1",
              fontWeight: "700",
              fontSize: "0.95rem"
            }}>
              View Examples
              <span style={{ fontSize: "1.2rem" }}>→</span>
            </div>
          </Link>
        ))}
      </div>

      <footer style={{
        marginTop: "80px",
        padding: "40px",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        borderRadius: "20px",
        textAlign: "center",
        border: "2px solid rgba(148, 163, 184, 0.1)"
      }}>
        <h3 style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1f2937",
          marginBottom: "12px"
        }}>
          Component Features
        </h3>
        <p style={{
          color: "#64748b",
          fontSize: "1rem",
          lineHeight: "1.8",
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          All generic components support flexible configuration, multiple layouts, server-side data loading,
          search and filtering, fullscreen modals, and beautiful gradients. Build powerful UIs with minimal code!
        </p>
      </footer>
    </div>
  );
}
