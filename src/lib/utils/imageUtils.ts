import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const IMAGE_WIDTH = 800;
const IMAGE_QUALITY = 80;

interface UnsplashImage {
  urls: {
    raw: string;
  };
}

export async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));
}

export async function searchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('UNSPLASH_ACCESS_KEY is required');
  }

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    }
  );

  const data = await response.json();
  const images = data.results as UnsplashImage[];

  if (images.length === 0) {
    return null;
  }

  const imageUrl = `${images[0].urls.raw}&w=${IMAGE_WIDTH}&q=${IMAGE_QUALITY}`;
  return imageUrl;
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}