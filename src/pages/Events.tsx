import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { EventCard } from '@/components/Events/EventCard';
import { FeaturedEvent } from '@/components/Events/FeaturedEvent';
import type { Event } from '@/types/event';

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'The Cyber Threat Landscape - given Socio-Political are on the Rise Globally',
    date: '2025-02-26',
    description: 'Understanding and preparing for emerging cyber threats in an increasingly complex global landscape.',
    registrationUrl: 'https://tinyurl.com/7shf236y',
    category: 'webinar'
  },
  {
    id: '2',
    title: 'Surviving Cyber Entropy - your ever-expanding vulnerabilities and attack surface(s)',
    date: '2025-03-26',
    description: 'Managing and mitigating risks in an expanding digital ecosystem.',
    registrationUrl: 'https://tinyurl.com/57nured8',
    category: 'webinar'
  },
  {
    id: '3',
    title: 'AI Risk and AI Governance - the CAIO Manifesto',
    date: '2025-04-23',
    description: 'Exploring the challenges and best practices in AI governance and risk management.',
    registrationUrl: 'https://tinyurl.com/36vchtyu',
    category: 'webinar'
  },
  {
    id: '4',
    title: 'Privacy Risks - the Data Privacy Lifecycle "Cradle to Grave"',
    date: '2025-05-28',
    description: 'Comprehensive overview of data privacy management throughout the data lifecycle.',
    registrationUrl: 'https://tinyurl.com/ymvcmutr',
    category: 'webinar'
  },
  {
    id: '5',
    title: 'Data Sovereignty - The implications on Business Operations and Business Continuity',
    date: '2025-08-27',
    description: 'Understanding data sovereignty requirements and their impact on business operations.',
    registrationUrl: 'https://tinyurl.com/bdp52sew',
    category: 'webinar'
  },
  {
    id: '6',
    title: 'Risk Level Agreements - risk-informed decision making',
    date: '2025-09-24',
    description: 'Implementing effective risk assessment and decision-making frameworks.',
    registrationUrl: 'https://tinyurl.com/2fcermxy',
    category: 'webinar'
  },
  {
    id: '7',
    title: 'Trust Through Transparency - winning and keeping stakeholder trust',
    date: '2025-10-22',
    description: 'Building and maintaining stakeholder trust through transparent practices.',
    registrationUrl: 'https://tinyurl.com/5xhjc3m9',
    category: 'webinar'
  }
];

export function Events() {
  const [filter, setFilter] = useState<string>('');

  const filteredEvents = EVENTS
    .filter(event => 
      !filter || 
      event.title.toLowerCase().includes(filter.toLowerCase()) ||
      event.description.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Featured Event */}
        <FeaturedEvent />

        {/* Header Section */}
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Cyber Phenomena Series
          </h1>
          <div className="prose prose-lg text-gray-600">
            <p>
              Each session brings together industry experts and practitioners to examine real-world 
              cyber phenomena, providing actionable insights and strategies for navigating today's 
              complex threat landscape.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <h3 className="text-blue-800 font-semibold mb-2">What You Can Expect:</h3>
              <ul className="space-y-2 text-blue-900">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cutting-Edge Insights: Each session spotlights thoroughly vetted, innovative solutions likely to be new to you.</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Expert Presenters: Engage with top entrepreneurs and innovators developing technologies to streamline processes, reduce costs, and enhance safety.</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Interactive Opportunities: Participate in live Q&A sessions and discussions tailored to your specific interests.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              placeholder="Search events..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No events match your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Stay Informed About Future Events
            </h2>
            <p className="text-lg text-blue-100 mb-6">
              Don't miss out on our upcoming sessions. Each event brings new insights and strategies 
              for navigating the evolving cyber landscape.
            </p>
            <a
              href="mailto:chad.mantooth@pbsnow.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            >
              Contact for More Information
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}