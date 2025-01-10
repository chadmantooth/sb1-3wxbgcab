import React, { useEffect, useState } from 'react';
import { API_CONFIG } from '../lib/config/constants';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishDate: string;
  relevanceScore: number;
}

export function PersonalizedFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/personalized-feed`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
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
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {news.map((item, index) => (
        <article key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500">{item.source}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Score: {item.relevanceScore.toFixed(1)}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {item.title}
          </h2>
          
          <p className="text-gray-600 mb-4">{item.summary}</p>
          
          <div className="text-sm text-gray-500">
            {new Date(item.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </article>
      ))}
    </div>
  );
}