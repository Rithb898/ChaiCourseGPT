import { AlertCircle, Bot, Check, Code2, Copy, User } from "lucide-react";
import React, { JSX, useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import AvatarEnhanced from "./ui/avatar-enhanced";
import { SourceCard } from "./SourceCard";
import { Message } from "@/app/chat/page";
import Image from "next/image";

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

const MessageComponent = ({
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
    <>
      {message.role === "user" &&
        message.courseFilter &&
        message.courseFilter !== "all" && (
          <div className="mb-2 flex justify-end">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${message.courseFilter === "nodejs" ? "bg-green-600/20 text-green-400" : "bg-blue-600/20 text-blue-400"} `}
            >
              {message.courseFilter === "nodejs" ? (
                <div className="flex items-center justify-center gap-1">
                  <Image
                    src="/nodejs.svg"
                    alt="Node.js"
                    width={16}
                    height={16}
                    className="inline-block h-4 w-4"
                  />
                  NodeJS
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <Image
                    src="/python.svg"
                    alt="Python"
                    width={16}
                    height={16}
                    className="inline-block h-4 w-4"
                  />
                  Python
                </div>
              )}
            </span>
          </div>
        )}
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
    </>
  );
};

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;
