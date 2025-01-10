import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, FireIcon, StarIcon } from '@heroicons/react/24/outline';

const TOPICS = [
  { name: 'Gaming', icon: '🎮' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Business', icon: '💼' },
  { name: 'Crypto', icon: '₿' },
  { name: 'Television', icon: '📺' },
  { name: 'Celebrity', icon: '🌟' }
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:block w-[250px] space-y-4 flex-shrink-0">
      <div className="bg-white rounded border border-gray-300">
        <div className="p-4 space-y-3">
          <Link to="/" className="flex items-center gap-2 text-gray-800 hover:bg-gray-50 p-2 rounded">
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/popular" className="flex items-center gap-2 text-gray-800 hover:bg-gray-50 p-2 rounded">
            <FireIcon className="w-5 h-5" />
            <span>Popular</span>
          </Link>
          <Link to="/all" className="flex items-center gap-2 text-gray-800 hover:bg-gray-50 p-2 rounded">
            <StarIcon className="w-5 h-5" />
            <span>All</span>
          </Link>
        </div>
        
        <hr className="border-gray-300" />
        
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3">TOPICS</h3>
          <div className="space-y-2">
            {TOPICS.map(topic => (
              <Link
                key={topic.name}
                to={`/topic/${topic.name.toLowerCase()}`}
                className="flex items-center gap-2 text-gray-800 hover:bg-gray-50 p-2 rounded"
              >
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;