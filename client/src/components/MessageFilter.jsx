import React from 'react';
import { Calendar, Star, Clock } from 'lucide-react';

export default function MessageFilter({ activeFilter, setActiveFilter }) {
  const filterButtonClass = (isActive) =>
    `flex items-center justify-center gap-2 py-3 px-6 rounded-xl glass-morphism text-white transition-all duration-300 transform hover:scale-105 neon-border 
    ${isActive ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-black shadow-lg' : 'hover:bg-white/15'}`;

  const filters = [
    { key: 'starred', label: 'Starred', icon: <Star className="w-5 h-5 text-neon-green" /> },
    { key: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5 text-neon-blue" /> },
    { key: 'week', label: 'This Week', icon: <Calendar className="w-5 h-5 text-neon-pink" /> },
    { key: 'month', label: 'This Month', icon: <Calendar className="w-5 h-5 text-neon-purple" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {filters.map((filter) => (
        <button
          key={filter.key}
          className={filterButtonClass(activeFilter === filter.key)}
          onClick={() => setActiveFilter(filter.key)}
        >
          {filter.icon}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
