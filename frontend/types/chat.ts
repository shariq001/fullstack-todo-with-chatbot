/**
 * Chat Types - TypeScript interfaces for the ChatKit frontend
 * Defines data structures for messages, conversations, and API contracts
 */

/**
 * ChatMessage represents a single message in a conversation.
 * Supports user messages, assistant responses, system messages, and tool results.
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;

  /** Role: 'user' (human input), 'assistant' (AI response), or 'system' (internal) */
  role: 'user' | 'assistant' | 'system';

  /** Message content (text) */
  content: string;

  /** Optional: tool name if message is a tool invocation result */
  toolName?: string;

  /** Optional: tool result/output if message is a tool execution result */
  toolResult?: unknown;

  /** ISO 8601 timestamp when message was created */
  createdAt: string;

  /** Indicates if message is still loading/streaming from server */
  isLoading?: boolean;

  /** Optional: error message if tool execution failed */
  error?: string;
}

/**
 * Conversation represents a single chat session with history.
 * Acts as a container for related messages.
 */
export interface Conversation {
  /** Unique conversation ID (issued by backend) */
  id: string;

  /** Array of messages in chronological order */
  messages: ChatMessage[];

  /** Indicates if conversation is currently loading from server */
  isLoading: boolean;

  /** Optional error state for the conversation */
  error?: string;

  /** ISO 8601 timestamp when conversation was created */
  createdAt: string;

  /** ISO 8601 timestamp of last message */
  lastMessageAt?: string;
}

/**
 * ChatRequest is the payload sent to POST /api/chat
 * Validates: message cannot be empty, conversation_id optional
 */
export interface ChatRequest {
  /** The user's message (required, validated: trim().length > 0) */
  message: string;

  /** Optional: existing conversation ID to append message to */
  conversation_id?: string;
}

/**
 * ChatResponse is the payload returned from POST /api/chat
 * Includes new conversation ID and assistant's response
 */
export interface ChatResponse {
  /** Conversation ID (newly created or existing) */
  conversation_id: string;

  /** Assistant's response text */
  response: string;

  /** Optional: tool name if response includes tool execution */
  toolName?: string;

  /** Optional: tool result if response includes tool output */
  toolResult?: unknown;
}

/**
 * ChatError represents error information from API responses.
 * Used for standardized error handling.
 */
export interface ChatError {
  /** Error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND', 'SERVER_ERROR') */
  error: string;

  /** Human-readable error message */
  message: string;

  /** Optional: unique trace ID for debugging */
  trace_id?: string;

  /** Optional: ISO 8601 timestamp of error */
  timestamp?: string;

  /** Optional: recommended retry delay in seconds */
  retry_after?: number;

  /** Optional: suggested action for the user */
  suggested_action?: string;
}

/**
 * UseChat hook return type.
 * Provides methods to interact with the chat API.
 */
export interface UseChatReturn {
  /** Current conversation state */
  conversation: Conversation | null;

  /** Current user input value */
  inputValue: string;

  /** Set input value */
  setInputValue: (value: string) => void;

  /** Send a message and wait for response */
  sendMessage: (message: string) => Promise<void>;

  /** Load conversation history by ID and return messages array */
  loadConversationHistory: (conversationId: string) => Promise<ChatMessage[]>;

  /** Current error state */
  error: string | null;

  /** Indicates if currently waiting for server response */
  isLoading: boolean;

  /** Clear error message */
  clearError: () => void;
}
