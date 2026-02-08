/**
 * Chat Utilities - Pure functions for chat operations
 * No side effects; all functions are deterministic and testable
 */

/**
 * Validates a chat message before sending.
 * Rules:
 * - Must not be empty
 * - Must not be only whitespace
 * - Must not exceed max length
 * @param message - Message content to validate
 * @param maxLength - Maximum message length (default: 5000)
 * @returns Object with valid flag and error message if invalid
 */
export function validateMessage(message: string, maxLength = 5000): {
  valid: boolean;
  error?: string;
} {
  if (!message) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be only whitespace' };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Message exceeds maximum length of ${maxLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Formats an ISO 8601 timestamp to a human-readable string.
 * Example: "2026-02-08T10:30:00Z" -> "10:30 AM"
 * @param timestamp - ISO 8601 timestamp string
 * @param includeDate - Include date in output (default: false)
 * @returns Formatted timestamp string
 */
export function formatTimestamp(
  timestamp: string,
  includeDate = false
): string {
  try {
    const date = new Date(timestamp);

    if (includeDate) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return timestamp; // Return original if parsing fails
  }
}

/**
 * Generates a UUID v4 string for client-side message IDs.
 * Used to optimistically assign IDs before server confirmation.
 * @returns UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Categorizes HTTP errors and returns appropriate user-facing messages.
 * @param error - Error object with status code
 * @returns Object with error code, message, and suggested action
 */
export function handleChatError(error: unknown): {
  code: string;
  message: string;
  action: string;
} {
  // Handle fetch/network errors
  if (error instanceof TypeError) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your connection.',
      action: 'retry',
    };
  }

  // Handle custom error objects with status
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as Record<string, unknown>).status;

    if (status === 400) {
      return {
        code: 'VALIDATION_ERROR',
        message:
          'Invalid message. Please check your input and try again.',
        action: 'clarify',
      };
    }

    if (status === 404) {
      return {
        code: 'NOT_FOUND',
        message:
          'Conversation not found. It may have been deleted. Start a new conversation.',
        action: 'new',
      };
    }

    if (status === 401) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Your session has expired. Please log in again.',
        action: 'login',
      };
    }

    if (status === 500) {
      return {
        code: 'SERVER_ERROR',
        message:
          'Server error. Please try again in a moment.',
        action: 'retry',
      };
    }

    if (status === 503) {
      return {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable. Please try again later.',
        action: 'retry',
      };
    }
  }

  // Handle timeout
  if (error instanceof Error && error.message.includes('timeout')) {
    return {
      code: 'TIMEOUT',
      message: 'Request took too long. Please try again.',
      action: 'retry',
    };
  }

  // Default unknown error
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    action: 'retry',
  };
}

/**
 * Sanitizes message content to prevent XSS attacks.
 * Removes script tags and suspicious HTML.
 * @param content - Message content to sanitize
 * @returns Sanitized content
 */
export function sanitizeMessage(content: string): string {
  // Basic HTML escape for user-provided content
  const div = document.createElement('div');
  div.textContent = content;
  return div.innerHTML;
}

/**
 * Truncates message content to a reasonable length for display.
 * Used in message previews or lists.
 * @param content - Message content
 * @param maxLength - Maximum display length (default: 100)
 * @returns Truncated content with ellipsis if needed
 */
export function truncateMessage(content: string, maxLength = 100): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}

/**
 * Validates UUID v4 format.
 * Ensures conversation IDs are in valid UUID format before using them.
 * @param uuid - String to validate
 * @returns true if valid UUID v4 format, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
