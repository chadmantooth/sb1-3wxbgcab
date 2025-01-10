import React from 'react';
import type { Threat } from '@/types/threat';
import { cn } from '@/lib/utils';

interface ThreatCardProps {
  threat: Threat;
}

const severityConfig = {
  critical: {
    className: 'bg-red-100 text-red-800 border-red-200',
    label: 'Critical'
  },
  high: {
    className: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'High'
  },
  medium: {
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Medium'
  },
  low: {
    className: 'bg-green-100 text-green-800 border-green-200',
    label: 'Low'
  }
} as const;

export function ThreatCard({ threat }: ThreatCardProps) {
  const severityStyle = severityConfig[threat.severity];
  
  return (
    <article 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      aria-labelledby={`threat-${threat.id}-title`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span 
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium border',
              severityStyle.className
            )}
          >
            {severityStyle.label}
          </span>
          <time 
            dateTime={threat.timestamp}
            className="text-sm text-gray-500"
          >
            {new Date(threat.timestamp).toLocaleString()}
          </time>
        </div>

        <h3 
          id={`threat-${threat.id}-title`}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          {threat.title}
        </h3>

        <p className="text-gray-600 mb-4">{threat.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Category:</span>
            <span className="ml-2">{threat.category}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">CVSS Score:</span>
            <span className="ml-2">{threat.cvss.toFixed(1)}</span>
          </div>
        </div>

        {threat.mitigation && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Mitigation</h4>
            <p className="text-gray-600">{threat.mitigation}</p>
          </div>
        )}

        {threat.indicators && threat.indicators.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Indicators</h4>
            <ul className="space-y-2">
              {threat.indicators.map((indicator, index) => (
                <li key={index} className="text-sm text-gray-600">
                  <span className="font-medium">{indicator.type}:</span>{' '}
                  {indicator.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}