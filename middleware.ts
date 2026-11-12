import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Googlebot stays allowed so Google Search can index the site
// (Search Console reported our pages "Blocked due to access forbidden
// (403)" on 2026-11-12). Googlebot, Googlebot-Image, Googlebot-Video and
// Googlebot-News all carry 'googlebot' in the user agent, so one entry
// covers them. Bingbot was allowed on 2026-11-12 at HK's request so Bing
// can index the site too. Every other crawler stays blocked.
const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'discordbot',
  'whatsapp',
];

// Everything else that identifies itself as a crawler gets a 403.
// The generic 'bot' / 'spider' / 'crawler' tokens cover Googlebot, Bingbot
// and most named crawlers; the named entries cover AI and SEO scrapers
// that sometimes use neutral-looking user agents.
const CRAWLER_PATTERNS = [
  'bot',
  'spider',
  'crawler',
  'scraper',
  'slurp',
  'ahrefs',
  'semrush',
  'petal',
  'bytespider',
  'gptbot',
  'chatgpt-user',
  'claudebot',
  'anthropic-ai',
  'ccbot',
  'amazonbot',
  'applebot',
  'duckduckbot',
  'baiduspider',
  'yandex',
  'sogou',
  'exabot',
  'facebot',
  'ia_archiver',
  'mj12bot',
  'dotbot',
  'trendiction',
  'elevenlabscrawler',
];

export function middleware(req: NextRequest) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  if (!ua) return NextResponse.next();
  if (ALLOWED_BOTS.some((p) => ua.includes(p))) return NextResponse.next();
  if (CRAWLER_PATTERNS.some((p) => ua.includes(p))) {
    return new NextResponse('Blocked: crawlers are not allowed on this site.', {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
