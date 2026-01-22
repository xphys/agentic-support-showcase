"use client";

import React, { useEffect } from "react";

export interface FullScreenModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Content to display in the modal */
  children: React.ReactNode;
  /** Optional title for the modal */
  title?: string;
}

const FullScreenModal = ({ isOpen, onClose, children, title }: FullScreenModalProps) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fullscreen-modal-overlay" onClick={onClose}>
      <div className="fullscreen-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="fullscreen-modal-header">
          {title && <h2 className="fullscreen-modal-title">{title}</h2>}
          <button
            className="fullscreen-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="fullscreen-modal-content">
          {children}
        </div>
      </div>

      <style jsx>
        {`
        .fullscreen-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease-out;
          isolation: isolate;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .fullscreen-modal-container {
          background: white;
          border-radius: 16px;
          width: 95vw;
          height: 90vh;
          max-width: 1800px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out;
          position: relative;
          z-index: 1;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .fullscreen-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 2px solid #e5e7eb;
          flex-shrink: 0;
        }

        .fullscreen-modal-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .fullscreen-modal-close {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .fullscreen-modal-close:hover {
          background: #e5e7eb;
          color: #374151;
          transform: scale(1.1);
        }

        .fullscreen-modal-content {
          flex: 1;
          overflow: auto;
          padding: 24px;
        }

        /* Custom scrollbar for modal content */
        .fullscreen-modal-content::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .fullscreen-modal-content::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 5px;
        }

        .fullscreen-modal-content::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 5px;
        }

        .fullscreen-modal-content::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        @media (max-width: 768px) {
          .fullscreen-modal-overlay {
            padding: 12px;
          }

          .fullscreen-modal-container {
            width: 100%;
            height: 95vh;
            border-radius: 12px;
          }

          .fullscreen-modal-header {
            padding: 16px;
          }

          .fullscreen-modal-title {
            font-size: 1.25rem;
          }

          .fullscreen-modal-content {
            padding: 16px;
          }
        }
      `}
      </style>
    </div>
  );
};

export default FullScreenModal;
