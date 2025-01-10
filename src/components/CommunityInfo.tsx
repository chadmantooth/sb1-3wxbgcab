import React from 'react';
import { CakeIcon } from '@heroicons/react/24/outline';

const CommunityInfo = () => {
  return (
    <aside className="hidden xl:block w-[300px] space-y-4 flex-shrink-0">
      <div className="bg-white rounded border border-gray-300">
        <div className="p-3 bg-blue-500 rounded-t">
          <h2 className="text-white font-bold">About Community</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">
            Your home for discussing everything Reddit-related!
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <CakeIcon className="w-5 h-5" />
            <span>Created Jan 25, 2008</span>
          </div>
          
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Members</span>
              <span className="font-medium">789.9k</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Online</span>
              <span className="font-medium">2.1k</span>
            </div>
          </div>
          
          <button className="w-full mt-4 h-8 px-4 text-sm font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600">
            Join Community
          </button>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-300 p-4">
        <h3 className="text-sm font-medium mb-4">Community Rules</h3>
        <ol className="text-sm space-y-2">
          <li>1. Remember the human</li>
          <li>2. Behave like you would in real life</li>
          <li>3. Look for the original source of content</li>
          <li>4. Search for duplicates before posting</li>
          <li>5. Read the community's rules</li>
        </ol>
      </div>
    </aside>
  );
};

export default CommunityInfo;