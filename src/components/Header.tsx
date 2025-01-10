import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white h-12 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1600px] h-full mx-auto px-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/reddit-logo.svg" alt="Reddit" className="h-8 w-auto" />
        </Link>

        <div className="flex-1 max-w-[690px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Reddit"
              className="w-full h-9 bg-[#F6F7F8] rounded-full pl-10 pr-4 border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-8 px-4 text-sm font-semibold rounded-full border border-blue-500 text-blue-500 hover:bg-[#F6F7F8]">
            Log In
          </button>
          <button className="h-8 px-4 text-sm font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600">
            Sign Up
          </button>
          <button
            className="flex items-center gap-1 p-1 hover:bg-[#F6F7F8] rounded"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;