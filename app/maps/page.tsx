import type { Metadata } from 'next';
import MapsClient from './MapsClient';

export const metadata: Metadata = {
  title: 'County Maps — 2024 vote share · 2020-2024 swing · Diploma divide',
  description: 'Interactive county maps of the 2024 US presidential election: Democratic vote share by county (3,100+ counties), 2020→2024 swing, and the diploma divide by state (r=+0.44 education correlation).',
  openGraph: {
    title: 'County Maps — US Election Insights Hub',
    description: '3,100+ counties: 2024 vote share, 2020→2024 swing, diploma divide by state.',
    type: 'website',
    images: [{ url: '/us/opengraph-image' }],
  },
};

export default function MapsPage() {
  return <MapsClient />;
}
