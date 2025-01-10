import React from 'react';
import { cn } from '@/lib/utils';
import { EventDetailsModal } from './EventDetailsModal';

export function FeaturedEvent() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm mb-8 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col space-y-6">
          {/* Event Header */}
          <div className="space-y-4">
            <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
              Sample Event
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Emerging Technology Briefing - Upwind Security
            </h2>

            {/* Event Details */}
            <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Wednesday, December 18, 2024</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>11:00 AM - 12:00 PM (EST)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Virtual - Web Conference</span>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="prose prose-blue max-w-none">
            <p>
              Join us for an exclusive briefing with Upwind Security, founded in 2022 by the team behind Spot.io—which was acquired by NetApp for $450 million. They specialize in cloud security solutions.
            </p>
            
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Overview</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Founded in 2022 by former Spot.io team
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    $80M in funding from leading investors
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Next-generation CNAPP platform
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What You'll Learn</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cloud security best practices
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Live platform demonstration
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Q&A with founding team
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "inline-flex items-center px-6 py-3",
                "bg-blue-600 hover:bg-blue-700 text-white font-medium",
                "rounded-lg transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              )}
            >
              Register Now
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <EventDetailsModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
    </>
  );
}