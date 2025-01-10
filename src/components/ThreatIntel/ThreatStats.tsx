import React from 'react';
import type { ThreatStats } from '@/types/threat';

interface ThreatStatsProps {
  stats: ThreatStats;
}

export function ThreatStats({ stats }: ThreatStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Critical</h3>
        <p className="mt-2 text-2xl font-bold text-red-600">{stats.critical}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">High</h3>
        <p className="mt-2 text-2xl font-bold text-orange-600">{stats.high}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Medium</h3>
        <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.medium}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Low</h3>
        <p className="mt-2 text-2xl font-bold text-green-600">{stats.low}</p>
      </div>
    </div>
  );
}