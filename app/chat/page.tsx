"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useState,
  useRef,
  useEffect,
  JSX,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  Send,
  Code2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Bot,
  User,
} from "lucide-react";
import { SourceCard } from "@/components/SourceCard";
import { AvatarEnhanced } from "@/components/ui/avatar-enhanced";
import { CardEnhanced } from "@/components/ui/card-enhanced";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { utils, commonStyles } from "@/lib/design-system";
import Image from "next/image";
import Link from "next/link";

interface Source {
  id: string;
  technology: string;
  lessonNumber: string;
  lessonTopic: string;
  startTime: string;
  endTime: string;
  relevanceScore: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
}

// Memoized Message Component for Performance
const MessageComponent = memo(
  ({
    message,
    formatTimestamp,
    copyToClipboard,
    copiedMessageId,
  }: {
    message: Message;
    formatTimestamp: (date: Date) => string;
    copyToClipboard: (content: string, messageId: string) => Promise<void>;
    copiedMessageId: string | null;
  }) => {
    const messageContent = useMemo(
      () => renderMessageContent(message.content),
      [message.content],
    );

    return (
      <div
        className={`flex gap-3 sm:gap-4 ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
        role="article"
        aria-label={`${message.role === "user" ? "Your message" : "Assistant response"}`}
      >
        {message.role === "assistant" && (
          <div className="flex-shrink-0">
            <AvatarEnhanced
              src="/hiteshchoudhary.webp"
              alt="AI Assistant - Hitesh Choudhary"
              size="md"
              status="online"
              fallbackIcon={<Bot className="h-5 w-5 text-white" />}
            />
          </div>
        )}

        <div className="max-w-[280px] sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <div className="space-y-2">
            <div
              className={`message-bubble group relative ${
                message.role === "user"
                  ? "message-bubble-user"
                  : "message-bubble-assistant"
              }`}
            >
              <div className="text-sm leading-relaxed">{messageContent}</div>

              {message.content && (
                <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="rounded-lg bg-black/20 p-1.5 transition-colors hover:bg-black/40 focus:bg-black/40 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                    title={
                      copiedMessageId === message.id
                        ? "Message copied!"
                        : "Copy message to clipboard"
                    }
                    aria-label={
                      copiedMessageId === message.id
                        ? "Message copied to clipboard"
                        : "Copy message to clipboard"
                    }
                    aria-pressed={copiedMessageId === message.id}
                  >
                    {copiedMessageId === message.id ? (
                      <Check
                        className="h-3 w-3 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <Copy
                        className="h-3 w-3 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div
              className={`flex items-center gap-2 text-xs ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.timestamp && (
                <span className="text-gray-500">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}
              {message.status === "sending" && (
                <span className="flex items-center gap-1 text-orange-400">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-orange-400"></div>
                  Sending...
                </span>
              )}
              {message.status === "error" && (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  Failed
                </span>
              )}
            </div>
          </div>

          {message.role === "assistant" &&
            message.sources &&
            message.sources.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-700"></div>
                  <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Sources ({message.sources.length})
                  </span>
                  <div className="h-px flex-1 bg-gray-700"></div>
                </div>
                <div className="space-y-1.5">
                  {message.sources.map((source) => (
                    <SourceCard
                      key={source.id}
                      technology={source.technology}
                      lessonNumber={source.lessonNumber}
                      lessonTopic={source.lessonTopic}
                      startTime={source.startTime}
                      endTime={source.endTime}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        {message.role === "user" && (
          <div className="flex-shrink-0">
            <AvatarEnhanced
              src="/user.svg"
              alt="User"
              size="md"
              status="online"
              className="bg-gradient-to-br from-orange-500 to-orange-600"
              fallbackIcon={<User className="h-5 w-5 text-white" />}
            />
          </div>
        )}
      </div>
    );
  },
);

MessageComponent.displayName = "MessageComponent";

// Function to parse and render message content with code highlighting
const renderMessageContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  const elements: JSX.Element[] = [];
  let match;

  // Handle code blocks
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      elements.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {renderInlineCode(textBefore)}
        </span>,
      );
    }

    // Add code block
    const language = match[1] || "text";
    const code = match[2];
    elements.push(
      <div key={`code-${match.index}`} className="my-3">
        <div className="flex items-center gap-2 rounded-t-lg bg-gray-800 px-3 py-2">
          <Code2 className="h-4 w-4 text-orange-400" />
          <span className="text-xs font-medium text-gray-300 uppercase">
            {language}
          </span>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>,
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    elements.push(
      <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
        {renderInlineCode(remainingText)}
      </span>,
    );
  }

  return elements.length > 0 ? elements : renderInlineCode(content);
};

// Function to handle inline code
const renderInlineCode = (text: string) => {
  const inlineCodeRegex = /`([^`]+)`/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = inlineCodeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <code
        key={`inline-${match.index}`}
        className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-orange-300"
      >
        {match[1]}
      </code>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 1 ? parts : text;
};

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Copy message content to clipboard
  const copyToClipboard = useCallback(
    async (content: string, messageId: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    },
    [],
  );

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    }
  }, []);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check if user is near bottom of scroll
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom
  }, []);

  // Handle scroll events to detect manual scrolling
  const handleScroll = useCallback(() => {
    if (!isStreaming) return; // Only track during streaming

    const nearBottom = isNearBottom();
    if (!nearBottom) {
      setUserHasScrolled(true);
    }
  }, [isStreaming, isNearBottom]);

  // Smart scroll to bottom - only when appropriate
  const scrollToBottom = useCallback(
    (force = false) => {
      if (!messagesEndRef.current) return;

      // Don't scroll if user has manually scrolled up during streaming
      if (isStreaming && userHasScrolled && !force) return;

      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    },
    [isStreaming, userHasScrolled],
  );

  // Reset scroll tracking when streaming starts
  const resetScrollTracking = useCallback(() => {
    setUserHasScrolled(false);
  }, []);

  // Add scroll event listener to detect manual scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-scroll only when user sends a new message (before AI response)
  // This effect is intentionally minimal to give users full scroll control
  useEffect(() => {
    if (shouldAutoScroll) {
      const timeoutId = setTimeout(() => {
        scrollToBottom(true);
        setShouldAutoScroll(false);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldAutoScroll, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Clear any existing errors
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsStreaming(false); // Reset streaming state
    resetScrollTracking(); // Reset scroll tracking for new conversation
    setShouldAutoScroll(true); // Trigger auto-scroll for user message

    // Update message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" as const } : msg,
        ),
      );
    }, 100);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        sources: [],
        timestamp: new Date(),
        status: "sending",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(true); // Start streaming

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "sources") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, sources: data.data }
                      : msg,
                  ),
                );
              } else if (data.type === "text") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: msg.content + data.data }
                      : msg,
                  ),
                );
              } else if (data.type === "done") {
                setLoading(false);
                setIsStreaming(false); // End streaming
                // Update assistant message status to sent
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, status: "sent" as const }
                      : msg,
                  ),
                );
                // No auto-scroll after streaming - let users control their scroll position
              } else if (data.type === "error") {
                console.error("Stream error:", data.data);
                setError(
                  "Sorry, I encountered an error while processing your request. Please try again.",
                );
                setLoading(false);
                setIsStreaming(false); // End streaming on error
                // Update assistant message status to error
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, status: "error" as const }
                      : msg,
                  ),
                );
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
              console.debug(
                "Chunk parsing error (expected for incomplete data):",
                e,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setIsStreaming(false); // End streaming on error

      // Set user-friendly error message
      const errorMsg =
        error instanceof Error
          ? `Connection error: ${error.message}`
          : "Sorry, I encountered an error while processing your request. Please try again.";

      setError(errorMsg);

      // Update user message status to error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? { ...msg, status: "error" as const }
            : msg,
        ),
      );

      // Add error message to chat with retry option
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Haan ji, kuch technical issue aa gaya hai. Please try again or refresh the page if the problem persists.",
        timestamp: new Date(),
        status: "error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    sendMessage(message);
  };

  // Handle input change with auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "#0a0a0a" }}
      role="application"
      aria-label="ChaiCourseGPT - AI Coding Assistant"
    >
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#message-input"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        aria-label="Skip to message input"
      >
        Skip to message input
      </a>
      {/* Accessible Error Notification */}
      {error && (
        <div
          className="fixed top-4 right-4 z-50 max-w-md"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-sm">
            <AlertCircle
              className="h-5 w-5 flex-shrink-0 text-red-400"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-200" id="error-title">
                Error
              </p>
              <p className="mt-1 text-xs text-red-300" id="error-message">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded text-red-400 transition-colors hover:text-red-300 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
              aria-label="Dismiss error notification"
              aria-describedby="error-title error-message"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Accessible Header */}
      <header
        className="border-b border-gray-800 px-4 py-3 shadow-xl backdrop-blur-sm sm:px-6 sm:py-4"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #1f1f1f 100%)",
          borderImage:
            "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent) 1",
        }}
        role="banner"
        aria-label="Application header"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <Link href="/">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg sm:h-12 sm:w-12">
                <Image
                  src="/chai.webp"
                  width={48}
                  height={48}
                  alt="ChaiCourseGPT logo"
                  className="object-cover transition-transform duration-200 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </Link>
            <div
              className="absolute -right-1 -bottom-1 h-3 w-3 animate-pulse rounded-full border-2 border-gray-900 bg-green-500 sm:h-4 sm:w-4"
              aria-hidden="true"
              title="Online status indicator"
            ></div>
          </div>

          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-lg font-bold tracking-tight text-white sm:text-2xl"
              id="app-title"
            >
              ChaiCourseGPT
              <span
                className="ml-2 hidden text-sm font-normal text-orange-400 sm:inline"
                aria-label="Version 2.0"
              >
                v1.0
              </span>
            </h1>

            <p
              className="truncate text-xs font-medium text-gray-400 sm:text-sm"
              aria-describedby="app-title"
            >
              <span className="hidden sm:inline">
                Your AI coding cource assistant •{" "}
              </span>
              <span className="text-orange-400">
                Powered by Hitesh Choudhary
              </span>
            </p>
          </div>
          <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Online</span>
            </div>
          </div>
          {/* Mobile menu button placeholder for future use */}
          <div className="sm:hidden">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        </div>
      </header>

      {/* Accessible Messages Area */}
      <main
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6"
        style={{ backgroundColor: "#0a0a0a" }}
        role="main"
        aria-label="Chat conversation"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div
            className="flex h-full items-center justify-center p-4 sm:p-6"
            role="region"
            aria-label="Welcome screen"
          >
            <div className="w-full max-w-4xl text-center">
              <div className="relative mx-auto mb-8">
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl shadow-2xl"
                  role="img"
                  aria-label="ChaiCourseGPT application logo"
                >
                  <Image
                    src="/chai.webp"
                    width={96}
                    height={96}
                    alt="ChaiCourseGPT logo - A stylized chai cup representing the learning platform"
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
                <div
                  className="absolute -inset-4 animate-pulse rounded-3xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-xl"
                  aria-hidden="true"
                ></div>
              </div>

              <div className="mb-6 space-y-4 sm:mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Namaste! Welcome to ChaiCourseGPT
                </h2>
                <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
                  Haan ji! I'm your AI coding instructor, ready to help you
                  learn and grow.
                  <br className="hidden sm:block" />
                  <span className="font-medium text-orange-400">
                    Seedhi si baat hai
                  </span>{" "}
                  - ask me anything about your course content!
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2 sm:gap-4">
                <CardEnhanced
                  variant="default"
                  padding="sm"
                  className={utils.hover("scale-105")}
                >
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    <span className="text-orange-400">💡</span>
                    Ask Questions
                  </h3>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Get explanations about concepts, code examples, and best
                    practices
                  </p>
                </CardEnhanced>

                <CardEnhanced
                  variant="default"
                  padding="sm"
                  className={utils.hover("scale-105")}
                >
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    <span className="text-orange-400">🔍</span>
                    Find Content
                  </h3>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Search through course materials with precise timestamps
                  </p>
                </CardEnhanced>

                <CardEnhanced
                  variant="default"
                  padding="sm"
                  className={utils.hover("scale-105")}
                >
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    <span className="text-orange-400">🚀</span>
                    Learn Faster
                  </h3>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Get personalized explanations in Hitesh's teaching style
                  </p>
                </CardEnhanced>

                <CardEnhanced
                  variant="default"
                  padding="sm"
                  className={utils.hover("scale-105")}
                >
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    <span className="text-orange-400">💻</span>
                    Code Help
                  </h3>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Debug issues, understand syntax, and improve your coding
                    skills
                  </p>
                </CardEnhanced>
              </div>

              <div className="mt-8 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4">
                <p className="text-sm text-orange-200">
                  <span className="font-semibold">Pro Tip:</span> Try asking
                  "Explain React hooks" or "Show me JavaScript examples"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <MessageComponent
                key={message.id}
                message={message}
                formatTimestamp={formatTimestamp}
                copyToClipboard={copyToClipboard}
                copiedMessageId={copiedMessageId}
              />
            ))}

            {loading && (
              <div className="flex justify-start gap-4">
                <div className="relative">
                  <div className="flex h-10 w-10 animate-pulse items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                    <Image
                      src="/hiteshchoudhary.webp"
                      height={40}
                      width={40}
                      alt="AI Assistant"
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        // Show fallback Bot icon
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML =
                            '<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>';
                        }
                      }}
                    />
                  </div>
                  <div className="absolute -right-1 -bottom-1 h-3 w-3 animate-pulse rounded-full border-2 border-gray-900 bg-yellow-500"></div>
                </div>
                <div className="message-bubble-assistant">
                  <div className="flex items-center gap-2">
                    <div className="loading-dots">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                    <span className="animate-pulse text-xs text-gray-400">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />

        {/* Scroll to bottom indicator */}
        {isStreaming && userHasScrolled && (
          <div className="absolute right-4 bottom-4 z-10">
            <button
              onClick={() => {
                setUserHasScrolled(false);
                scrollToBottom(true);
              }}
              className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-orange-600"
              aria-label="Scroll to bottom to see latest message"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <span className="hidden sm:inline">New message</span>
            </button>
          </div>
        )}
      </main>

      {/* Enhanced Accessible Input Area */}
      <footer
        className="border-t border-gray-800 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #1f1f1f 100%)",
          borderImage:
            "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent) 1",
        }}
        role="contentinfo"
        aria-label="Message input area"
      >
        <form
          className="mx-auto flex max-w-4xl gap-2 sm:gap-3"
          onSubmit={handleSubmit}
          aria-label="Send message form"
        >
          <div className="relative flex-1">
            <label htmlFor="message-input" className="sr-only">
              Type your message to ChaiCourseGPT
            </label>
            <Textarea
              id="message-input"
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              disabled={loading}
              className="chat-input text-sm sm:text-base"
              placeholder={
                loading
                  ? "Processing..."
                  : window.innerWidth < 640
                    ? "Ask me anything..."
                    : "Ask me about the course content... (Haan ji, kuch bhi puch sakte hain!)"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              maxLength={1000}
              aria-describedby="input-help character-count"
              aria-invalid={error ? "true" : "false"}
            />
            {input.trim() && (
              <div
                className="absolute right-2 bottom-2 text-xs text-gray-500"
                id="character-count"
                aria-live="polite"
              >
                <span className={input.length > 900 ? "text-orange-400" : ""}>
                  {input.length}/1000
                </span>
              </div>
            )}
            {error && (
              <div className="absolute -top-8 right-0 left-0 rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">
                {error}
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-button"
            title={loading ? "Processing..." : "Send message (Enter)"}
            aria-label={loading ? "Processing message" : "Send message"}
          >
            <Send
              className={`h-5 w-5 transition-all duration-200 ${loading ? "animate-spin" : "group-hover:translate-x-0.5"}`}
            />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default HomePage;
