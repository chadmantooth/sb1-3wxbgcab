#!/usr/bin/env python3
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
import logging
import json
from typing import List, Dict, Optional
import hashlib
from collections import OrderedDict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('feed_processor.log'),
        logging.StreamHandler()
    ]
)

class FeedProcessor:
    def __init__(self, feed_url: str, max_articles: int = 20, days_limit: int = 7):
        self.feed_url = feed_url
        self.max_articles = max_articles
        self.days_limit = days_limit
        self.seen_articles = OrderedDict()
        
    def _generate_article_id(self, title: str, link: str) -> str:
        """Generate a unique ID for an article based on title and link."""
        content = f"{title}{link}".encode('utf-8')
        return hashlib.md5(content).hexdigest()

    def _parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse various date formats to datetime object."""
        date_formats = [
            '%a, %d %b %Y %H:%M:%S %z',  # RFC 822
            '%Y-%m-%dT%H:%M:%S%z',       # ISO 8601
            '%Y-%m-%d %H:%M:%S',         # Basic format
        ]
        
        for fmt in date_formats:
            try:
                return datetime.strptime(date_str.strip(), fmt)
            except ValueError:
                continue
        logging.warning(f"Could not parse date: {date_str}")
        return None

    def _is_within_time_limit(self, pub_date: Optional[datetime]) -> bool:
        """Check if article is within the time limit."""
        if not pub_date:
            return False
        cutoff_date = datetime.now() - timedelta(days=self.days_limit)
        return pub_date > cutoff_date

    def fetch_feed(self) -> List[Dict]:
        """Fetch and process the RSS feed."""
        try:
            # Add headers to mimic a browser request
            headers = {
                'User-Agent': 'Mozilla/5.0 TechAnchorman Feed Reader/1.0',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
            request = urllib.request.Request(self.feed_url, headers=headers)
            
            with urllib.request.urlopen(request, timeout=10) as response:
                xml_content = response.read().decode('utf-8')
                
            # Parse XML
            root = ET.fromstring(xml_content)
            channel = root.find('channel')
            if channel is None:
                raise ValueError("Invalid RSS feed structure")

            articles = []
            for item in channel.findall('item'):
                # Extract article data
                title = item.find('title')
                link = item.find('link')
                description = item.find('description')
                pub_date = item.find('pubDate')
                
                if not all([title is not None, link is not None]):
                    continue
                
                # Parse publication date
                parsed_date = self._parse_date(pub_date.text) if pub_date is not None else None
                
                # Skip old articles
                if not self._is_within_time_limit(parsed_date):
                    continue
                
                # Generate unique ID and check for duplicates
                article_id = self._generate_article_id(title.text, link.text)
                if article_id in self.seen_articles:
                    continue
                
                article = {
                    'title': title.text,
                    'link': link.text,
                    'description': description.text if description is not None else '',
                    'pub_date': parsed_date.isoformat() if parsed_date else None
                }
                
                articles.append(article)
                self.seen_articles[article_id] = True
                
                # Maintain max size of seen articles cache
                if len(self.seen_articles) > self.max_articles * 2:
                    # Remove oldest entries
                    excess = len(self.seen_articles) - self.max_articles
                    for _ in range(excess):
                        self.seen_articles.popitem(last=False)
            
            # Sort by publication date
            articles.sort(
                key=lambda x: datetime.fromisoformat(x['pub_date']) if x['pub_date'] else datetime.min,
                reverse=True
            )
            
            # Limit to max articles
            articles = articles[:self.max_articles]
            
            return articles
            
        except urllib.error.URLError as e:
            logging.error(f"Failed to fetch feed: {e}")
            raise
        except ET.ParseError as e:
            logging.error(f"Failed to parse XML: {e}")
            raise
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            raise

def main():
    FEED_URL = 'https://rss.feedspot.com/folder/5hrIsmIb6A==/rss/rsscombiner'
    
    try:
        processor = FeedProcessor(FEED_URL)
        articles = processor.fetch_feed()
        
        # Write results to file
        with open('processed_feed.json', 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'article_count': len(articles),
                'articles': articles
            }, f, indent=2, ensure_ascii=False)
            
        logging.info(f"Successfully processed {len(articles)} articles")
        
    except Exception as e:
        logging.error(f"Failed to process feed: {e}")
        raise

if __name__ == '__main__':
    main()