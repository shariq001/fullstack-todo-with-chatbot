module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/frontend/utils/chat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Chat Utilities - Pure functions for chat operations
 * No side effects; all functions are deterministic and testable
 */ /**
 * Validates a chat message before sending.
 * Rules:
 * - Must not be empty
 * - Must not be only whitespace
 * - Must not exceed max length
 * @param message - Message content to validate
 * @param maxLength - Maximum message length (default: 5000)
 * @returns Object with valid flag and error message if invalid
 */ __turbopack_context__.s([
    "formatTimestamp",
    ()=>formatTimestamp,
    "generateUUID",
    ()=>generateUUID,
    "handleChatError",
    ()=>handleChatError,
    "isValidUUID",
    ()=>isValidUUID,
    "sanitizeMessage",
    ()=>sanitizeMessage,
    "truncateMessage",
    ()=>truncateMessage,
    "validateMessage",
    ()=>validateMessage
]);
function validateMessage(message, maxLength = 5000) {
    if (!message) {
        return {
            valid: false,
            error: 'Message cannot be empty'
        };
    }
    const trimmed = message.trim();
    if (trimmed.length === 0) {
        return {
            valid: false,
            error: 'Message cannot be only whitespace'
        };
    }
    if (trimmed.length > maxLength) {
        return {
            valid: false,
            error: `Message exceeds maximum length of ${maxLength} characters`
        };
    }
    return {
        valid: true
    };
}
function formatTimestamp(timestamp, includeDate = false) {
    try {
        const date = new Date(timestamp);
        if (includeDate) {
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return timestamp; // Return original if parsing fails
    }
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
function handleChatError(error) {
    // Handle fetch/network errors
    if (error instanceof TypeError) {
        return {
            code: 'NETWORK_ERROR',
            message: 'Network connection failed. Please check your connection.',
            action: 'retry'
        };
    }
    // Handle custom error objects with status
    if (typeof error === 'object' && error !== null && 'status' in error) {
        const status = error.status;
        if (status === 400) {
            return {
                code: 'VALIDATION_ERROR',
                message: 'Invalid message. Please check your input and try again.',
                action: 'clarify'
            };
        }
        if (status === 404) {
            return {
                code: 'NOT_FOUND',
                message: 'Conversation not found. It may have been deleted. Start a new conversation.',
                action: 'new'
            };
        }
        if (status === 401) {
            return {
                code: 'UNAUTHORIZED',
                message: 'Your session has expired. Please log in again.',
                action: 'login'
            };
        }
        if (status === 500) {
            return {
                code: 'SERVER_ERROR',
                message: 'Server error. Please try again in a moment.',
                action: 'retry'
            };
        }
        if (status === 503) {
            return {
                code: 'SERVICE_UNAVAILABLE',
                message: 'Service temporarily unavailable. Please try again later.',
                action: 'retry'
            };
        }
    }
    // Handle timeout
    if (error instanceof Error && error.message.includes('timeout')) {
        return {
            code: 'TIMEOUT',
            message: 'Request took too long. Please try again.',
            action: 'retry'
        };
    }
    // Default unknown error
    return {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.',
        action: 'retry'
    };
}
function sanitizeMessage(content) {
    // Basic HTML escape for user-provided content
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
}
function truncateMessage(content, maxLength = 100) {
    if (content.length <= maxLength) {
        return content;
    }
    return content.substring(0, maxLength) + '...';
}
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
}),
"[project]/frontend/constants/chat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Chat Constants - Configuration and message templates
 */ // API Configuration
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "CHAT_API_URL",
    ()=>CHAT_API_URL,
    "CHAT_ENDPOINT",
    ()=>CHAT_ENDPOINT,
    "DESIGN_SYSTEM_BORDERS",
    ()=>DESIGN_SYSTEM_BORDERS,
    "DESIGN_SYSTEM_COLORS",
    ()=>DESIGN_SYSTEM_COLORS,
    "DESIGN_SYSTEM_SPACING",
    ()=>DESIGN_SYSTEM_SPACING,
    "DESIGN_SYSTEM_TYPOGRAPHY",
    ()=>DESIGN_SYSTEM_TYPOGRAPHY,
    "ERROR_MESSAGES",
    ()=>ERROR_MESSAGES,
    "FEATURE_FLAGS",
    ()=>FEATURE_FLAGS,
    "LOADING_FEEDBACK_MS",
    ()=>LOADING_FEEDBACK_MS,
    "LOADING_MESSAGES",
    ()=>LOADING_MESSAGES,
    "MAX_MESSAGE_LENGTH",
    ()=>MAX_MESSAGE_LENGTH,
    "MAX_RETRIES",
    ()=>MAX_RETRIES,
    "MESSAGE_ROLE_ALIGNMENT",
    ()=>MESSAGE_ROLE_ALIGNMENT,
    "MESSAGE_ROLE_COLORS",
    ()=>MESSAGE_ROLE_COLORS,
    "REQUEST_TIMEOUT_MS",
    ()=>REQUEST_TIMEOUT_MS,
    "RETRY_DELAY_MS",
    ()=>RETRY_DELAY_MS,
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS,
    "SUCCESS_MESSAGES",
    ()=>SUCCESS_MESSAGES,
    "UI_CONFIG",
    ()=>UI_CONFIG
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
const CHAT_ENDPOINT = '/api/chat';
const CHAT_API_URL = `${API_BASE_URL}${CHAT_ENDPOINT}`;
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds
const LOADING_FEEDBACK_MS = 500; // Show loading indicator after 500ms
const MAX_MESSAGE_LENGTH = 5000;
const RETRY_DELAY_MS = 1000;
const MAX_RETRIES = 3;
const ERROR_MESSAGES = {
    EMPTY_MESSAGE: 'Message cannot be empty',
    MESSAGE_TOO_LONG: 'Message exceeds maximum length',
    NETWORK_ERROR: 'Network connection failed. Please check your connection.',
    TIMEOUT: 'Request took too long. Please try again.',
    VALIDATION_ERROR: 'Invalid message. Please check your input and try again.',
    NOT_FOUND: 'Conversation not found. It may have been deleted. Start a new conversation.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    SERVER_ERROR: 'Server error. Please try again in a moment.',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    CONVERSATION_LOAD_FAILED: 'Failed to load conversation. Please try again.'
};
const SUCCESS_MESSAGES = {
    MESSAGE_SENT: 'Message sent',
    CONVERSATION_CREATED: 'New conversation started',
    CONVERSATION_LOADED: 'Conversation loaded'
};
const LOADING_MESSAGES = {
    SENDING: 'Sending message...',
    LOADING_HISTORY: 'Loading conversation history...',
    PROCESSING: 'Processing...'
};
const UI_CONFIG = {
    ANIMATION_DURATION_MS: 300,
    TOAST_DURATION_MS: 5000,
    LOADING_SPINNER_SIZE: 'md',
    INPUT_PLACEHOLDER: 'Type your message here...',
    SEND_BUTTON_TEXT: 'Send',
    SENDING_BUTTON_TEXT: 'Sending...'
};
const DESIGN_SYSTEM_COLORS = {
    primary: 'blue-500',
    secondary: 'gray-500',
    success: 'green-500',
    error: 'red-500',
    warning: 'yellow-500'
};
const MESSAGE_ROLE_COLORS = {
    user: 'bg-blue-100 text-blue-900 rounded-lg',
    assistant: 'bg-gray-100 text-gray-900 rounded-lg',
    system: 'bg-yellow-50 text-yellow-800 rounded-lg'
};
const MESSAGE_ROLE_ALIGNMENT = {
    user: 'justify-end',
    assistant: 'justify-start',
    system: 'justify-center'
};
const DESIGN_SYSTEM_SPACING = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
};
const DESIGN_SYSTEM_TYPOGRAPHY = {
    body: 'text-sm text-gray-900',
    caption: 'text-xs text-gray-600',
    heading: 'text-lg font-bold text-gray-900'
};
const DESIGN_SYSTEM_BORDERS = {
    light: 'border border-gray-200',
    medium: 'border border-gray-300',
    dark: 'border border-gray-400'
};
const STORAGE_KEYS = {
    LAST_CONVERSATION_ID: 'chat_last_conversation_id',
    CONVERSATIONS_CACHE: 'chat_conversations_cache',
    USER_PREFERENCES: 'chat_user_preferences'
};
const FEATURE_FLAGS = {
    ENABLE_TOOL_DISPLAY: false,
    ENABLE_DEBUG_MODE: false,
    ENABLE_STREAMING: true,
    ENABLE_CONVERSATION_HISTORY: true
};
}),
"[project]/frontend/hooks/useChat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useChat",
    ()=>useChat
]);
/**
 * useChat Hook - Main API client hook for chat operations
 * Handles message sending, conversation loading, error management, and state
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/chat.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/constants/chat.ts [app-ssr] (ecmascript)");
;
;
;
const useChat = ()=>{
    const [conversation, setConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /**
   * Clear error state
   */ const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setError(null);
    }, []);
    /**
   * Send a message to the API and update conversation state
   * @param message - Message content to send
   */ const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (message)=>{
        // Validate input
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateMessage"])(message);
        if (!validation.valid) {
            setError(validation.error || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].EMPTY_MESSAGE);
            return;
        }
        clearError();
        setIsLoading(true);
        try {
            // Create optimistic message for UI
            const userMessage = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUUID"])(),
                role: 'user',
                content: message.trim(),
                createdAt: new Date().toISOString(),
                isLoading: false
            };
            // Update conversation with user message
            const updatedConversation = {
                ...conversation || {
                    id: '',
                    messages: [],
                    isLoading: false,
                    createdAt: new Date().toISOString()
                },
                messages: [
                    ...conversation?.messages || [],
                    userMessage
                ],
                lastMessageAt: new Date().toISOString()
            };
            setConversation(updatedConversation);
            setInputValue(''); // Clear input immediately
            // Add loading message
            const loadingMessage = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUUID"])(),
                role: 'assistant',
                content: 'Typing...',
                createdAt: new Date().toISOString(),
                isLoading: true
            };
            setConversation((prev)=>prev ? {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        loadingMessage
                    ]
                } : null);
            // Build request payload
            const request = {
                message: message.trim(),
                conversation_id: conversation?.id
            };
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REQUEST_TIMEOUT_MS"]);
            try {
                // Call API
                const response = await fetch(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAT_API_URL"], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request),
                    signal: controller.signal,
                    credentials: 'include'
                });
                clearTimeout(timeoutId);
                // Handle error responses
                if (!response.ok) {
                    const errorData = await response.json().catch(()=>({}));
                    const errorObj = {
                        status: response.status,
                        ...errorData
                    };
                    const { message: errorMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleChatError"])(errorObj);
                    throw new Error(errorMessage);
                }
                // Parse response
                const data = await response.json();
                // Create assistant message
                const assistantMessage = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUUID"])(),
                    role: 'assistant',
                    content: data.response,
                    toolName: data.toolName,
                    toolResult: data.toolResult,
                    createdAt: new Date().toISOString(),
                    isLoading: false
                };
                // Update conversation with response
                setConversation((prev)=>{
                    if (!prev) {
                        return null;
                    }
                    // Replace loading message with actual response
                    const messages = prev.messages.slice(0, -1); // Remove loading message
                    messages.push(assistantMessage);
                    return {
                        ...prev,
                        id: data.conversation_id,
                        messages,
                        lastMessageAt: new Date().toISOString()
                    };
                });
                // Save conversation ID and metadata to localStorage (T023)
                if (data.conversation_id) {
                    try {
                        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].LAST_CONVERSATION_ID, JSON.stringify({
                            id: data.conversation_id,
                            lastAccessedAt: new Date().toISOString()
                        }));
                    } catch (storageError) {
                        // localStorage might be full or unavailable; fail silently
                        console.warn('Failed to save conversation to localStorage:', storageError);
                    }
                }
            } catch (fetchError) {
                clearTimeout(timeoutId);
                // Remove loading message on error
                setConversation((prev)=>prev ? {
                        ...prev,
                        messages: prev.messages.slice(0, -1)
                    } : null);
                if (fetchError instanceof Error) {
                    if (fetchError.name === 'AbortError') {
                        setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].TIMEOUT);
                    } else {
                        setError(fetchError.message);
                    }
                } else {
                    setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].UNKNOWN_ERROR);
                }
            }
        } catch (err) {
            const { message: errorMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleChatError"])(err);
            setError(errorMessage);
        } finally{
            setIsLoading(false);
        }
    }, [
        conversation,
        clearError
    ]);
    /**
   * Load conversation history from the backend
   * @param conversationId - ID of conversation to load
   * @returns Promise that resolves when conversation is loaded or error occurs
   */ const loadConversationHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (conversationId)=>{
        // Validate conversation ID format
        if (!conversationId || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidUUID"])(conversationId)) {
            setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].NOT_FOUND);
            return [];
        }
        setIsLoading(true);
        clearError();
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REQUEST_TIMEOUT_MS"]);
            try {
                // Fetch conversation history from backend
                // Uses GET request with conversation_id as query parameter
                const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAT_API_URL"]}?conversation_id=${encodeURIComponent(conversationId)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal,
                    credentials: 'include'
                });
                clearTimeout(timeoutId);
                // Handle error responses
                if (!response.ok) {
                    if (response.status === 404) {
                        setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].NOT_FOUND);
                        // Clear invalid conversation from localStorage
                        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].LAST_CONVERSATION_ID);
                    } else if (response.status === 401) {
                        setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].UNAUTHORIZED);
                    } else {
                        throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].CONVERSATION_LOAD_FAILED);
                    }
                    return [];
                }
                // Parse response and validate structure
                const data = await response.json();
                if (data.messages && Array.isArray(data.messages)) {
                    // Create conversation object from loaded data
                    const loadedConversation = {
                        id: conversationId,
                        messages: data.messages,
                        isLoading: false,
                        createdAt: data.createdAt || new Date().toISOString(),
                        lastMessageAt: data.lastMessageAt || new Date().toISOString()
                    };
                    setConversation(loadedConversation);
                    return data.messages;
                }
                return [];
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError instanceof Error) {
                    if (fetchError.name === 'AbortError') {
                        setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].TIMEOUT);
                    } else {
                        setError(fetchError.message);
                    }
                } else {
                    setError(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].CONVERSATION_LOAD_FAILED);
                }
                return [];
            }
        } finally{
            setIsLoading(false);
        }
    }, [
        clearError
    ]);
    /**
   * Get last conversation ID from localStorage with validation
   * Handles both legacy (string) and new (JSON) formats
   * @returns Conversation ID if valid, null otherwise
   */ const getLastConversationIdFromStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        try {
            const stored = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].LAST_CONVERSATION_ID);
            if (!stored) {
                return null;
            }
            // Try to parse as JSON (new format: { id, lastAccessedAt })
            try {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object' && 'id' in parsed) {
                    const id = parsed.id;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidUUID"])(id) ? id : null;
                }
            } catch  {
                // Fall back to legacy string format
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidUUID"])(stored)) {
                    return stored;
                }
            }
            return null;
        } catch  {
            return null;
        }
    }, []);
    /**
   * Load last conversation from localStorage on mount (T023)
   * Only loads if:
   * 1. No conversation_id in URL
   * 2. localStorage has valid last conversation
   * 3. No existing conversation in state
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        clearError
    };
};
}),
"[project]/frontend/components/MessageList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageList",
    ()=>MessageList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * MessageList Component
 * Displays messages in chronological order with role-based styling
 * Shows timestamps and loading indicators
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/chat.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/constants/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const MessageList = ({ messages })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Message, {
                message: message
            }, message.id, false, {
                fileName: "[project]/frontend/components/MessageList.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/frontend/components/MessageList.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const Message = ({ message })=>{
    const alignmentClass = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MESSAGE_ROLE_ALIGNMENT"][message.role];
    const bgColorClass = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MESSAGE_ROLE_COLORS"][message.role];
    // T033: Responsive message width based on viewport
    const messageWidthClass = message.role === 'system' ? 'max-w-full' : 'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex ${alignmentClass}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${messageWidthClass} px-4 py-3 ${bgColorClass} ${message.role === 'system' ? 'text-center text-sm italic' : ''}`,
            role: "article",
            "aria-label": message.isLoading ? 'Loading response' : 'Message',
            children: [
                message.isLoading && message.toolName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs font-medium",
                            children: [
                                "Executing ",
                                message.toolName,
                                "..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce h-2 w-2 bg-current rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce h-2 w-2 bg-current rounded-full animation-delay-100"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce h-2 w-2 bg-current rounded-full animation-delay-200"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/MessageList.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                message.isLoading && !message.toolName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce h-2 w-2 bg-current rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce h-2 w-2 bg-current rounded-full animation-delay-100"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-bounce h-2 w-2 bg-current rounded-full animation-delay-200"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/MessageList.tsx",
                    lineNumber: 66,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                !message.isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm break-words",
                            children: message.content
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        message.toolResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 pt-2 border-t border-current border-opacity-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold mb-1",
                                    children: message.toolName ? `${message.toolName} Result:` : 'Tool Result:'
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/MessageList.tsx",
                                    lineNumber: 81,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "text-xs overflow-x-auto bg-black bg-opacity-10 p-2 rounded",
                                    children: JSON.stringify(message.toolResult, null, 2)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/MessageList.tsx",
                                    lineNumber: 84,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 80,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        message.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 pt-2 border-t border-red-300",
                            role: "alert",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold text-red-600",
                                    children: "Error:"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/MessageList.tsx",
                                    lineNumber: 96,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-red-600",
                                    children: message.error
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/MessageList.tsx",
                                    lineNumber: 97,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 92,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs opacity-70 mt-1",
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTimestamp"])(message.createdAt)
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/MessageList.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/components/MessageList.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend/components/MessageList.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/frontend/components/ChatInput.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatInput",
    ()=>ChatInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * ChatInput Component
 * Message input field with Send button
 * Handles validation and submission
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/chat.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/constants/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const ChatInput = ({ value, onChange, onSubmit, isLoading, disabled = false })=>{
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    /**
   * Handle form submission
   */ const handleSubmit = async (e)=>{
        e.preventDefault();
        // Validate
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateMessage"])(value);
        if (!validation.valid) {
            setError(validation.error || 'Invalid message');
            return;
        }
        setError(null);
        // Submit
        try {
            await onSubmit(value);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        }
    };
    /**
   * Handle key press (Enter to send)
   */ const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            const form = inputRef.current?.form;
            if (form) {
                form.dispatchEvent(new Event('submit', {
                    bubbles: true
                }));
            }
        }
    };
    /**
   * Auto-resize textarea based on content
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
        }
    }, [
        value
    ]);
    /**
   * Focus input on mount
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        inputRef.current?.focus();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-3",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/frontend/components/ChatInput.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "message-input",
                                className: "sr-only",
                                children: "Message input"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInput.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: inputRef,
                                id: "message-input",
                                value: value,
                                onChange: (e)=>{
                                    onChange(e.target.value);
                                    setError(null); // Clear error on new input
                                },
                                onKeyDown: handleKeyDown,
                                placeholder: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UI_CONFIG"].INPUT_PLACEHOLDER,
                                disabled: disabled,
                                maxLength: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_MESSAGE_LENGTH"],
                                rows: 1,
                                className: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'bg-white text-gray-900'} focus:opacity-100`,
                                "aria-label": "Message input",
                                "aria-disabled": disabled,
                                "aria-describedby": "character-count",
                                "data-testid": "message-input"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInput.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/ChatInput.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: disabled || !value.trim(),
                        className: `px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled || !value.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500'}`,
                        "aria-label": isLoading ? 'Sending message' : 'Send message',
                        "aria-busy": isLoading,
                        "data-testid": "send-button",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-block",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 animate-spin",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                className: "opacity-25",
                                                cx: "12",
                                                cy: "12",
                                                r: "10",
                                                stroke: "currentColor",
                                                strokeWidth: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/components/ChatInput.tsx",
                                                lineNumber: 160,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                className: "opacity-75",
                                                fill: "currentColor",
                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/components/ChatInput.tsx",
                                                lineNumber: 168,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/components/ChatInput.tsx",
                                        lineNumber: 154,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/ChatInput.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UI_CONFIG"].SENDING_BUTTON_TEXT
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/ChatInput.tsx",
                            lineNumber: 152,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UI_CONFIG"].SEND_BUTTON_TEXT
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/ChatInput.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/ChatInput.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: "character-count",
                        className: "text-xs text-gray-500",
                        "aria-live": "polite",
                        "aria-atomic": "true",
                        children: [
                            value.length,
                            "/",
                            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_MESSAGE_LENGTH"],
                            " characters"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/ChatInput.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    value.length > __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$constants$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_MESSAGE_LENGTH"] * 0.9 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-yellow-600",
                        role: "status",
                        children: "You are approaching the character limit"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/ChatInput.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/ChatInput.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-400 italic",
                children: [
                    "Press ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                        className: "bg-gray-100 px-2 py-1 rounded text-gray-700",
                        children: "Enter"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/ChatInput.tsx",
                        lineNumber: 202,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)),
                    " to send,",
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                        className: "bg-gray-100 px-2 py-1 rounded text-gray-700",
                        children: "Shift+Enter"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/ChatInput.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    " for new line"
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/ChatInput.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/ChatInput.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/frontend/components/ChatInterface.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatInterface",
    ()=>ChatInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * ChatInterface Component
 * Main chat UI component that combines MessageList and ChatInput
 * Manages conversation state and auto-scrolling
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$useChat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/hooks/useChat.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$MessageList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/MessageList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/ChatInput.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const ChatInterface = ({ conversationId })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { conversation, inputValue, setInputValue, sendMessage, loadConversationHistory, error, isLoading, clearError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$useChat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useChat"])();
    const [hasLoadedHistory, setHasLoadedHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /**
   * Load conversation history on component mount or when conversation ID changes (T022)
   * Handles:
   * - Loading history when conversationId is provided
   * - Switching conversations when conversationId URL parameter changes
   * - Clearing state for new conversations (id=null)
   * - No duplicate requests via hasLoadedHistory flag
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Track if component is still mounted to prevent state updates after unmount
        let isMounted = true;
        const loadHistory = async ()=>{
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
        return ()=>{
            isMounted = false;
        };
    }, [
        conversationId,
        conversation?.id,
        hasLoadedHistory,
        loadConversationHistory
    ]);
    /**
   * Auto-scroll to bottom when messages change
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [
        conversation?.messages
    ]);
    /**
   * Update URL when conversation ID is established
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (conversation?.id && conversation.id !== conversationId) {
            router.push(`/chat?id=${conversation.id}`, {
                scroll: false
            });
        }
    }, [
        conversation?.id,
        conversationId,
        router
    ]);
    /**
   * Handle message submission
   */ const handleSubmit = async (message)=>{
        if (message.trim()) {
            await sendMessage(message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg border border-gray-200 shadow-sm",
        role: "region",
        "aria-label": "Chat interface",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 max-h-screen",
                children: isLoading && (!conversation || conversation.messages.length === 0) ? // T026, T030: Loading state while fetching conversation history
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                                    lineNumber: 124,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInterface.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 font-medium",
                                children: "Loading conversation..."
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInterface.tsx",
                                lineNumber: 126,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/ChatInterface.tsx",
                        lineNumber: 122,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : !conversation || conversation.messages.length === 0 ? // Empty state for new conversation - T031: Design system
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-gray-900 mb-3",
                                children: "Start a New Conversation"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInterface.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-4",
                                children: "Chat naturally to manage your tasks. Try asking something like:"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInterface.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "text-sm text-gray-500 space-y-1 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: '"Add a task: buy milk"'
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/ChatInterface.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: '"List all my tasks"'
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/ChatInterface.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: '"Mark task as done"'
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/ChatInterface.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/components/ChatInterface.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/ChatInterface.tsx",
                        lineNumber: 132,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : // Display loaded messages - T031: Message styling
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$MessageList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageList"], {
                            messages: conversation.messages
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/ChatInterface.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: messagesEndRef
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/ChatInterface.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/frontend/components/ChatInterface.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 bg-red-50 border-t border-red-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-red-900",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/ChatInterface.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/ChatInterface.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: clearError,
                            className: "ml-2 inline-flex text-red-400 hover:text-red-600 focus:outline-none transition-colors",
                            "aria-label": "Close error message",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    viewBox: "0 0 20 20",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/ChatInterface.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/ChatInterface.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                    lineNumber: 158,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend/components/ChatInterface.tsx",
                lineNumber: 157,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-gray-200 p-6 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatInput"], {
                    value: inputValue,
                    onChange: setInputValue,
                    onSubmit: handleSubmit,
                    isLoading: isLoading,
                    disabled: isLoading
                }, void 0, false, {
                    fileName: "[project]/frontend/components/ChatInterface.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend/components/ChatInterface.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/ChatInterface.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/frontend/src/auth/better-auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authClient",
    ()=>authClient,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/better-auth/dist/client/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/better-auth/dist/client/vanilla.mjs [app-ssr] (ecmascript)");
;
const authClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$vanilla$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAuthClient"])({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:3002") || "http://localhost:3000"
});
const __TURBOPACK__default__export__ = authClient;
;
}),
"[project]/frontend/src/auth/auth-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthSession",
    ()=>clearAuthSession,
    "getSession",
    ()=>getSession,
    "getToken",
    ()=>getToken,
    "isAuthenticated",
    ()=>isAuthenticated,
    "isTokenExpired",
    ()=>isTokenExpired,
    "setSession",
    ()=>setSession,
    "setToken",
    ()=>setToken
]);
/**
 * Authentication utilities for Better Auth integration.
 * Tokens are stored in localStorage after login for use with the backend API.
 */ const TOKEN_KEY = 'auth-token';
const SESSION_KEY = 'auth-session';
const getToken = async ()=>{
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};
const setToken = (token)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
const setSession = (session)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
const getSession = ()=>{
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    } catch  {
        return null;
    }
};
const isAuthenticated = async ()=>{
    const token = await getToken();
    if (!token) return false;
    return !isTokenExpired(token);
};
const isTokenExpired = (token)=>{
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch  {
        return true;
    }
};
const clearAuthSession = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
}),
"[project]/frontend/services/auth-service.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthService",
    ()=>AuthService
]);
// Better Auth service integration
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/auth/better-auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/auth/auth-utils.ts [app-ssr] (ecmascript)");
;
;
;
async function fetchAndStoreJWT() {
    try {
        // Fetch JWT from our custom endpoint (uses session cookie)
        const response = await fetch('/api/auth/jwt', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setToken"])(data.token);
                return data.token;
            }
        }
    } catch (error) {
        console.error('Failed to fetch JWT token:', error);
    }
    return null;
}
class AuthService {
    static async login(credentials) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signIn.email(credentials);
            if (result.error) {
                throw new Error(result.error.message || 'Login failed');
            }
            if (result.data) {
                // Fetch JWT token for backend API calls
                const jwtToken = await fetchAndStoreJWT();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSession"])({
                    user: result.data.user,
                    token: jwtToken || result.data.token
                });
            }
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
    static async register(userData) {
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signUp.email({
                email: userData.email,
                password: userData.password,
                name: userData.email.split('@')[0]
            });
            if (result.error) {
                throw new Error(result.error.message || 'Registration failed');
            }
            if (result.data) {
                // Fetch JWT token for backend API calls
                const jwtToken = await fetchAndStoreJWT();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSession"])({
                    user: result.data.user,
                    token: jwtToken || result.data.token
                });
            }
            return result;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    static async forgotPassword(email) {
        const baseURL = ("TURBOPACK compile-time value", "http://localhost:3002") || "http://localhost:3000";
        const response = await fetch(`${baseURL}/api/auth/forget-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                redirectTo: '/reset-password'
            })
        });
        if (!response.ok) {
            throw new Error('Failed to send password reset email');
        }
        return response.json();
    }
    static async resetPassword(token, newPassword) {
        const baseURL = ("TURBOPACK compile-time value", "http://localhost:3002") || "http://localhost:3000";
        const response = await fetch(`${baseURL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                newPassword
            })
        });
        if (!response.ok) {
            throw new Error('Failed to reset password');
        }
        return response.json();
    }
    static async logout() {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$better$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authClient"].signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthSession"])();
        }
    }
    static getCurrentSession() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$auth$2f$auth$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSession"])();
    }
    static async isAuthenticated() {
        const session = this.getCurrentSession();
        return !!session?.user;
    }
}
}),
"[project]/frontend/hooks/use-auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
// Authentication hook for managing auth state
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/services/auth-service.ts [app-ssr] (ecmascript) <locals>");
;
;
;
const useAuth = ()=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkAuthStatus = async ()=>{
            try {
                const session = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].getCurrentSession();
                if (session?.user && await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].isAuthenticated()) {
                    setUser(session.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally{
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);
    const login = async (credentials)=>{
        setLoading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].login(credentials);
            const session = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].getCurrentSession();
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const register = async (userData)=>{
        setLoading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].register(userData);
            const session = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].getCurrentSession();
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            }
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const logout = async ()=>{
        setLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AuthService"].logout();
            setUser(null);
            setIsAuthenticated(false);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setLoading(false);
        }
    };
    return {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };
};
}),
"[project]/frontend/app/chat/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Chat Page Component
 * Main page for the chat interface
 * Accepts optional conversation_id URL parameter
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ChatInterface$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/ChatInterface.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/hooks/use-auth.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const dynamic = 'force-dynamic';
function ChatPageContent() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // Extract conversation_id from URL parameter (T021)
    // Validates UUID format before passing to ChatInterface
    let conversationId = undefined;
    if (searchParams) {
        const idParam = searchParams.get('id');
        if (idParam) {
            // Basic UUID validation: must be 36 chars with hyphens
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam)) {
                conversationId = idParam;
            }
        }
    }
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Show loading state while auth is being checked
    if (loading || !mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Loading chat..."
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/chat/page.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/chat/page.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this);
    }
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900 mb-4",
                        children: "Authentication Required"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-6",
                        children: "Please log in to use the chat feature."
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/login",
                        className: "inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
                        children: "Go to Login"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/chat/page.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/app/chat/page.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b border-gray-200 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-4 py-4 flex justify-between items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-gray-900",
                                    children: "Todo Chat"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/chat/page.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mt-1",
                                    children: "Chat naturally to manage your tasks"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/chat/page.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/chat/page.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/dashboard",
                            className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 mr-2",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M9 19V6l12-3v13M9 19H7a2 2 0 01-2-2m2 2h2a2 2 0 002-2M9 19l12-3"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/chat/page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/chat/page.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                "My Tasks"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/chat/page.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/chat/page.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/chat/page.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-6xl mx-auto px-4 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$ChatInterface$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChatInterface"], {
                    conversationId: conversationId || undefined
                }, void 0, false, {
                    fileName: "[project]/frontend/app/chat/page.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/chat/page.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/chat/page.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
function ChatPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, void 0),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/chat/page.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, void 0)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/chat/page.tsx",
                lineNumber: 107,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/frontend/app/chat/page.tsx",
            lineNumber: 106,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatPageContent, {}, void 0, false, {
            fileName: "[project]/frontend/app/chat/page.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/chat/page.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f22543a6._.js.map