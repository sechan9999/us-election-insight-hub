// Latest individual Senate polls shown under the battleground table.
//
// These are DISPLAY-ONLY: the forecast model reads RCP averages from seed-data.ts,
// so a single poll changes the forecast only once it enters the average. Kept in
// its own file so it does not change the forecast run ID (run.ts hashes seed-data).

export interface PollRace {
  id: string; // matches SENATE_BATTLEGROUND id
  dem: string;
  demPct: number;
  rep: string;
  repPct: number;
  n: number; // likely voters
  moe: number; // ± points
  dates: string; // field dates
}

export interface PollRelease {
  pollster: string;
  released: string; // YYYY-MM-DD
  population: string;
  url: string;
  races: PollRace[];
}

/** New York Times / Siena College, likely voters, released Oct 3, 2026. */
export const NYT_SIENA_OCT_2026: PollRelease = {
  pollster: 'New York Times / Siena College',
  released: '2026-10-03',
  population: 'likely voters',
  url: 'https://sri.siena.edu/2026/10/03/nytimes-siena-poll-of-likely-voters-senate-races/',
  races: [
    { id: 'AK-SEN', dem: 'Mary Peltola', demPct: 50, rep: 'Dan Sullivan', repPct: 43, n: 504, moe: 5.1, dates: 'Sep 24–Oct 1' },
    { id: 'TX-SEN', dem: 'James Talarico', demPct: 51, rep: 'Ken Paxton', repPct: 45, n: 615, moe: 4.5, dates: 'Sep 21–30' },
    { id: 'OH-SEN', dem: 'Sherrod Brown', demPct: 49, rep: 'Jon Husted', repPct: 46, n: 616, moe: 4.5, dates: 'Sep 22–Oct 1' },
    { id: 'KS-SEN', dem: 'Adam Hamilton', demPct: 45, rep: 'Roger Marshall', repPct: 45, n: 605, moe: 4.6, dates: 'Sep 22–30' },
    { id: 'IA-SEN', dem: 'Josh Turek', demPct: 47, rep: 'Ashley Hinson', repPct: 48, n: 606, moe: 4.6, dates: 'Sep 22–Oct 1' },
  ],
};

/** Other recent polls for battleground states the NYT/Siena release did not cover. */
export const OTHER_RECENT_POLLS: (PollRace & { pollster: string; released: string; url: string })[] = [
  {
    id: 'GA-SEN', pollster: 'Wedgewood', released: '2026-10-04', url: 'https://www.270towin.com/2026-senate-polls/georgia',
    dem: 'Jon Ossoff', demPct: 55, rep: 'Mike Collins', repPct: 45, n: 600, moe: 4.0, dates: 'Oct 4',
  },
];

export const POLL_SOURCE_URLS = [
  NYT_SIENA_OCT_2026.url,
  'https://www.newsweek.com/democrats-flip-3-senate-seats-polling-12520448',
  'https://www.270towin.com/2026-senate-polls/georgia',
];
