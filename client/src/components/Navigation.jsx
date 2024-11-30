import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  if(!localStorage.getItem('token')){
    return;
  }
  
  const isActive = (path) => location.pathname === path;
  
  const navItemClass = (path) => `
    flex items-center gap-2 p-3 rounded-xl transition-all duration-300
    ${isActive(path) 
      ? 'text-white bg-white/20 scale-105 neon-border' 
      : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'}
  `;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto z-50 glass-morphism border-t md:border-b border-white/20 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-around md:justify-between">
        
  
        
        <Link to="/messages" className={navItemClass('/messages')}>
          <MessageCircle className="w-6 h-6 md:w-5 md:h-5" />
          <span className="hidden md:inline font-medium">Messages</span>
        </Link>
        
        <Link to="/profile" className={navItemClass('/profile')}>
          <User className="w-6 h-6 md:w-5 md:h-5" />
          <span className="hidden md:inline font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}