import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen animate-gradient bg-gradient-to-br from-neon-pink via-neon-purple to-neon-red">
      <Navigation />
      <main className="pb-20 md:pb-0 md:pt-20">
        <Outlet />
      </main>
    </div>
  );
}