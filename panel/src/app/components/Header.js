'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';

export default function Header({ user, onLogout, onMenuToggle, isMenuOpen }) {
  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <h1 className="text-lg sm:text-xl font-semibold">
              Nimbus Control Panel
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">
                {user?.username}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-xs sm:text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
