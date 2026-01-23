"use client";

import React, { useState } from "react";
import GenericForm, { FormField } from "../../components/generic/GenericForm";

export default function GenericFormExample() {
  const [submittedData, setSubmittedData] = useState<any>(null);

  const registrationFields: FormField[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
      required: true,
      minLength: 3,
      maxLength: 20,
      helpText: "Username must be 3-20 characters"
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "your@email.com",
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      helpText: "We'll never share your email"
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
      minLength: 8,
      helpText: "Must be at least 8 characters"
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
      required: true,
      min: 18,
      max: 120
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      required: true,
      options: [
        { label: "United States", value: "US" },
        { label: "United Kingdom", value: "UK" },
        { label: "Canada", value: "CA" },
        { label: "Australia", value: "AU" },
        { label: "Germany", value: "DE" }
      ]
    },
    {
      name: "interests",
      label: "Interests",
      type: "checkbox",
      options: [
        { label: "Technology", value: "tech" },
        { label: "Sports", value: "sports" },
        { label: "Music", value: "music" },
        { label: "Travel", value: "travel" }
      ]
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Tell us about yourself...",
      rows: 4,
      maxLength: 500,
      helpText: "Maximum 500 characters"
    },
    {
      name: "newsletter",
      label: "Subscribe to Newsletter",
      type: "radio",
      required: true,
      options: [
        { label: "Yes, keep me updated", value: "yes" },
        { label: "No, thanks", value: "no" }
      ]
    }
  ];

  const contactFields: FormField[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      required: true
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "john@example.com",
      required: true
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      placeholder: "What is this about?",
      required: true
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Your message here...",
      required: true,
      rows: 6,
      minLength: 10
    }
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    setSubmittedData(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

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
        GenericForm Examples
      </h1>
      <p style={{ color: "#64748b", marginBottom: "48px", fontSize: "1.1rem" }}>
        Dynamic forms with validation and custom layouts
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "48px" }}>
        {/* Registration Form */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>
            User Registration Form
          </h2>
          <GenericForm
            fields={registrationFields}
            onSubmit={handleSubmit}
            title="Create Account"
            description="Fill out the form below to create your account"
            submitText="Register"
            cancelText="Cancel"
            onCancel={() => alert("Registration cancelled")}
            showSuccessMessage={true}
            successMessage="Account created successfully!"
            layout="vertical"
          />
        </section>

        {/* Contact Form */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#1f2937" }}>
            Contact Form
          </h2>
          <GenericForm
            fields={contactFields}
            onSubmit={handleSubmit}
            title="Get in Touch"
            description="We'd love to hear from you"
            submitText="Send Message"
            showSuccessMessage={true}
            successMessage="Message sent! We'll get back to you soon."
            layout="vertical"
          />
        </section>
      </div>

      {/* Submitted Data Display */}
      {submittedData && (
        <section style={{
          marginTop: "48px",
          padding: "32px",
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          borderRadius: "20px",
          border: "2px solid rgba(16, 185, 129, 0.2)"
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "800"
          }}>
            Last Submitted Data
          </h3>
          <pre style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            overflow: "auto",
            fontSize: "0.9rem",
            border: "1px solid #d1d5db"
          }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
