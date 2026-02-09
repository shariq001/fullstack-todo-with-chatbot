/**
 * useChat Hook - Main API client hook for chat operations
 * Handles message sending, conversation loading, error management, and state
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  ChatMessage,
  Conversation,
  ChatRequest,
  ChatResponse,
  UseChatReturn,
} from '@/types/chat';
import {
  validateMessage,
  handleChatError,
  generateUUID,
  isValidUUID,
} from '@/utils/chat';
import {
  CHAT_API_URL,
  REQUEST_TIMEOUT_MS,
  ERROR_MESSAGES,
  STORAGE_KEYS,
} from '@/constants/chat';
import { getToken } from '@/src/auth/auth-utils';

/**
 * Main chat hook for sending messages and managing conversation state
 * @returns Chat state and methods
 */
export const useChat = (): UseChatReturn => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Send a message to the API and update conversation state
   * @param message - Message content to send
   */
  const sendMessage = useCallback(
    async (message: string) => {
      // Validate input
      const validation = validateMessage(message);
      if (!validation.valid) {
        setError(validation.error || ERROR_MESSAGES.EMPTY_MESSAGE);
        return;
      }

      clearError();
      setIsLoading(true);

      try {
        // Create optimistic message for UI
        const userMessage: ChatMessage = {
          id: generateUUID(),
          role: 'user',
          content: message.trim(),
          createdAt: new Date().toISOString(),
          isLoading: false,
        };

        // Update conversation with user message
        const updatedConversation: Conversation = {
          ...(conversation || {
            id: '',
            messages: [],
            isLoading: false,
            createdAt: new Date().toISOString(),
          }),
          messages: [...(conversation?.messages || []), userMessage],
          lastMessageAt: new Date().toISOString(),
        };

        setConversation(updatedConversation);
        setInputValue(''); // Clear input immediately

        // Add loading message
        const loadingMessage: ChatMessage = {
          id: generateUUID(),
          role: 'assistant',
          content: 'Typing...',
          createdAt: new Date().toISOString(),
          isLoading: true,
        };

        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, loadingMessage],
              }
            : null
        );

        // Build request payload
        const request: ChatRequest = {
          message: message.trim(),
          conversation_id: conversation?.id,
        };

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          REQUEST_TIMEOUT_MS
        );

        try {
          // Get JWT token from localStorage (same as apiClient)
          const token = await getToken();

          console.log('🔐 Token retrieval:', {
            tokenFound: !!token,
            tokenLength: token ? token.length : 0
          });

          // Build headers
          const headers: any = {
            'Content-Type': 'application/json',
          };

          // Add JWT token if available
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('✓ Authorization header set with Bearer token');
          } else {
            console.warn('⚠️ No token found in localStorage');
          }

          // Call API
          const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(request),
            signal: controller.signal,
            credentials: 'include', // Include cookies for authentication
          });

          clearTimeout(timeoutId);

          // Handle error responses
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorObj = {
              status: response.status,
              ...errorData,
            };

            const { message: errorMessage } = handleChatError(errorObj);
            throw new Error(errorMessage);
          }

          // Parse response
          const data: ChatResponse = await response.json();

          // Create assistant message
          const assistantMessage: ChatMessage = {
            id: generateUUID(),
            role: 'assistant',
            content: data.response,
            toolName: data.toolName,
            toolResult: data.toolResult,
            createdAt: new Date().toISOString(),
            isLoading: false,
          };

          // Update conversation with response
          setConversation((prev) => {
            if (!prev) {
              return null;
            }

            // Replace loading message with actual response
            const messages = prev.messages.slice(0, -1); // Remove loading message
            messages.push(assistantMessage);

            return {
              ...prev,
              id: data.conversation_id, // Update conversation ID if new
              messages,
              lastMessageAt: new Date().toISOString(),
            };
          });

          // Save conversation ID and metadata to localStorage (T023)
          if (data.conversation_id) {
            try {
              localStorage.setItem(
                STORAGE_KEYS.LAST_CONVERSATION_ID,
                JSON.stringify({
                  id: data.conversation_id,
                  lastAccessedAt: new Date().toISOString(),
                })
              );
            } catch (storageError) {
              // localStorage might be full or unavailable; fail silently
              console.warn('Failed to save conversation to localStorage:', storageError);
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);

          // Remove loading message on error
          setConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: prev.messages.slice(0, -1),
                }
              : null
          );

          if (fetchError instanceof Error) {
            if (fetchError.name === 'AbortError') {
              setError(ERROR_MESSAGES.TIMEOUT);
            } else {
              setError(fetchError.message);
            }
          } else {
            setError(ERROR_MESSAGES.UNKNOWN_ERROR);
          }
        }
      } catch (err) {
        const { message: errorMessage } = handleChatError(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [conversation, clearError]
  );

  /**
   * Load conversation history from the backend
   * @param conversationId - ID of conversation to load
   * @returns Promise that resolves when conversation is loaded or error occurs
   */
  const loadConversationHistory = useCallback(
    async (conversationId: string): Promise<ChatMessage[]> => {
      // Validate conversation ID format
      if (!conversationId || !isValidUUID(conversationId)) {
        setError(ERROR_MESSAGES.NOT_FOUND);
        return [];
      }

      setIsLoading(true);
      clearError();

      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          REQUEST_TIMEOUT_MS
        );

        try {
          // Get JWT token from localStorage
          const token = await getToken();

          // Build headers with authorization
          const headers: any = {
            'Content-Type': 'application/json',
          };

          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          // Fetch conversation history from backend
          // Uses GET request with conversation_id as query parameter
          const response = await fetch(
            `${CHAT_API_URL}?conversation_id=${encodeURIComponent(conversationId)}`,
            {
              method: 'GET',
              headers,
              signal: controller.signal,
              credentials: 'include', // Include cookies for authentication
            }
          );

          clearTimeout(timeoutId);

          // Handle error responses
          if (!response.ok) {
            if (response.status === 404) {
              setError(ERROR_MESSAGES.NOT_FOUND);
              // Clear invalid conversation from localStorage
              localStorage.removeItem(STORAGE_KEYS.LAST_CONVERSATION_ID);
            } else if (response.status === 401) {
              setError(ERROR_MESSAGES.UNAUTHORIZED);
            } else {
              throw new Error(ERROR_MESSAGES.CONVERSATION_LOAD_FAILED);
            }
            return [];
          }

          // Parse response and validate structure
          const data = await response.json();

          if (data.messages && Array.isArray(data.messages)) {
            // Create conversation object from loaded data
            const loadedConversation: Conversation = {
              id: conversationId,
              messages: data.messages,
              isLoading: false,
              createdAt: data.createdAt || new Date().toISOString(),
              lastMessageAt: data.lastMessageAt || new Date().toISOString(),
            };

            setConversation(loadedConversation);
            return data.messages;
          }

          return [];
        } catch (fetchError) {
          clearTimeout(timeoutId);

          if (fetchError instanceof Error) {
            if (fetchError.name === 'AbortError') {
              setError(ERROR_MESSAGES.TIMEOUT);
            } else {
              setError(fetchError.message);
            }
          } else {
            setError(ERROR_MESSAGES.CONVERSATION_LOAD_FAILED);
          }
          return [];
        }
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  /**
   * Get last conversation ID from localStorage with validation
   * Handles both legacy (string) and new (JSON) formats
   * @returns Conversation ID if valid, null otherwise
   */
  const getLastConversationIdFromStorage = useCallback((): string | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_CONVERSATION_ID);
      if (!stored) {
        return null;
      }

      // Try to parse as JSON (new format: { id, lastAccessedAt })
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && 'id' in parsed) {
          const id = parsed.id as string;
          return isValidUUID(id) ? id : null;
        }
      } catch {
        // Fall back to legacy string format
        if (isValidUUID(stored)) {
          return stored;
        }
      }

      return null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Load last conversation from localStorage on mount (T023)
   * Only loads if:
   * 1. No conversation_id in URL
   * 2. localStorage has valid last conversation
   * 3. No existing conversation in state
   */
  useEffect(() => {
    // Note: This effect only runs on mount (empty dependencies)
    // For URL-based conversation loading, see ChatInterface.tsx
    if (!conversation) {
      const lastConversationId = getLastConversationIdFromStorage();
      if (lastConversationId) {
        loadConversationHistory(lastConversationId);
      }
    }
  }, []); // Only run on mount

  return {
    conversation,
    inputValue,
    setInputValue,
    sendMessage,
    loadConversationHistory,
    error,
    isLoading,
    clearError,
  };
};
