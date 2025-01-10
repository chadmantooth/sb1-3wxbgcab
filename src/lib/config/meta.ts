import { SITE_CONFIG } from './constants';

export const DEFAULT_META = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name
      }
    ]
  },
  twitter: {
    handle: '@techanchorman',
    site: '@techanchorman',
    cardType: 'summary_large_image'
  }
} as const;