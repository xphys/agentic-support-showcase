'use client';

import React from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'inactive' },
];

const CustomerList: React.FC = () => {
  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h3>Customer Directory</h3>
        <p className="customer-count">{mockCustomers.length} customers</p>
      </div>

      <div className="customer-grid">
        {mockCustomers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-avatar">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="customer-info">
              <h4>{customer.name}</h4>
              <p className="customer-email">{customer.email}</p>
              <span className={`customer-status ${customer.status}`}>
                {customer.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .customer-list {
          width: 100%;
        }

        .customer-list-header {
          margin-bottom: 24px;
        }

        .customer-list-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .customer-count {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .customer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .customer-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .customer-card:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.25rem;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .customer-info {
          flex: 1;
          min-width: 0;
        }

        .customer-info h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          color: #1f2937;
          font-weight: 600;
        }

        .customer-email {
          margin: 0 0 8px 0;
          font-size: 0.875rem;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .customer-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .customer-status.active {
          background: #d1fae5;
          color: #065f46;
        }

        .customer-status.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 768px) {
          .customer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerList;
