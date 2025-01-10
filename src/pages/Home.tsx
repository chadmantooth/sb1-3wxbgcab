import React from 'react';
import { useFeed } from '@/lib/hooks/useFeed';
import { Container } from '@/components/ui/Container';
import { formatDate } from '@/lib/utils';

export function Home() {
  const { items, isLoading, error, refetch } = useFeed({ maxItems: 50 });

  return (
    <Container className="py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Latest Technology News
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay informed with curated updates from across the technology industry
        </p>
      </div>

      {/* News Feed */}
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          // Loading state with shimmer effect
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state with retry button
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load News</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          // News items
          <div className="space-y-8">
            {items.map((item, index) => (
              <article 
                key={index} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6"
                >
                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <time dateTime={item.pubDate}>
                      {formatDate(item.pubDate)}
                    </time>
                    {item.creator && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{item.creator}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Headline */}
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 tracking-tight">
                    {item.title}
                  </h2>
                  
                  {/* Preview */}
                  {item.contentSnippet && (
                    <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {item.contentSnippet}
                    </p>
                  )}
                  
                  {/* Read More Link */}
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
                    Read article
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              </article>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Updates automatically every 5 minutes
        </div>
      </div>
    </Container>
  );
}