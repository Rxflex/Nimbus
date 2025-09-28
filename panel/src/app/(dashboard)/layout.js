'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/');
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      />
      <div className="flex">
        <Sidebar
          currentPath={pathname}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}