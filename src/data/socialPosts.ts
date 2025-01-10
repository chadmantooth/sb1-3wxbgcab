import type { SocialPost } from '../types/social';

export const socialPosts: SocialPost[] = [
  {
    id: '1',
    username: 'TechExplorer',
    timestamp: '2024-01-01T08:30:00Z',
    content: 'Just published my latest analysis on AI trends in 2025! Check it out here: https://tech.blog/ai-trends-2025 #AI #Technology',
    metrics: {
      likes: 1243,
      comments: 89,
      shares: 456
    }
  },
  {
    id: '2',
    username: 'DataScientist_Sarah',
    timestamp: '2024-01-01T09:15:00Z',
    content: '📊 New visualization showing the impact of machine learning on productivity across industries. The results are fascinating! #DataScience #ML',
    metrics: {
      likes: 892,
      comments: 134,
      shares: 267
    }
  },
  {
    id: '3',
    username: 'CyberSecPro',
    timestamp: '2024-01-01T10:00:00Z',
    content: '🚨 Important security alert: New vulnerability discovered in popular software. Here\'s what you need to know and how to protect yourself.',
    metrics: {
      likes: 2156,
      comments: 312,
      shares: 1089
    }
  }
  // ... Add 97 more posts with varied content, timestamps, and metrics
];