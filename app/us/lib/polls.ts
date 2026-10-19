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

/** Recent individual polls (display-only; all are inside the RCP average window). */
export const OTHER_RECENT_POLLS: (PollRace & { pollster: string; released: string; url: string })[] = [
  {
    id: 'NC-SEN', pollster: 'SurveyUSA/WRAL', released: '2026-10-13', url: 'https://www.270towin.com/2026-senate-polls/north-carolina',
    dem: 'Roy Cooper', demPct: 54, rep: 'Michael Whatley', repPct: 40, n: 643, moe: 5.0, dates: 'Oct 7–11',
  },
  {
    id: 'NC-SEN', pollster: 'Trafalgar Group', released: '2026-10-10', url: 'https://www.270towin.com/2026-senate-polls/north-carolina',
    dem: 'Roy Cooper', demPct: 48.8, rep: 'Michael Whatley', repPct: 40.9, n: 1091, moe: 2.9, dates: 'Oct 8–10',
  },
  {
    id: 'TX-SEN', pollster: 'Siena College', released: '2026-10-13', url: 'https://www.270towin.com/2026-senate-polls/texas',
    dem: 'James Talarico', demPct: 48, rep: 'Ken Paxton', repPct: 44, n: 617, moe: 4.0, dates: 'Oct 13',
  },
  {
    id: 'ME-SEN', pollster: 'Suffolk University', released: '2026-10-12', url: 'https://www.270towin.com/2026-senate-polls/maine',
    dem: 'Troy Jackson', demPct: 49, rep: 'Susan Collins', repPct: 47, n: 500, moe: 4.4, dates: 'Oct 8–11',
  },
];

export const POLL_SOURCE_URLS = [
  NYT_SIENA_OCT_2026.url,
  'https://www.newsweek.com/democrats-flip-3-senate-seats-polling-12520448',
  'https://www.270towin.com/2026-senate-polls/georgia',
];
