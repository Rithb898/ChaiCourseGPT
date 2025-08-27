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
import { Send, Code2, Copy, Check, AlertCircle, Bot, User } from "lucide-react";
import { SourceCard } from "@/components/SourceCard";
import { AvatarEnhanced } from "@/components/ui/avatar-enhanced";
import { CardEnhanced } from "@/components/ui/card-enhanced";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { utils } from "@/lib/design-system";
import Image from "next/image";
import Header from "@/components/Header";
import MessageComponent from "@/components/MessageComponent";

export type CourseType = "all" | "nodejs" | "python";

interface Source {
  id: string;
  technology: string;
  lessonNumber: string;
  lessonTopic: string;
  startTime: string;
  endTime: string;
  relevanceScore: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
  courseFilter?: CourseType;
}

// const MessageComponent = memo(
//   ({
//     message,
//     formatTimestamp,
//     copyToClipboard,
//     copiedMessageId,
//   }: {
//     message: Message;
//     formatTimestamp: (date: Date) => string;
//     copyToClipboard: (content: string, messageId: string) => Promise<void>;
//     copiedMessageId: string | null;
//   }) => {
//     const messageContent = useMemo(
//       () => renderMessageContent(message.content),
//       [message.content],
//     );

//     return (
//       <div
//         className={`flex gap-3 sm:gap-4 ${
//           message.role === "user" ? "justify-end" : "justify-start"
//         }`}
//         role="article"
//         aria-label={`${message.role === "user" ? "Your message" : "Assistant response"}`}
//       >
//         {message.role === "assistant" && (
//           <div className="flex-shrink-0">
//             <AvatarEnhanced
//               src="/hiteshchoudhary.webp"
//               alt="AI Assistant - Hitesh Choudhary"
//               size="md"
//               status="online"
//               fallbackIcon={<Bot className="h-5 w-5 text-white" />}
//             />
//           </div>
//         )}

//         <div className="max-w-[280px] sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
//           <div className="space-y-2">
//             <div
//               className={`message-bubble group relative ${
//                 message.role === "user"
//                   ? "message-bubble-user"
//                   : "message-bubble-assistant"
//               }`}
//             >
//               <div className="text-sm leading-relaxed">{messageContent}</div>

//               {message.content && (
//                 <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
//                   <button
//                     onClick={() => copyToClipboard(message.content, message.id)}
//                     className="rounded-lg bg-black/20 p-1.5 transition-colors hover:bg-black/40 focus:bg-black/40 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
//                     title={
//                       copiedMessageId === message.id
//                         ? "Message copied!"
//                         : "Copy message to clipboard"
//                     }
//                     aria-label={
//                       copiedMessageId === message.id
//                         ? "Message copied to clipboard"
//                         : "Copy message to clipboard"
//                     }
//                     aria-pressed={copiedMessageId === message.id}
//                   >
//                     {copiedMessageId === message.id ? (
//                       <Check
//                         className="h-3 w-3 text-green-400"
//                         aria-hidden="true"
//                       />
//                     ) : (
//                       <Copy
//                         className="h-3 w-3 text-gray-400"
//                         aria-hidden="true"
//                       />
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div
//               className={`flex items-center gap-2 text-xs ${
//                 message.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               {message.timestamp && (
//                 <span className="text-gray-500">
//                   {formatTimestamp(message.timestamp)}
//                 </span>
//               )}
//               {message.status === "sending" && (
//                 <span className="flex items-center gap-1 text-orange-400">
//                   <div className="h-2 w-2 animate-pulse rounded-full bg-orange-400"></div>
//                   Sending...
//                 </span>
//               )}
//               {message.status === "error" && (
//                 <span className="flex items-center gap-1 text-red-400">
//                   <AlertCircle className="h-3 w-3" />
//                   Failed
//                 </span>
//               )}
//             </div>
//           </div>

//           {message.role === "assistant" &&
//             message.sources &&
//             message.sources.length > 0 && (
//               <div className="mt-3">
//                 <div className="mb-2 flex items-center gap-2">
//                   <div className="h-px flex-1 bg-gray-700"></div>
//                   <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
//                     Sources ({message.sources.length})
//                   </span>
//                   <div className="h-px flex-1 bg-gray-700"></div>
//                 </div>
//                 <div className="space-y-1.5">
//                   {message.sources.map((source) => (
//                     <SourceCard
//                       key={source.id}
//                       technology={source.technology}
//                       lessonNumber={source.lessonNumber}
//                       lessonTopic={source.lessonTopic}
//                       startTime={source.startTime}
//                       endTime={source.endTime}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//         </div>

//         {message.role === "user" && (
//           <div className="flex-shrink-0">
//             <AvatarEnhanced
//               src="/user.svg"
//               alt="User"
//               size="md"
//               status="online"
//               className="bg-gradient-to-br from-orange-500 to-orange-600"
//               fallbackIcon={<User className="h-5 w-5 text-white" />}
//             />
//           </div>
//         )}
//       </div>
//     );
//   },
// );

// MessageComponent.displayName = "MessageComponent";

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Format timestamp for display - memoized to prevent recreations
  const formatTimestamp = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  }, []);

  // Copy message content to clipboard - fixed dependencies
  const copyToClipboard = useCallback(
    async (content: string, messageId: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopiedMessageId(messageId);
          setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (fallbackErr) {
          console.error("Fallback copy failed: ", fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    },
    [], // No dependencies needed as it only uses parameters
  );

  // Auto-resize textarea - fixed dependencies
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    }
  }, []); // No dependencies needed

  // Clear error after timeout - improved cleanup
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check if user is near bottom of scroll - memoized
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  // Handle scroll events - fixed dependencies
  const handleScroll = useCallback(() => {
    if (!isStreaming) return;

    const nearBottom = isNearBottom();
    if (!nearBottom) {
      setUserHasScrolled(true);
    }
  }, [isStreaming, isNearBottom]);

  // Smart scroll to bottom - fixed dependencies
  const scrollToBottom = useCallback(
    (force = false) => {
      if (!messagesEndRef.current) return;

      if (isStreaming && userHasScrolled && !force) return;

      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    },
    [isStreaming, userHasScrolled],
  );

  // Reset scroll tracking - no dependencies needed
  const resetScrollTracking = useCallback(() => {
    setUserHasScrolled(false);
  }, []);

  // Add scroll event listener - improved cleanup
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-scroll effect - improved dependencies
  useEffect(() => {
    if (shouldAutoScroll) {
      const timeoutId = setTimeout(() => {
        scrollToBottom(true);
        setShouldAutoScroll(false);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldAutoScroll, scrollToBottom]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setError(null);

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        status: "sending",
        courseFilter: selectedCourse,
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setIsStreaming(false);
      resetScrollTracking();
      setShouldAutoScroll(true);

      // Update message status to sent
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: "sent" as const }
              : msg,
          ),
        );
      }, 100);

      try {
        console.log(`🚀 Sending request with courseFilter: ${selectedCourse}`); // Debug log
        const startTime = performance.now();
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
            courseFilter: selectedCourse, // ✅ CRITICAL: This was missing
          }),
          signal: abortControllerRef.current.signal,
        });
        const endTime = performance.now();
        console.log(
          `⏱️ Response received in ${((endTime - startTime) / 1000).toFixed(
            2,
          )} seconds`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          sources: [],
          timestamp: new Date(),
          status: "sending",
          courseFilter: selectedCourse,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsStreaming(true);

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
                  setIsStreaming(false);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, status: "sent" as const }
                        : msg,
                    ),
                  );
                } else if (data.type === "error") {
                  console.error("Stream error:", data.data);
                  setError(
                    "Sorry, I encountered an error while processing your request. Please try again.",
                  );
                  setLoading(false);
                  setIsStreaming(false);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, status: "error" as const }
                        : msg,
                    ),
                  );
                }
              } catch (e) {
                console.debug("Chunk parsing error:", e);
              }
            }
          }
        }
      } catch (error: unknown) {
        // Handle abort errors gracefully
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request was aborted");
          return;
        }

        console.error("Error:", error);
        setLoading(false);
        setIsStreaming(false);

        const errorMsg =
          error instanceof Error
            ? `Connection error: ${error.message}`
            : "Sorry, I encountered an error while processing your request. Please try again.";

        setError(errorMsg);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: "error" as const }
              : msg,
          ),
        );

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
    },
    [messages, resetScrollTracking, selectedCourse],
  ); // Added missing dependencies

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || loading) return;

      const message = input.trim();
      setInput("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      sendMessage(message);
    },
    [input, loading, sendMessage],
  );

  // Handle input change with auto-resize - fixed dependencies
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      adjustTextareaHeight();
    },
    [adjustTextareaHeight],
  );

  // Memoize placeholder text to prevent unnecessary re-renders
  const placeholderText = useMemo(() => {
    if (loading) return "Processing...";

    const courseSpecificText = {
      all: "Ask me about any course content...",
      nodejs: "Ask me about Node.js concepts...",
      python: "Ask me about Python programming...",
    };

    const baseText = courseSpecificText[selectedCourse];

    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return baseText;
    }
    return `${baseText} (Haan ji, kuch bhi puch sakte hain!)`;
  }, [loading, selectedCourse]);

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

      {/* Error Notification */}
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

      <Header
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />

      {/* Messages Area */}
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
                  Haan ji! I&apos;m your AI coding instructor, ready to help you
                  learn and grow.
                  <br className="hidden sm:block" />
                  <span className="font-medium text-orange-400">
                    Seedhi si baat hai
                  </span>{" "}
                  - ask me anything about your{" "}
                  {selectedCourse === "all" ? "course" : selectedCourse}{" "}
                  content!
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
                    Get personalized explanations in Hitesh&apos;s teaching
                    style
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
                  &quot;How to setup venv in python?&quot; or &quot;what is fs
                  module in nodejs?&quot;
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                <MessageComponent
                  key={message.id}
                  message={message}
                  formatTimestamp={formatTimestamp}
                  copyToClipboard={copyToClipboard}
                  copiedMessageId={copiedMessageId}
                />
              </div>
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

      {/* Input Area */}
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
              placeholder={placeholderText}
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
