'use client';

/**
 * ChatInterface Component
 * Main chat UI component that combines MessageList and ChatInput
 * Manages conversation state and auto-scrolling
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import type { Conversation } from '@/types/chat';

interface ChatInterfaceProps {
  /** Optional initial conversation ID to load */
  conversationId?: string;
}

export const ChatInterface = ({ conversationId }: ChatInterfaceProps) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    conversation,
    inputValue,
    setInputValue,
    sendMessage,
    loadConversationHistory,
    error,
    isLoading,
    clearError,
  } = useChat();

  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  /**
   * Load conversation history on component mount or when conversation ID changes (T022)
   * Handles:
   * - Loading history when conversationId is provided
   * - Switching conversations when conversationId URL parameter changes
   * - Clearing state for new conversations (id=null)
   * - No duplicate requests via hasLoadedHistory flag
   */
  useEffect(() => {
    // Track if component is still mounted to prevent state updates after unmount
    let isMounted = true;

    const loadHistory = async () => {
      if (!conversationId) {
        // New conversation (no ID) - reset state
        if (isMounted) {
          setHasLoadedHistory(false);
        }
        return;
      }

      // Only load if we haven't already loaded this conversation
      if (hasLoadedHistory && conversation?.id === conversationId) {
        return;
      }

      try {
        // Load conversation history from backend
        await loadConversationHistory(conversationId);

        if (isMounted) {
          setHasLoadedHistory(true);
        }
      } catch (err) {
        // Error handling is done in loadConversationHistory
        if (isMounted) {
          setHasLoadedHistory(true); // Mark as attempted to prevent retries
        }
      }
    };

    loadHistory();

    // Cleanup on unmount: prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [conversationId, conversation?.id, hasLoadedHistory, loadConversationHistory]);

  /**
   * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  /**
   * Update URL when conversation ID is established
   */
  useEffect(() => {
    if (conversation?.id && conversation.id !== conversationId) {
      router.push(`/chat?id=${conversation.id}`, { scroll: false });
    }
  }, [conversation?.id, conversationId, router]);

  /**
   * Handle message submission
   */
  const handleSubmit = async (message: string) => {
    if (message.trim()) {
      await sendMessage(message);
    }
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg border border-gray-200 shadow-sm"
      role="region"
      aria-label="Chat interface"
    >
      {/* Messages Container - T029, T031, T033: Design system styling with responsive design */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 max-h-screen">
        {isLoading && (!conversation || conversation.messages.length === 0) ? (
          // T026, T030: Loading state while fetching conversation history
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading conversation...</p>
            </div>
          </div>
        ) : !conversation || conversation.messages.length === 0 ? (
          // Empty state for new conversation - T031: Design system
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Start a New Conversation
              </h2>
              <p className="text-gray-600 mb-4">
                Chat naturally to manage your tasks. Try asking something like:
              </p>
              <ul className="text-sm text-gray-500 space-y-1 mb-4">
                <li>"Add a task: buy milk"</li>
                <li>"List all my tasks"</li>
                <li>"Mark task as done"</li>
              </ul>
            </div>
          </div>
        ) : (
          // Display loaded messages - T031: Message styling
          <>
            <MessageList messages={conversation.messages} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display - T031: Design system error styling */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-2 inline-flex text-red-400 hover:text-red-600 focus:outline-none transition-colors"
              aria-label="Close error message"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Container - T027, T029, T031: Enhanced styling and accessibility */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
