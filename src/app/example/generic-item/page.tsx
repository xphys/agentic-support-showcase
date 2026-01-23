"use client";

import React from "react";
import GenericItem, { ItemField, ItemAction } from "../../components/generic/GenericItem";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  description: string;
  image: string;
  manufacturer: string;
  sku: string;
}

export default function GenericItemExample() {
  const product: Product = {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    category: "Electronics",
    stock: 45,
    rating: 4.5,
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    manufacturer: "AudioTech",
    sku: "WBH-2024-001"
  };

  const fields: ItemField<Product>[] = [
    {
      key: "price",
      label: "Price",
      getValue: (item) => item.price,
      render: (value) => `$${value.toFixed(2)}`,
      highlight: true,
      section: "Basic Info"
    },
    {
      key: "category",
      label: "Category",
      getValue: (item) => item.category,
      badge: true,
      badgeColor: "#667eea",
      section: "Basic Info"
    },
    {
      key: "stock",
      label: "Stock",
      getValue: (item) => item.stock,
      render: (value) => `${value} units`,
      section: "Basic Info"
    },
    {
      key: "rating",
      label: "Rating",
      getValue: (item) => item.rating,
      render: (value) => `⭐ ${value}/5`,
      section: "Basic Info"
    },
    {
      key: "description",
      label: "Description",
      getValue: (item) => item.description,
      span: 4,
      section: "Product Details"
    },
    {
      key: "manufacturer",
      label: "Manufacturer",
      getValue: (item) => item.manufacturer,
      section: "Product Details"
    },
    {
      key: "sku",
      label: "SKU",
      getValue: (item) => item.sku,
      section: "Product Details"
    }
  ];

  const actions: ItemAction[] = [
    {
      label: "Add to Cart",
      onClick: () => alert("Added to cart!"),
      icon: "🛒",
      variant: "primary"
    },
    {
      label: "View Details",
      onClick: () => alert("Viewing details..."),
      icon: "👁️",
      variant: "secondary"
    },
    {
      label: "Add to Wishlist",
      onClick: () => alert("Added to wishlist!"),
      icon: "❤️",
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
        GenericItem Examples
      </h1>
      <p style={{ color: "#64748b", marginBottom: "48px", fontSize: "1.1rem" }}>
        Display a single item with different layouts and configurations
      </p>

      {/* Card Layout */}
      <section style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>Card Layout</h2>
        <GenericItem
          item={product}
          fields={fields}
          title={product.name}
          subtitle={product.description}
          imageUrl={product.image}
          actions={actions}
          layout="card"
        />
      </section>

      {/* Panel Layout */}
      <section style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>Panel Layout</h2>
        <GenericItem
          item={product}
          fields={fields}
          title={product.name}
          subtitle={product.description}
          imageUrl={product.image}
          actions={actions}
          layout="panel"
        />
      </section>

      {/* Details Layout */}
      <section style={{ marginBottom: "80px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>Details Layout</h2>
        <GenericItem
          item={product}
          fields={fields}
          title={product.name}
          subtitle={product.description}
          imageUrl={product.image}
          actions={actions}
          layout="details"
        />
      </section>
    </div>
  );
}
