'use client';

/**
 * MessageList Component
 * Displays messages in chronological order with role-based styling
 * Shows timestamps and loading indicators
 */

import { formatTimestamp } from '@/utils/chat';
import type { ChatMessage } from '@/types/chat';
import { MESSAGE_ROLE_ALIGNMENT, MESSAGE_ROLE_COLORS } from '@/constants/chat';

interface MessageListProps {
  /** Array of messages to display */
  messages: ChatMessage[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

/**
 * Individual Message Component
 */
interface MessageProps {
  message: ChatMessage;
}

const Message = ({ message }: MessageProps) => {
  const alignmentClass = MESSAGE_ROLE_ALIGNMENT[message.role];
  const bgColorClass = MESSAGE_ROLE_COLORS[message.role];

  // T033: Responsive message width based on viewport
  const messageWidthClass =
    message.role === 'system'
      ? 'max-w-full'
      : 'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg';

  return (
    <div className={`flex ${alignmentClass}`}>
      <div
        className={`${messageWidthClass} px-4 py-3 ${bgColorClass} ${
          message.role === 'system' ? 'text-center text-sm italic' : ''
        }`}
        role="article"
        aria-label={message.isLoading ? 'Loading response' : 'Message'}
      >
        {/* T028: Tool execution progress - show tool name during execution */}
        {message.isLoading && message.toolName && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Executing {message.toolName}...</span>
            <div className="animate-bounce h-2 w-2 bg-current rounded-full" />
            <div className="animate-bounce h-2 w-2 bg-current rounded-full animation-delay-100" />
            <div className="animate-bounce h-2 w-2 bg-current rounded-full animation-delay-200" />
          </div>
        )}

        {/* Loading indicator without tool name */}
        {message.isLoading && !message.toolName && (
          <div className="flex items-center space-x-2">
            <div className="animate-bounce h-2 w-2 bg-current rounded-full" />
            <div className="animate-bounce h-2 w-2 bg-current rounded-full animation-delay-100" />
            <div className="animate-bounce h-2 w-2 bg-current rounded-full animation-delay-200" />
          </div>
        )}

        {/* Message content */}
        {!message.isLoading && (
          <>
            <p className="text-sm break-words">{message.content}</p>

            {/* T028: Tool result display - show result after execution completes */}
            {message.toolResult && (
              <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                <p className="text-xs font-semibold mb-1">
                  {message.toolName ? `${message.toolName} Result:` : 'Tool Result:'}
                </p>
                <pre className="text-xs overflow-x-auto bg-black bg-opacity-10 p-2 rounded">
                  {JSON.stringify(message.toolResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Error (if present) */}
            {message.error && (
              <div
                className="mt-2 pt-2 border-t border-red-300"
                role="alert"
              >
                <p className="text-xs font-semibold text-red-600">Error:</p>
                <p className="text-xs text-red-600">{message.error}</p>
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs opacity-70 mt-1">
              {formatTimestamp(message.createdAt)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
