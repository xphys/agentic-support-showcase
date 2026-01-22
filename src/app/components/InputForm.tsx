'use client';

import React, { useState } from 'react';

const InputForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 2000);
  };

  return (
    <div className="input-form-container">
      <div className="form-header">
        <h3>Contact Form</h3>
        <p>Fill out the form below to get in touch with us</p>
      </div>

      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Success!</h4>
          <p>Your form has been submitted successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you..."
              rows={4}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Form
          </button>
        </form>
      )}

      <style jsx>{`
        .input-form-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .form-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .form-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.75rem;
          color: #1f2937;
        }

        .form-header p {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #9ca3af;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-button {
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .success-message {
          text-align: center;
          padding: 48px 24px;
          animation: fadeIn 0.3s ease-out;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 24px;
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .success-message h4 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .success-message p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .form-header h3 {
            font-size: 1.5rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default InputForm;
