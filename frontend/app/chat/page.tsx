'use client';

/**
 * Chat Page Component
 * Main page for the chat interface
 * Accepts optional conversation_id URL parameter
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/ChatInterface';
import { useAuth } from '@/hooks/use-auth';

export const dynamic = 'force-dynamic';

function ChatPageContent() {
  const searchParams = useSearchParams();
  // Extract conversation_id from URL parameter (T021)
  // Validates UUID format before passing to ChatInterface
  let conversationId: string | undefined = undefined;

  if (searchParams) {
    const idParam = searchParams.get('id');
    if (idParam) {
      // Basic UUID validation: must be 36 chars with hyphens
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam)) {
        conversationId = idParam;
      }
    }
  }

  const { isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while auth is being checked
  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to use the chat feature.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todo Chat</h1>
            <p className="text-sm text-gray-600 mt-1">
              Chat naturally to manage your tasks
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19H7a2 2 0 01-2-2m2 2h2a2 2 0 002-2M9 19l12-3" />
            </svg>
            My Tasks
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <ChatInterface conversationId={conversationId || undefined} />
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
