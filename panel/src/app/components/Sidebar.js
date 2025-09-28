'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Sidebar({ currentPath, isOpen, onClose }) {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/agents', label: 'Agents', icon: '🤖' },
    { path: '/rules', label: 'Rules', icon: '📋' },
    { path: '/routes', label: 'Routes', icon: '🛣️' },
    { path: '/geodns', label: 'GeoDNS', icon: '🌍' },
    { path: '/users', label: 'Users', icon: '👥' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background border-r min-h-screen transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <Button
                    variant={currentPath === item.path ? "secondary" : "ghost"}
                    onClick={onClose}
                    className={cn(
                      "w-full justify-start",
                      currentPath === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}