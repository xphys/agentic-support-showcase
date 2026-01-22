"use client";

import React, { ReactNode, useEffect, useState } from "react";
import "./StackDynamicComponentWindow.css";

export interface StackedComponent {
  id: string;
  component: ReactNode;
  title?: string;
  timestamp: number;
}

export interface StackDynamicComponentWindowProps {
  /** The component to render inside the window */
  component: ReactNode;
  /** Window title (optional) */
  title?: string;
  /** Animation type: 'fade', 'slide', 'scale', 'flip' */
  animationType?: "fade" | "slide" | "scale" | "flip";
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Window height */
  height?: string;
  /** Window width */
  width?: string;
  /** Maximum number of stacked components (optional) */
  maxStack?: number;
}

const StackDynamicComponentWindow: React.FC<StackDynamicComponentWindowProps> = ({
  component,
  title,
  animationType = "slide",
  animationDuration = 400,
  className = "",
  height = "600px",
  width = "100%",
  maxStack,
}) => {
  const [stack, setStack] = useState<StackedComponent[]>([]);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // When a new component is passed, add it to the stack
    if (component) {
      const newStackedComponent: StackedComponent = {
        id: `component-${Date.now()}-${Math.random()}`,
        component,
        title,
        timestamp: Date.now(),
      };

      setStack((prevStack) => {
        const newStack = [...prevStack, newStackedComponent];

        // If maxStack is set, remove oldest components
        if (maxStack && newStack.length > maxStack) {
          return newStack.slice(-maxStack);
        }

        return newStack;
      });

      // Mark as animating
      setAnimatingIds((prev) => new Set(prev).add(newStackedComponent.id));

      // Remove animating state after animation completes
      setTimeout(() => {
        setAnimatingIds((prev) => {
          const next = new Set(prev);
          next.delete(newStackedComponent.id);
          return next;
        });
      }, animationDuration);
    }
  }, [component, title, maxStack, animationDuration]);

  const handleClose = (id: string) => {
    // Add exit animation class
    setAnimatingIds((prev) => new Set(prev).add(id));

    // Remove from stack after animation
    setTimeout(() => {
      setStack((prevStack) => prevStack.filter((item) => item.id !== id));
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, animationDuration);
  };

  return (
    <div
      className={`stack-dynamic-window ${className}`}
      style={{
        height,
        width,
        "--animation-duration": `${animationDuration}ms`,
      } as React.CSSProperties}
    >
      <div className="stack-container">
        {stack.map((item, index) => {
          const isAnimating = animatingIds.has(item.id);
          const isEntering = isAnimating && index === stack.length - 1;
          const isExiting = isAnimating && index !== stack.length - 1;

          return (
            <div
              key={item.id}
              className={`stacked-component ${animationType} ${
                isEntering ? "enter" : isExiting ? "exit" : "visible"
              }`}
              style={{
                animationDuration: `${animationDuration}ms`,
                zIndex: index,
              }}
            >
              {item.title && (
                <div className="stacked-component-header">
                  <h3 className="stacked-component-title">{item.title}</h3>
                  <button
                    className="stacked-component-close"
                    onClick={() => handleClose(item.id)}
                    aria-label="Close"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {!item.title && (
                <button
                  className="stacked-component-close stacked-component-close-no-header"
                  onClick={() => handleClose(item.id)}
                  aria-label="Close"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <div className="stacked-component-content">{item.component}</div>
            </div>
          );
        })}

        {stack.length === 0 && (
          <div className="empty-stack-message">
            No components displayed yet
          </div>
        )}
      </div>
    </div>
  );
};

export default StackDynamicComponentWindow;
