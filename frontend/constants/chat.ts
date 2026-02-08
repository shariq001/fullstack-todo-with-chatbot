/**
 * Chat Constants - Configuration and message templates
 */

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export const CHAT_ENDPOINT = '/api/chat';
export const CHAT_API_URL = `${API_BASE_URL}${CHAT_ENDPOINT}`;

// Timeouts and Limits (milliseconds)
export const REQUEST_TIMEOUT_MS = 30000; // 30 seconds
export const LOADING_FEEDBACK_MS = 500; // Show loading indicator after 500ms
export const MAX_MESSAGE_LENGTH = 5000;
export const RETRY_DELAY_MS = 1000;
export const MAX_RETRIES = 3;

// Error Message Templates
export const ERROR_MESSAGES = {
  EMPTY_MESSAGE: 'Message cannot be empty',
  MESSAGE_TOO_LONG: 'Message exceeds maximum length',
  NETWORK_ERROR: 'Network connection failed. Please check your connection.',
  TIMEOUT: 'Request took too long. Please try again.',
  VALIDATION_ERROR: 'Invalid message. Please check your input and try again.',
  NOT_FOUND:
    'Conversation not found. It may have been deleted. Start a new conversation.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again in a moment.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  CONVERSATION_LOAD_FAILED: 'Failed to load conversation. Please try again.',
} as const;

// Success Message Templates
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent',
  CONVERSATION_CREATED: 'New conversation started',
  CONVERSATION_LOADED: 'Conversation loaded',
} as const;

// Loading State Messages
export const LOADING_MESSAGES = {
  SENDING: 'Sending message...',
  LOADING_HISTORY: 'Loading conversation history...',
  PROCESSING: 'Processing...',
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION_MS: 300,
  TOAST_DURATION_MS: 5000,
  LOADING_SPINNER_SIZE: 'md' as const,
  INPUT_PLACEHOLDER: 'Type your message here...',
  SEND_BUTTON_TEXT: 'Send',
  SENDING_BUTTON_TEXT: 'Sending...',
} as const;

// T031: Phase II Design System Colors
export const DESIGN_SYSTEM_COLORS = {
  primary: 'blue-500',
  secondary: 'gray-500',
  success: 'green-500',
  error: 'red-500',
  warning: 'yellow-500',
} as const;

// Message Role Colors (Tailwind CSS classes) - T031: Design system
export const MESSAGE_ROLE_COLORS = {
  user: 'bg-blue-100 text-blue-900 rounded-lg',
  assistant: 'bg-gray-100 text-gray-900 rounded-lg',
  system: 'bg-yellow-50 text-yellow-800 rounded-lg',
} as const;

// Message Role Alignment - T031: Consistent spacing
export const MESSAGE_ROLE_ALIGNMENT = {
  user: 'justify-end',
  assistant: 'justify-start',
  system: 'justify-center',
} as const;

// T031: Design system spacing and typography
export const DESIGN_SYSTEM_SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const;

export const DESIGN_SYSTEM_TYPOGRAPHY = {
  body: 'text-sm text-gray-900',
  caption: 'text-xs text-gray-600',
  heading: 'text-lg font-bold text-gray-900',
} as const;

// T031: Design system border styles
export const DESIGN_SYSTEM_BORDERS = {
  light: 'border border-gray-200',
  medium: 'border border-gray-300',
  dark: 'border border-gray-400',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  LAST_CONVERSATION_ID: 'chat_last_conversation_id',
  CONVERSATIONS_CACHE: 'chat_conversations_cache',
  USER_PREFERENCES: 'chat_user_preferences',
} as const;

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
  ENABLE_TOOL_DISPLAY: false, // Hide tool invocations by default
  ENABLE_DEBUG_MODE: false, // Show debug info
  ENABLE_STREAMING: true, // Stream responses
  ENABLE_CONVERSATION_HISTORY: true, // Load previous conversations
} as const;
