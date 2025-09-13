'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin login page
    router.replace('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div 
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: 'var(--ui-interactive-hover, #70843d)' }}
        ></div>
        <p className="text-gray-600">Redirecting to admin login...</p>
      </div>
    </div>
  );
}
