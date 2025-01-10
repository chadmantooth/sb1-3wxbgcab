export interface SocialMetrics {
  likes: number;
  comments: number;
  shares: number;
}

export interface SocialPost {
  id: string;
  username: string;
  timestamp: string;
  content: string;
  metrics: SocialMetrics;
  media?: {
    type: 'image' | 'video' | 'link';
    url: string;
    description?: string;
  };
}