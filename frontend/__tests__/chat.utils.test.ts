/**
 * Unit tests for chat utilities
 * Tests validation, formatting, and error handling functions
 */

import {
  validateMessage,
  formatTimestamp,
  generateUUID,
  handleChatError,
  sanitizeMessage,
  truncateMessage,
  isValidUUID,
} from '@/utils/chat';

describe('Chat Utilities', () => {
  describe('validateMessage', () => {
    it('should accept valid messages', () => {
      const result = validateMessage('Hello world');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty messages', () => {
      const result = validateMessage('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Message cannot be empty');
    });

    it('should reject whitespace-only messages', () => {
      const result = validateMessage('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Message cannot be only whitespace');
    });

    it('should reject messages exceeding max length', () => {
      const longMessage = 'a'.repeat(5001);
      const result = validateMessage(longMessage, 5000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum length');
    });

    it('should accept messages at max length boundary', () => {
      const message = 'a'.repeat(5000);
      const result = validateMessage(message, 5000);
      expect(result.valid).toBe(true);
    });
  });

  describe('formatTimestamp', () => {
    it('should format ISO timestamp to time string', () => {
      const timestamp = '2026-02-08T10:30:00Z';
      const result = formatTimestamp(timestamp);
      expect(result).toMatch(/\d{2}:\d{2}/); // HH:MM format
    });

    it('should include date when requested', () => {
      const timestamp = '2026-02-08T10:30:00Z';
      const result = formatTimestamp(timestamp, true);
      expect(result).toMatch(/Feb.*\d{2}:\d{2}/); // Include month abbreviation
    });

    it('should return original or formatted result on parse error', () => {
      const invalidTimestamp = 'invalid-date';
      const result = formatTimestamp(invalidTimestamp);
      // JavaScript Date constructor returns Invalid Date string on invalid input
      expect(typeof result).toBe('string');
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID v4', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('isValidUUID', () => {
    it('should accept valid UUID v4 format', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidUUID(validUUID)).toBe(true);
    });

    it('should accept generated UUIDs', () => {
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it('should reject invalid UUID formats', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('550e8400-e29b-31d4-a716-446655440000')).toBe(false); // Wrong version
      expect(isValidUUID('550e8400-e29b-41d4-x716-446655440000')).toBe(false); // Invalid hex
      expect(isValidUUID('')).toBe(false);
    });

    it('should be case-insensitive', () => {
      const lowerUUID = '550e8400-e29b-41d4-a716-446655440000';
      const upperUUID = '550E8400-E29B-41D4-A716-446655440000';
      expect(isValidUUID(lowerUUID)).toBe(true);
      expect(isValidUUID(upperUUID)).toBe(true);
    });
  });

  describe('handleChatError', () => {
    it('should handle network errors', () => {
      const error = new TypeError('Failed to fetch');
      const result = handleChatError(error);
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.action).toBe('retry');
    });

    it('should handle 400 validation errors', () => {
      const error = { status: 400 };
      const result = handleChatError(error);
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.action).toBe('clarify');
    });

    it('should handle 404 not found errors', () => {
      const error = { status: 404 };
      const result = handleChatError(error);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.action).toBe('new');
    });

    it('should handle 401 unauthorized errors', () => {
      const error = { status: 401 };
      const result = handleChatError(error);
      expect(result.code).toBe('UNAUTHORIZED');
      expect(result.action).toBe('login');
    });

    it('should handle 500 server errors', () => {
      const error = { status: 500 };
      const result = handleChatError(error);
      expect(result.code).toBe('SERVER_ERROR');
      expect(result.action).toBe('retry');
    });

    it('should handle timeout errors', () => {
      const error = new Error('Request timeout');
      const result = handleChatError(error);
      expect(result.code).toBe('TIMEOUT');
      expect(result.action).toBe('retry');
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const result = handleChatError(error);
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.action).toBe('retry');
    });
  });

  describe('truncateMessage', () => {
    it('should not truncate short messages', () => {
      const message = 'Hello';
      const result = truncateMessage(message, 100);
      expect(result).toBe('Hello');
    });

    it('should truncate long messages', () => {
      const message = 'a'.repeat(150);
      const result = truncateMessage(message, 100);
      expect(result).toHaveLength(103); // 100 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should use default max length of 100', () => {
      const message = 'a'.repeat(150);
      const result = truncateMessage(message);
      expect(result).toHaveLength(103);
    });
  });

  describe('sanitizeMessage', () => {
    it('should escape HTML characters', () => {
      const message = '<script>alert("xss")</script>';
      const result = sanitizeMessage(message);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
    });

    it('should preserve regular text', () => {
      const message = 'Hello world';
      const result = sanitizeMessage(message);
      expect(result).toBe('Hello world');
    });
  });
});
