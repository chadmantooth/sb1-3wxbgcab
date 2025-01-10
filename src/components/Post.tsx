import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';

interface PostProps {
  title: string;
  author: string;
  subreddit: string;
  upvotes: number;
  commentCount: number;
  timeAgo: string;
  content: string;
}

const Post: React.FC<PostProps> = ({
  title,
  author,
  subreddit,
  upvotes,
  commentCount,
  timeAgo,
  content
}) => {
  return (
    <article className="bg-white rounded border border-gray-300">
      <div className="flex">
        {/* Voting */}
        <div className="w-10 bg-gray-50 p-2 flex flex-col items-center gap-1">
          <button className="text-gray-400 hover:text-blue-600">
            <ArrowUpIcon className="w-6 h-6" />
          </button>
          <span className="text-xs font-bold">{upvotes}</span>
          <button className="text-gray-400 hover:text-orange-600">
            <ArrowDownIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex-1">
          <div className="text-xs text-gray-500 mb-2">
            <a href={`/r/${subreddit}`} className="font-bold hover:underline">r/{subreddit}</a>
            <span className="mx-1">•</span>
            Posted by <a href={`/u/${author}`} className="hover:underline">u/{author}</a>
            <span className="mx-1">•</span>
            {timeAgo}
          </div>
          
          <h2 className="text-lg font-medium mb-2">{title}</h2>
          <p className="text-sm text-gray-800 mb-2">{content}</p>

          <div className="flex gap-4 text-gray-500 text-sm">
            <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              {commentCount} Comments
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded">
              <ShareIcon className="w-5 h-5" />
              Share
            </button>
            <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded">
              <BookmarkIcon className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;