// Full project introduction: "Four Korean Presidential Elections, Open to Anyone".
// Canonical English text by the project; rendered verbatim, structured for the web.
// Linked from /kr and from outreach (e.g., Google for Startups introduction).

import type { Metadata } from 'next';
import CountrySwitch from '../../components/CountrySwitch';
import type { Lang } from '../../us/lib/i18n';

type SearchParams = { lang?: string };

const TITLE = 'Four Korean Presidential Elections, Open to Anyone: The Counting Records of 2012–2025';
const DESCRIPTION =
  'Public archives of the official counting records for four consecutive Korean presidential elections (2012–2025): more than 36,000 pages of primary counting documents and over 85,000 rows of official results, hosted on Google Cloud Storage.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const lang = (await searchParams).lang === 'en' ? 'en' : 'ko';
  return {
    metadataBase: new URL('https://app.ohmycodellc.com'),
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'article',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
  };
}

const ARCHIVES: { heading: string; body: string; url: string }[] = [
  {
    heading: '18th presidential election (December 19, 2012)',
    body: 'Ballot-sorter operation results for all 251 cities, counties, and districts, together with the official precinct-level results: 17,871 rows covering six candidates. The original counting documents are also public: 73,363 scanned pages from all 251 districts, republished with permission from Project Boo\u2019s 2012 archive (projectboo.com) with attribution; files the source board never embedded are marked as partially missing rather than silently omitted.',
    url: 'https://storage.googleapis.com/k18-archive/index.html',
  },
  {
    heading: '19th presidential election (May 9, 2017)',
    body: 'Ballot-sorter operation records for 13,949 counting units, organized by province, together with the official precinct-level results: 22,214 rows covering thirteen candidates.',
    url: 'https://storage.googleapis.com/k19-archive/index.html',
  },
  {
    heading: '20th presidential election (March 9, 2022)',
    body: 'Scanned originals of the official counting reports (tally sheets): 17,377 pages from 224 districts, together with the official precinct-level results: 22,752 rows covering twelve candidates. Originals for 26 districts — including all of Busan, Jeju, and Sejong — were not obtainable and are absent; the archive states its coverage plainly rather than papering over the gaps.',
    url: 'https://storage.googleapis.com/k20-tally-archive/index.html',
  },
  {
    heading: '21st presidential election (June 3, 2025)',
    body: 'Scanned originals of the official counting reports: 18,949 pages covering all 252 districts, each district linked directly to its source documents, together with the official precinct-level results: 22,685 rows covering five candidates. Rows excluded from analysis — hand-counted reports and misfiled pages — are itemized, not silently dropped.',
    url: 'https://storage.googleapis.com/k21-tally-archive/index.html',
  },
];

export default async function KoreaAboutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const lang: Lang = (await searchParams).lang === 'en' ? 'en' : 'ko';
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" lang="en">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <CountrySwitch lang={lang} active="kr" />

        <a href={`/kr?lang=${lang}`} className="text-sm text-blue-300 hover:underline">
          ← {lang === 'ko' ? '한국 선거 섹션으로' : 'Back to the Korea section'}
        </a>

        <h1 className="mt-4 text-3xl font-bold leading-snug">{TITLE}</h1>

        <div className="mt-6 space-y-4 leading-relaxed text-neutral-200">
          <p>
            South Korea counts its paper ballots with optical sorting machines. Ballots the
            machines cannot read are set aside and confirmed by hand, and every counting station
            produces a written record of both streams. Those records are the primary evidence in
            any serious discussion of how the machines behave — yet for years they circulated, if
            at all, as scattered scans and spreadsheet files that were hard to find and harder to
            check.
          </p>
          <p>
            We have now assembled the counting records of four consecutive presidential elections
            — the 18th through the 21st, spanning 2012 to 2025 — into public archives that anyone
            can browse and download, free of charge. Each archive pairs the original records with
            the National Election Commission&apos;s official precinct-level results, so that every
            figure can be traced back to its source.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-bold">What is in each archive</h2>
        <div className="mt-4 space-y-3">
          {ARCHIVES.map((a) => (
            <div key={a.url} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">{a.heading}</div>
              <p className="mt-1 text-sm leading-relaxed text-neutral-300">{a.body}</p>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block break-all text-sm font-medium text-blue-300 hover:underline"
              >
                {a.url}
              </a>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-bold">Why these records matter</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-200">
          <p>
            Claims about ballot-sorting machines — including the widely debated statistic K, the
            ratio of winner-to-runner-up votes among machine-rejected ballots relative to
            machine-accepted ballots — can only be tested against the counting records themselves.
            When the records are public, a claim becomes a calculation that anyone can repeat: the
            number of ballots each machine classified, the number it set aside, and how the
            hand-confirmed ballots split among candidates, precinct by precinct and district by
            district.
          </p>
          <p>
            These archives underlie our own research on machine rejections across the four
            elections, including a transcription of the 2022 and 2025 counting reports validated
            by arithmetic constraints and blind re-reads. But they are not published for our work
            alone. Journalists, researchers, election officials, and citizens can use them to check
            any figure — ours included — against the originals.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-bold">Provenance and access</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-200">
          <p>
            All four archives are hosted on Google Cloud Storage and are readable without an
            account or fee. Source documents are the National Election Commission&apos;s published
            counting reports and result files; where a record could not be obtained, the archive
            says so. The archives are a project of the Electoral Insights Hub (OhMyCode LLC), a
            non-partisan, bilingual platform for Korean election data that favors transparent and
            reproducible analysis.
          </p>
          <p>
            If you find an error, we would rather hear about it than have it stand: every page in
            these archives exists so that the numbers can be argued with — on evidence.
          </p>
          <p className="text-sm text-neutral-400">
            These archives are free to use. If they saved you time, you can help cover their
            hosting costs via{' '}
            <a
              href="https://paypal.me/HeeKyoungChun"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-300 hover:underline"
            >
              PayPal
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
