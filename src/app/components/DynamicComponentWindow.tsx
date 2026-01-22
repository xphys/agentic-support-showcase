"use client";

import React, { ReactNode, useEffect, useState } from "react";
import "./DynamicComponentWindow.css";

export interface DynamicComponentWindowProps {
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
}

const DynamicComponentWindow: React.FC<DynamicComponentWindowProps> = ({
  component,
  title,
  animationType = "fade",
  animationDuration = 300,
  className = "",
  height = "600px",
  width = "100%",
}) => {
  const [displayedComponent, setDisplayedComponent] = useState<ReactNode>(component);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (component !== displayedComponent) {
      // Start exit animation
      setIsAnimating(true);

      // Wait for exit animation to complete, then swap component
      const timeout = setTimeout(() => {
        setDisplayedComponent(component);
        setIsAnimating(false);
      }, animationDuration);

      return () => clearTimeout(timeout);
    }
  }, [component, displayedComponent, animationDuration]);

  return (
    <div
      className={`dynamic-window ${className}`}
      style={{
        height,
        width,
        "--animation-duration": `${animationDuration}ms`,
      } as React.CSSProperties}
    >
      {title && (
        <div className="dynamic-window-header">
          <h2 className="dynamic-window-title">{title}</h2>
        </div>
      )}
      <div
        className={`dynamic-window-content ${animationType} ${isAnimating ? "exit" : "enter"}`}
        style={{ animationDuration: `${animationDuration}ms` }}
      >
        {displayedComponent}
      </div>
    </div>
  );
};

export default DynamicComponentWindow;
