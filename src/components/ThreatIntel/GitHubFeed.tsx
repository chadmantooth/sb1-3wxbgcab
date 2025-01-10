import React, { useEffect, useState } from 'react';
import { SECURITY_CONFIG } from '@/lib/constants/security';

interface FeedItem {
  title: string;
  description: string;
  severity: string;
  timestamp: string;
}

export function GitHubFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${SECURITY_CONFIG.GITHUB_FEED_REPO}/${SECURITY_CONFIG.GITHUB_FEED_BRANCH}/${SECURITY_CONFIG.GITHUB_FEED_PATH}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch GitHub feed');
        }

        const data = await response.json();
        setFeedItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, SECURITY_CONFIG.FEED_REFRESH_INTERVALS.GITHUB);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <span className={`px-2 py-1 text-sm font-medium rounded-full ${
              item.severity === 'critical' ? 'bg-red-100 text-red-800' :
              item.severity === 'high' ? 'bg-orange-100 text-orange-800' :
              item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {item.severity}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="text-sm text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}