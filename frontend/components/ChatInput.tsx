'use client';

/**
 * ChatInput Component
 * Message input field with Send button
 * Handles validation and submission
 */

import React, { useRef, useEffect, useState } from 'react';
import { validateMessage } from '@/utils/chat';
import { UI_CONFIG, MAX_MESSAGE_LENGTH } from '@/constants/chat';

interface ChatInputProps {
  /** Current input value */
  value: string;

  /** Callback when input changes */
  onChange: (value: string) => void;

  /** Callback when message is submitted */
  onSubmit: (message: string) => Promise<void>;

  /** Indicates if waiting for API response */
  isLoading: boolean;

  /** Disables input and button */
  disabled?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled = false,
}: ChatInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    const validation = validateMessage(value);
    if (!validation.valid) {
      setError(validation.error || 'Invalid message');
      return;
    }

    setError(null);

    // Submit
    try {
      await onSubmit(value);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send message'
      );
    }
  };

  /**
   * Handle key press (Enter to send)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      const form = inputRef.current?.form;
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
  };

  /**
   * Auto-resize textarea based on content
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  /**
   * Focus input on mount
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Error display - T032: Accessibility with role="alert" */}
      {error && (
        <div
          className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Input field - T032: Enhanced accessibility */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <label htmlFor="message-input" className="sr-only">
            Message input
          </label>
          <textarea
            ref={inputRef}
            id="message-input"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError(null); // Clear error on new input
            }}
            onKeyDown={handleKeyDown}
            placeholder={UI_CONFIG.INPUT_PLACEHOLDER}
            disabled={disabled}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={1}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-white text-gray-900'
            } focus:opacity-100`}
            aria-label="Message input"
            aria-disabled={disabled}
            aria-describedby="character-count"
            data-testid="message-input"
          />
        </div>

        {/* Send button - T027, T032: Enhanced button with loading state and accessibility */}
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            disabled || !value.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500'
          }`}
          aria-label={isLoading ? 'Sending message' : 'Send message'}
          aria-busy={isLoading}
          data-testid="send-button"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block" aria-hidden="true">
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
              {UI_CONFIG.SENDING_BUTTON_TEXT}
            </span>
          ) : (
            UI_CONFIG.SEND_BUTTON_TEXT
          )}
        </button>
      </div>

      {/* Character count - T032: Accessibility with aria-live */}
      <div className="flex items-center justify-between">
        <p
          id="character-count"
          className="text-xs text-gray-500"
          aria-live="polite"
          aria-atomic="true"
        >
          {value.length}/{MAX_MESSAGE_LENGTH} characters
        </p>
        {value.length > MAX_MESSAGE_LENGTH * 0.9 && (
          <p className="text-xs text-yellow-600" role="status">
            You are approaching the character limit
          </p>
        )}
      </div>

      {/* Keyboard help text - T032: Accessibility */}
      <p className="text-xs text-gray-400 italic">
        Press <kbd className="bg-gray-100 px-2 py-1 rounded text-gray-700">Enter</kbd> to send,{' '}
        <kbd className="bg-gray-100 px-2 py-1 rounded text-gray-700">Shift+Enter</kbd> for new line
      </p>
    </form>
  );
};
