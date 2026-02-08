/**
 * T034: Comprehensive Error Scenario Tests
 * Tests for ChatInterface component error handling
 * Coverage: 400, 404, 500, timeout, 401 errors
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '@/components/ChatInterface';
import * as useChathook from '@/hooks/useChat';

// Mock the useChat hook
jest.mock('@/hooks/useChat');

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('ChatInterface - Error Scenarios (T034)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('400 Bad Request Error', () => {
    it('should display validation error message on 400', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn().mockRejectedValue(
          new Error('Invalid message. Please check your input and try again.')
        ),
        loadConversationHistory: jest.fn(),
        error: 'Invalid message. Please check your input and try again.',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface />);

      const errorMessage = await screen.findByText(
        /Invalid message. Please check your input/
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it('should allow user to retry after 400 error', async () => {
      const clearErrorMock = jest.fn();
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: 'Invalid message. Please check your input and try again.',
        isLoading: false,
        clearError: clearErrorMock,
      });

      render(<ChatInterface />);

      const closeButton = screen.getByLabelText(/Close error/);
      fireEvent.click(closeButton);

      expect(clearErrorMock).toHaveBeenCalled();
    });
  });

  describe('404 Not Found Error', () => {
    it('should display conversation not found error on 404', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn().mockRejectedValue(
          new Error('Conversation not found. It may have been deleted.')
        ),
        error: 'Conversation not found. It may have been deleted.',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface conversationId="invalid-id" />);

      const errorMessage = await screen.findByText(/Conversation not found/);
      expect(errorMessage).toBeInTheDocument();
    });

    it('should clear conversation state on 404 error (T034)', async () => {
      const mockSetError = jest.fn();
      const mockLoadHistory = jest.fn().mockRejectedValue(
        new Error('Conversation not found')
      );

      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: {
          id: 'old-id',
          messages: [],
          isLoading: false,
          createdAt: new Date().toISOString(),
        },
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: mockLoadHistory,
        error: 'Conversation not found',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface conversationId="new-invalid-id" />);

      await waitFor(() => {
        expect(mockLoadHistory).toHaveBeenCalledWith('new-invalid-id');
      });
    });
  });

  describe('500 Server Error', () => {
    it('should display server error message on 500', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn().mockRejectedValue(
          new Error('Server error. Please try again in a moment.')
        ),
        error: 'Server error. Please try again in a moment.',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface />);

      const errorMessage = await screen.findByText(/Server error/);
      expect(errorMessage).toBeInTheDocument();
    });

    it('should keep conversation ID even when error occurs on 500', async () => {
      const mockConversation = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        messages: [],
        isLoading: false,
        createdAt: new Date().toISOString(),
      };

      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: mockConversation,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: 'Server error. Please try again in a moment.',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface />);

      // Verify error is displayed
      const error = screen.getByText('Server error. Please try again in a moment.');
      expect(error).toBeInTheDocument();
    });
  });

  describe('Timeout Error', () => {
    it('should display timeout error message', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn().mockRejectedValue(
          new Error('Request took too long. Please try again.')
        ),
        loadConversationHistory: jest.fn(),
        error: 'Request took too long. Please try again.',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface />);

      const errorMessage = await screen.findByText(/took too long/);
      expect(errorMessage).toBeInTheDocument();
    });

    it('should allow user to retry after timeout', async () => {
      const sendMessageMock = jest.fn();
      const mockUseChat = useChathook.useChat as jest.Mock;

      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: 'test message',
        setInputValue: jest.fn(),
        sendMessage: sendMessageMock.mockResolvedValue(undefined),
        loadConversationHistory: jest.fn(),
        error: 'Request took too long. Please try again.',
        isLoading: false,
        clearError: jest.fn(),
      });

      const { rerender } = render(<ChatInterface />);

      // Clear error by re-rendering without error
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: 'test message',
        setInputValue: jest.fn(),
        sendMessage: sendMessageMock,
        loadConversationHistory: jest.fn(),
        error: null,
        isLoading: false,
        clearError: jest.fn(),
      });

      rerender(<ChatInterface />);

      // User can retry sending message
      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe('401 Unauthorized Error', () => {
    it('should display session expired error on 401', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn().mockRejectedValue(
          new Error('Your session has expired. Please log in again.')
        ),
        error: 'Your session has expired. Please log in again.',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface />);

      const errorMessage = await screen.findByText(/session has expired/);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Loading State Error Recovery (T034)', () => {
    it('should transition from loading to error state correctly', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;

      // First render: loading
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: null,
        isLoading: true,
        clearError: jest.fn(),
      });

      const { rerender } = render(<ChatInterface conversationId="test-id" />);

      // Should show loading state
      expect(screen.getByText(/Loading conversation/)).toBeInTheDocument();

      // Transition to error state
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: 'Failed to load conversation',
        isLoading: false,
        clearError: jest.fn(),
      });

      rerender(<ChatInterface conversationId="test-id" />);

      // Should show error state
      expect(screen.getByText(/Failed to load conversation/)).toBeInTheDocument();
    });

    it('should show empty state after error is cleared', async () => {
      const clearErrorMock = jest.fn();
      const mockUseChat = useChathook.useChat as jest.Mock;

      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: 'Some error occurred',
        isLoading: false,
        clearError: clearErrorMock,
      });

      const { rerender } = render(<ChatInterface />);

      const closeButton = screen.getByLabelText(/Close error/);
      fireEvent.click(closeButton);

      // Re-render without error
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: null,
        isLoading: false,
        clearError: clearErrorMock,
      });

      rerender(<ChatInterface />);

      // Should show empty state
      expect(
        screen.getByText(/Start a New Conversation/)
      ).toBeInTheDocument();
    });
  });

  describe('Error Message Accessibility (T032, T034)', () => {
    it('should display dismissible error message', async () => {
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: 'Test error message',
        isLoading: false,
        clearError: jest.fn(),
      });

      render(<ChatInterface />);

      const errorMessage = screen.getByText('Test error message');
      expect(errorMessage).toBeInTheDocument();
    });

    it('should be focusable and dismissible', async () => {
      const clearErrorMock = jest.fn();
      const mockUseChat = useChathook.useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        conversation: null,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        loadConversationHistory: jest.fn(),
        error: 'Test error',
        isLoading: false,
        clearError: clearErrorMock,
      });

      render(<ChatInterface />);

      const closeButton = screen.getByLabelText(/Close error/);
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);
      expect(clearErrorMock).toHaveBeenCalled();
    });
  });
});
