import React from 'react';
import Post from './Post';

const MOCK_POSTS = [
  {
    id: 1,
    title: 'What are your favorite subreddits?',
    author: 'user123',
    subreddit: 'AskReddit',
    upvotes: 15200,
    commentCount: 3421,
    timeAgo: '5 hours ago',
    content: 'Share your favorite subreddits and why you love them!'
  },
  // Add more mock posts here
];

const Feed = () => {
  return (
    <div className="flex-1 space-y-4">
      <div className="bg-white rounded border border-gray-300 p-2 mb-4">
        <div className="flex gap-2 text-sm font-medium text-gray-500">
          <button className="px-3 py-1.5 rounded-full hover:bg-gray-50">Hot</button>
          <button className="px-3 py-1.5 rounded-full hover:bg-gray-50">New</button>
          <button className="px-3 py-1.5 rounded-full hover:bg-gray-50">Top</button>
          <button className="px-3 py-1.5 rounded-full hover:bg-gray-50">Rising</button>
        </div>
      </div>
      
      {MOCK_POSTS.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;