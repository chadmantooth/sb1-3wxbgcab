import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/ui/Container';
import { ThreatCard } from '@/components/ThreatIntel/ThreatCard';
import { ThreatStats } from '@/components/ThreatIntel/ThreatStats';
import { GitHubFeed } from '@/components/ThreatIntel/GitHubFeed';
import { ErrorBoundary } from '@/components/ThreatIntel/ErrorBoundary';
import type { Threat, ThreatStats as ThreatStatsType } from '@/types/threat';

export function ThreatIntel() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [stats, setStats] = useState<ThreatStatsType>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0,
    avgCvss: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    severity: '',
    category: '',
    search: ''
  });

  const calculateStats = useCallback((threatList: Threat[]): ThreatStatsType => {
    const stats = threatList.reduce((acc, threat) => {
      acc[threat.severity]++;
      acc.total++;
      acc.avgCvss += threat.cvss;
      return acc;
    }, {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0,
      avgCvss: 0
    });

    stats.avgCvss = stats.total ? +(stats.avgCvss / stats.total).toFixed(1) : 0;
    return stats;
  }, []);

  const fetchThreats = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch('/api/threats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Check if response contains error
      if ('error' in data) {
        throw new Error(data.message || 'Failed to fetch threats');
      }

      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setThreats(data);
      setStats(calculateStats(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threats');
      // Keep last known good state if available
      if (threats.length === 0) {
        setThreats(MOCK_THREATS);
        setStats(calculateStats(MOCK_THREATS));
      }
    } finally {
      setIsLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchThreats]);

  const filteredThreats = threats.filter(threat => {
    if (filters.severity && threat.severity !== filters.severity) return false;
    if (filters.category && threat.category !== filters.category) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        threat.title.toLowerCase().includes(search) ||
        threat.description.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const categories = Array.from(new Set(threats.map(t => t.category)));

  return (
    <ErrorBoundary>
      <Container className="py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Threat Intelligence Feed
            </h1>
            
            <div className="flex items-center gap-4">
              <input
                type="search"
                placeholder="Search threats..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          <ThreatStats stats={stats} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <aside className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-medium text-gray-900 mb-4">Filters</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.severity}
                      onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                    >
                      <option value="">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            <div className="md:col-span-3">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">GitHub Security Feed</h2>
                <GitHubFeed />
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
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
              ) : filteredThreats.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500">No threats match your filters</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredThreats.map(threat => (
                    <ThreatCard key={threat.id} threat={threat} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </ErrorBoundary>
  );
}