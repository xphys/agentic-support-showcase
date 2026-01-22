"use client";

import {
  useCopilotChatInternal,
  useFrontendTool,
} from "@copilotkit/react-core";
import { useState, useRef, useEffect, Fragment } from "react";
import "./CustomCopilotChat.css";

// Minimal, animated, expandable agentic message: tool call trigger+result (result as a child)
// Update: icon and Tool call: ... to be the same row
function AgenticToolCallMessageWithResults({
  message,
  toolResultMessage,
}: {
  message: any;
  toolResultMessage?: any;
}) {
  const func = message?.toolCalls?.[0]?.function;
  const toolCallId = message?.toolCalls?.[0]?.id;
  const [expanded, setExpanded] = useState(false);

  let parsedArgs: any = null;
  try {
    parsedArgs = func && func.arguments ? JSON.parse(func.arguments) : null;
  } catch {}

  let parsedResult: any = null;
  let resultStatus: any = null;
  if (toolResultMessage) {
    try {
      parsedResult = JSON.parse(toolResultMessage.content);
      if (parsedResult && parsedResult.success !== undefined) {
        resultStatus = parsedResult.success ? "Success" : "Error";
      }
    } catch {}
  }

  return (
    <div
      className={`agentic-toolcall agentic-expandable ${expanded ? "expanded" : ""}`}
      style={{
        position: "relative",
        margin: "16px 0 8px 0",
        animation: "slideInToolCall .53s cubic-bezier(.7,.1,.2,1)",
      }}
    >
      <button
        className="agentic-expand-summary"
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "center",
          border: "none",
          background: "none",
          padding: 0,
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
        aria-expanded={expanded}
      >
        <span
          className="toolcall-inline-icon"
          style={{
            flexShrink: 0,
            marginRight: 12,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "block",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #79c2fa 60%, #4061eb55 100%)",
              boxShadow: "0 2px 12px 0 #8fd4ff54",
              animation: "toolPulse 2.8s infinite cubic-bezier(.45,0,.07,1.02)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={21} height={21} viewBox="0 0 23 23" fill="none">
              <path
                d="M12.5 2L3 13H12.5L10.5 21L20 10H10.5L12.5 2Z"
                stroke="#3467eb"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="#deedfd"
              />
            </svg>
          </span>
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
            fontWeight: 500,
            fontSize: 14.5,
            color: "#3769e6",
            padding: "7px 0",
          }}
        >
          <span>
            <span style={{ opacity: 0.95 }}>Tool call:</span>{" "}
            <span
              style={{
                background: "#e8efff",
                borderRadius: "5px",
                padding: "0px 6px",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.02em",
                color: "#444c87",
                marginRight: "7px",
              }}
            >
              {func?.name || "function"}
            </span>
            <span
              style={{
                color: "#a3baf0",
                fontFamily: "monospace",
                fontSize: 12,
                verticalAlign: "middle",
              }}
            >
              {!!toolCallId && <span>#{toolCallId.slice(-5)}</span>}
            </span>
          </span>
        </div>
        <svg
          style={{
            marginLeft: "6px",
            transition: "transform .29s cubic-bezier(.7,0,.25,1.1)",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            opacity: 0.65,
          }}
          width={18}
          height={18}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="#3769e6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className="agentic-toolcall-content"
        style={{
          maxHeight: expanded ? undefined : 0,
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? 7 : 0,
          pointerEvents: expanded ? "auto" : "none",
          overflow: "hidden",
          transition: "all 0.23s cubic-bezier(.75,0,.16,1.01)",
          background: "#f3f7ff",
          borderRadius: 10,
          boxShadow: expanded
            ? "0 4px 22px #4572fc19"
            : "0 2px 6px #e8eeff00",
          padding: expanded ? "12px 18px 8px 16px" : "0 18px 0 16px",
        }}
      >
        {func?.arguments && (
          <Fragment>
            <div
              style={{
                fontWeight: 600,
                color: "#4488ff",
                letterSpacing: "0.02em",
                fontSize: 13.2,
                marginBottom: 6,
              }}
            >
              Tool arguments
            </div>
            <pre
              style={{
                fontFamily: '"JetBrains Mono","Menlo","monospace",monospace',
                fontSize: 13.2,
                background: "none",
                margin: 0,
                color: "#223455",
                whiteSpace: "pre-wrap",
                fontWeight: 500,
                lineHeight: 1.38,
                wordBreak: "break-word",
              }}
            >
              {parsedArgs
                ? JSON.stringify(parsedArgs, null, 2)
                : func.arguments}
            </pre>
          </Fragment>
        )}
        {toolResultMessage && (
          <Fragment>
            <div
              style={{
                margin: "15px 0 5px 0",
                fontWeight: 700,
                color: "#13b154",
                fontSize: 13.2,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Result
              <span
                style={{
                  background: resultStatus
                    ? resultStatus === "Success"
                      ? "#c7ffe4"
                      : "#ffe7e7"
                    : "#ebfff6",
                  color: resultStatus
                    ? resultStatus === "Success"
                      ? "#13b154"
                      : "#e05050"
                    : "#377a61c9",
                  marginLeft: 10,
                  padding: "2px 12px",
                  borderRadius: "7px",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.02em",
                  verticalAlign: "middle",
                }}
              >
                {resultStatus || ""}
              </span>
            </div>
            <pre
              style={{
                fontFamily: '"JetBrains Mono","Menlo","monospace",monospace',
                fontSize: 13,
                color: "#196048",
                background: "none",
                margin: 0,
                fontWeight: 500,
                whiteSpace: "pre-wrap",
                lineHeight: 1.45,
              }}
            >
              {parsedResult
                ? JSON.stringify(parsedResult, null, 2)
                : typeof toolResultMessage.content === "string"
                ? toolResultMessage.content
                : JSON.stringify(toolResultMessage.content)}
            </pre>
          </Fragment>
        )}
      </div>
      <style>{`
        .agentic-expandable {
          border-radius: 18px;
          background: linear-gradient(97deg,#ecf4ff 0%,#e9eafd 100%);
          box-shadow: 0 2px 16px 0 #c3cffc24;
          align-items: stretch;
        }
        .agentic-expandable .agentic-expand-summary:focus { outline: 2px solid #7ba6ff88; }
      `}</style>
    </div>
  );
}

interface CustomCopilotChatProps {
  className?: string;
}

export function CustomCopilotChat({ className = "" }: CustomCopilotChatProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useFrontendTool({
    name: "sayHello",
    description: "Say hello to the user",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "The name of the user to say hello to",
        required: true,
      },
    ],
    handler({ name }) {
      // Handler returns the result of the tool call
    },
    render: ({ args }) => {
      return (
        <div>
          <h1>Hello, {args.name}!</h1>
          <h1>You're currently on {window.location.href}</h1>
        </div>
      );
    },
  });

  const {
    messages,
    sendMessage,
    setMessages,
    isLoading,
    stopGeneration,
  } = useCopilotChatInternal();

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    sendMessage({
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Animations for agentic UI (only inject once)
  const AGENTIC_ANIM_CSS = `
@keyframes slideInToolCall {
  0% { opacity: 0; transform: translateY(30px) scale(.96);}
  100% { opacity: 1; transform: translateY(0) scale(1);}
}
@keyframes toolPulse {
  0% { box-shadow: 0 0 0 0 #4f8de6bb;}
  70% { box-shadow: 0 0 16px 8px #4f8de618;}
  100% { box-shadow: 0 0 0 0 #4f8de600;}
}
`;

  // Helper: make map of toolCallId -> tool result message
  const toolResultsMap: Record<string, any> = {};
  messages.forEach((msg) => {
    if (msg.role === "tool" && msg.toolCallId) {
      toolResultsMap[msg.toolCallId] = msg;
    }
  });

  return (
    <div className={`custom-copilot-chat ${className}`}>
      <style>{AGENTIC_ANIM_CSS}</style>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="chat-header-text">
            <h2 className="chat-title">AI Assistant</h2>
            <p className="chat-subtitle">
              {isLoading ? "Thinking..." : "Online"}
            </p>
          </div>
        </div>
        <div className="chat-header-actions">
          {messages.length > 0 && (
            <button
              className="header-action-button"
              onClick={() => setMessages([])}
              title="Clear chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6H5H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="empty-state-title">Start a Conversation</h3>
            <p className="empty-state-description">
              Ask me anything about your data or request to view different components.
            </p>
            <div className="suggestion-chips">
              <button
                className="suggestion-chip"
                onClick={() => setInputValue("Show me products")}
              >
                Show products
              </button>
              <button
                className="suggestion-chip"
                onClick={() => setInputValue("Display user list")}
              >
                Display users
              </button>
              <button
                className="suggestion-chip"
                onClick={() => setInputValue("Show order #1001")}
              >
                View an order
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              // Check for assistant with toolCalls
              if (
                message.role === "assistant" &&
                !!message.toolCalls &&
                Array.isArray(message.toolCalls) &&
                message.toolCalls.length > 0
              ) {
                const toolCallId = message.toolCalls[0]?.id;
                const resultMessage = toolCallId
                  ? toolResultsMap[toolCallId]
                  : undefined;
                return (
                  <AgenticToolCallMessageWithResults
                    key={message.id ?? index}
                    message={message}
                    toolResultMessage={resultMessage}
                  />
                );
              }

              // Tool result message which is already paired in above, don't render again
              if (
                message.role === "tool" &&
                message.toolCallId &&
                // Only show tool result if there's no matching assistant with this toolCallId before it
                messages.some(
                  (m, idx) =>
                    idx < index &&
                    m.role === "assistant" &&
                    m.toolCalls &&
                    Array.isArray(m.toolCalls) &&
                    m.toolCalls.find((t: any) => t.id === message.toolCallId)
                )
              ) {
                // Already shown by its parent assistant tool call component
                return null;
              }

              // Standard User/Assistant message bubble
              return (
                <div
                  key={message.id ?? index}
                  className={`message-wrapper ${
                    message.role === "user" ? "message-user" : "message-assistant"
                  }`}
                >
                  <div className="message-avatar">
                    {message.role === "user" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L2 7L12 12L22 7L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12L12 17L22 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </span>
                      <span className="message-time">
                        {formatTime(new Date())}
                      </span>
                    </div>
                    <div className="message-text">
                      {typeof message.content === "string"
                        ? message.content
                        : JSON.stringify(message.content)}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="message-wrapper message-assistant">
                <div className="message-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="chat-input"
              rows={1}
              disabled={isLoading}
            />
            <div className="input-actions">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="stop-button"
                  title="Stop generating"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="6"
                      y="6"
                      width="12"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className="send-button"
                  disabled={!inputValue.trim()}
                  title="Send message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="input-hint">
            Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
          </div>
        </form>
      </div>
    </div>
  );
}
