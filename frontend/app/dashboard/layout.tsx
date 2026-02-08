'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import Header from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pb-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
