// Participant Guide — official rules for the 18th–21st Presidential
// Election Data Analysis Competition. Approved by the organizer
// 2026-11-03. Source of truth:
// ~/workspace/user/files/competition-participant-guide-2026-11-03.md
// (English only, as approved; the competition page links here.)

import type { Metadata } from 'next';
import CountrySwitch from '../../../components/CountrySwitch';
import type { Lang } from '../../../us/lib/i18n';

type SearchParams = { lang?: string };

function langFrom(params: SearchParams): Lang {
  return params.lang === 'en' ? 'en' : 'ko';
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const lang = langFrom(await searchParams);
  const title =
    lang === 'ko'
      ? '참가자 가이드 (공식 규칙) — 18–21대 대선 데이터 분석 컴피티션'
      : 'Participant Guide (Official Rules) — 18th–21st Presidential Election Data Analysis Competition';
  return {
    metadataBase: new URL('https://app.ohmycodellc.com'),
    title,
    description:
      'Official rules for the 18th–21st Presidential Election Data Analysis Competition: schedule, rules, technical resources, problem statements, and judging.',
    openGraph: { title, type: 'website', locale: lang === 'ko' ? 'ko_KR' : 'en_US' },
    twitter: { card: 'summary', title },
  };
}

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-blue-300 hover:underline"
  >
    {children}
  </a>
);

export default async function CompetitionGuidePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const lang = langFrom(await searchParams);
  const other: Lang = lang === 'ko' ? 'en' : 'ko';
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" lang={lang}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <CountrySwitch lang={lang} active="kr" />

        <a href={`/kr/competition?lang=${lang}`} className="text-sm text-blue-300 hover:underline">
          ← {lang === 'ko' ? '컴피티션 안내로' : 'Back to the competition page'}
        </a>

        <div className="mt-4 flex items-center gap-2">
          <span className="rounded bg-amber-400/15 px-2 py-1 text-xs font-medium text-amber-300">
            {lang === 'ko' ? '공식 규칙' : 'Official rules'}
          </span>
          <a
            href={`/kr/competition/guide?lang=${other}`}
            className="ml-auto rounded border border-white/15 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10"
          >
            {lang === 'ko' ? 'English' : '한국어'}
          </a>
        </div>

        <h1 className="mt-3 text-3xl font-bold leading-snug">
          18th–21st Presidential Election Data Analysis Competition — Participant Guide
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Official rules, approved by the organizer on November 3, 2026. In-kind prizes provided by
          OhMyCode LLC; judging panel: organizer plus invited experts; questions:{' '}
          <A href="mailto:tcgyver@jnctv.com">tcgyver@jnctv.com</A>.
        </p>

        <p className="mt-6 leading-relaxed text-neutral-300">
          Welcome to the 18th–21st Presidential Election Data Analysis Competition (the
          &ldquo;Competition&rdquo;)! We&rsquo;re thrilled to have you on board.
        </p>
        <p className="mt-3 leading-relaxed text-neutral-300">
          This guide is your all-in-one resource for the event, including schedule, rules, technical
          resources, problem statements, judging information, and more. Please read this carefully;
          most answers can be found here.
        </p>
        <p className="mt-3 leading-relaxed text-neutral-300">
          Organizer: Electoral Insights Hub (OhMyCode LLC).
        </p>

        <h2 className="mt-10 text-xl font-bold">1. Your Goal: Problem Statements</h2>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Theme: <strong>verify with the originals, not with claims.</strong>
        </p>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Analyze Korean presidential election data from the 18th (2012) through the 21st (2025)
          elections using the same public materials everyone else uses, and verify every figure
          against the original records. A strong entry does not just present a finding — it shows,
          figure by figure, where each number came from and how it was checked.
        </p>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Choose one of these topics (or propose your own under &ldquo;Other&rdquo;):
        </p>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-neutral-300">
          <li>
            <strong>Ballot-sorter operation and K-value analysis.</strong> The 18th/19th
            ballot-sorter operation results and unclassified-ballot patterns. Background: K compares
            the two leading candidates&rsquo; vote ratios between ballots the sorter classified and
            ballots it set aside. K = 1 means the two candidates&rsquo; unclassified rates are equal.
            The 2017 Project Boo post reports the 18th-election K value as 1.5. Your job is not to
            repeat that interpretation — it is to compute and verify from the original records
            yourself.
          </li>
          <li>
            <strong>Cross-election counting patterns.</strong> What changed from the 18th to the
            21st election in how votes were counted, classified, and reported?
          </li>
          <li>
            <strong>Visualization and dashboards.</strong> Results anyone can check against the
            originals — an interactive result that lets a reader trace every figure back to its
            source.
          </li>
        </ol>

        <h2 className="mt-10 text-xl font-bold">2. Schedule</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-300">
          <li>
            <strong>Entries open:</strong> November 3, 2026. Submit via the entry form:{' '}
            <A href="https://forms.gle/97UHnHhM1gMDAuQH8">https://forms.gle/97UHnHhM1gMDAuQH8</A>
          </li>
          <li>
            <strong>Submission deadline:</strong> December 31, 2026 (Thursday).
          </li>
          <li>
            <strong>Judging:</strong> early January 2027.
          </li>
          <li>
            <strong>Winners announced:</strong> January 15, 2027 (Friday).
          </li>
          <li>
            <strong>Rules:</strong> this guide (approved November 3, 2026).
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">3. Rules</h2>
        <h3 className="mt-6 font-semibold">3.1 Who can enter</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Anyone may enter. There are no nationality, age, or affiliation requirements. Entries may
          be written in Korean or English.
        </p>
        <h3 className="mt-6 font-semibold">3.2 Teams</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Solo entries and team entries are both welcome. Teams may have up to 5 members.
        </p>
        <h3 className="mt-6 font-semibold">3.3 What to submit</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Submit through the entry form. Each entry must include:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
          <li>Entry title, team name, team members, and a contact email.</li>
          <li>Topic (one of the three above, or &ldquo;Other&rdquo; with a description).</li>
          <li>Elections covered (18th, 19th, 20th, 21st — one or more).</li>
          <li>Analysis summary: what you analyzed and what you found.</li>
          <li>
            Deliverable link: a public GitHub repository or a public dashboard. The deliverable must
            be publicly accessible for judging; a private link is not judged.
          </li>
          <li>Verification method: how you verified every figure against the originals (required
            — see 3.5).</li>
          <li>What the analysis shows: why the results matter.</li>
          <li>
            Optional: a presentation video (under 3 minutes, recommended) and additional public data
            sources used.
          </li>
        </ul>
        <h3 className="mt-6 font-semibold">3.4 Data rules</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
          <li>
            You must use at least one of the four published election archives (Section 4).
            Additional public sources are allowed if you cite them.
          </li>
          <li>
            Figures must come from the published archives or other cited public sources — never
            from memory, estimation, or an unverified third-party claim.
          </li>
          <li>
            Note: the 18th-election original scans in the Project Boo mirror are partially missing
            (see the archive index disclosure). Do not claim completeness for files that are
            missing.
          </li>
        </ul>
        <h3 className="mt-6 font-semibold">3.5 Verification rule (the core rule)</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Every figure in your entry must be traceable to an original record — a tally sheet, a
          sorter-operation record, or an official precinct result — and you must explain how you
          checked it. Entries with fabricated, unverifiable, or untraceable figures are
          disqualified. If a figure cannot be verified, say so and exclude it rather than presenting
          it as fact.
        </p>
        <h3 className="mt-6 font-semibold">3.6 Neutrality rule</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          This competition deals only with officially published figures. Recommendations or
          evaluations of candidates, parties, or policy positions are not part of the competition
          and must not appear in entries.
        </p>
        <h3 className="mt-6 font-semibold">3.7 Originality and AI use</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Entries must be your own work. AI tools may be used for analysis and coding, but every
          figure must still be verified under 3.5 — AI output is not a source. Plagiarized entries
          are disqualified.
        </p>
        <h3 className="mt-6 font-semibold">3.8 One entry, resubmission</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          One entry per team. You may resubmit before the deadline; the latest submission counts.
        </p>
        <h3 className="mt-6 font-semibold">3.9 Prizes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
          <li>Cash prize: $1,000 to the first-place entry.</li>
          <li>In-kind prizes for runners-up, provided by OhMyCode LLC. Details to be announced.</li>
        </ul>
        <h3 className="mt-6 font-semibold">3.10 Disqualification</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Entries are disqualified for: fabricated or unverifiable figures; recommendations or
          evaluations of candidates, parties, or policies; plagiarism; private or inaccessible
          deliverables; late submissions (after December 31, 2026).
        </p>
        <h3 className="mt-6 font-semibold">3.11 Publication and privacy</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          By entering, you agree that submitted materials may be published, shared, and promoted by
          the organizer (this consent is collected in the entry form). Contact emails are used only
          for competition administration.
        </p>

        <h2 className="mt-10 text-xl font-bold">4. Technical Resources</h2>
        <p className="mt-2 leading-relaxed text-neutral-300">
          All four election archives are published in full:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-neutral-300">
          <li>
            <strong>18th (2012):</strong> sorter results and the unclassified-ballot K value, 251
            districts, 17,871 official precinct rows, 73,363 original scans.{' '}
            <A href="https://storage.googleapis.com/k18-archive/index.html">
              https://storage.googleapis.com/k18-archive/index.html
            </A>
          </li>
          <li>
            <strong>19th (2017):</strong> ballot-sorter records, 13,949 counting units, 22,214
            official precinct rows.{' '}
            <A href="https://storage.googleapis.com/k19-archive/index.html">
              https://storage.googleapis.com/k19-archive/index.html
            </A>
          </li>
          <li>
            <strong>20th (2022):</strong> 17,377 original tally sheets, 22,752 official precinct
            rows.{' '}
            <A href="https://storage.googleapis.com/k20-tally-archive/index.html">
              https://storage.googleapis.com/k20-tally-archive/index.html
            </A>
          </li>
          <li>
            <strong>21st (2025):</strong> 18,949 original tally sheets, 22,685 official precinct
            rows.{' '}
            <A href="https://storage.googleapis.com/k21-tally-archive/index.html">
              https://storage.googleapis.com/k21-tally-archive/index.html
            </A>
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-neutral-300">Helpful tools and background:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-neutral-300">
          <li>
            Data exploration agent (ask questions, check figures, view tally sheets):{' '}
            <A href="https://app.ohmycodellc.com/kr/agent">https://app.ohmycodellc.com/kr/agent</A>
          </li>
          <li>
            Dashboard, 21st election compare view:{' '}
            <A href="https://k18to21-election2.vercel.app/?view=compare&election=21st">
              https://k18to21-election2.vercel.app/?view=compare&amp;election=21st
            </A>
          </li>
          <li>
            Newstapa data portal, 18th/19th ballot-sorter operation results:{' '}
            <A href="https://data.newstapa.org/datasets/18-19대-대선-투표지-분류기-운영결과">
              https://data.newstapa.org/datasets/18-19대-대선-투표지-분류기-운영결과
            </A>
          </li>
          <li>
            Project Boo archive, K-value explainer (HeeKyoung Chun, Hwashin Hyun Shin, 2017):{' '}
            <A href="http://www.projectboo.com/archive/153768">
              http://www.projectboo.com/archive/153768
            </A>
          </li>
          <li>
            Full code (public on GitHub):{' '}
            <A href="https://github.com/sechan9999/K18to21Election2">
              https://github.com/sechan9999/K18to21Election2
            </A>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold">5. Judging</h2>
        <h3 className="mt-6 font-semibold">5.1 Criteria</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
          <li>
            <strong>Verification rigor — 40%.</strong> Can every figure be traced to an original and
            re-checked? This is the most heavily weighted criterion.
          </li>
          <li>
            <strong>Analytical insight — 30%.</strong> Does the analysis say something substantive
            and well-supported?
          </li>
          <li>
            <strong>Reproducibility and clarity — 20%.</strong> Can another person reproduce the
            work from the deliverable and follow the reasoning?
          </li>
          <li>
            <strong>Presentation — 10%.</strong> Is the result readable and usable, including any
            dashboard or video?
          </li>
        </ul>
        <h3 className="mt-6 font-semibold">5.2 Process</h3>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Judging takes place in early January 2027. Winners are announced on January 15, 2027, and
          notified via the contact email in the entry form. Judging panel: the organizer plus
          invited experts (names to be confirmed).
        </p>

        <h2 className="mt-10 text-xl font-bold">6. FAQ</h2>
        <div className="mt-3 space-y-4 text-neutral-300">
          <p>
            <strong>Do I need to be Korean to enter?</strong>
            <br />
            No. The data is Korean; entries may be in Korean or English.
          </p>
          <p>
            <strong>Can I use AI tools?</strong>
            <br />
            Yes, for analysis and coding — but every figure must still be verified against the
            originals. AI output is not a source.
          </p>
          <p>
            <strong>Can I enter as a team?</strong>
            <br />
            Yes. Teams may have up to 5 members.
          </p>
          <p>
            <strong>What if I find an error in the published data?</strong>
            <br />
            Report it in your entry with the original record cited. Documented, checkable corrections
            count as analysis, not as disqualification.
          </p>
          <p>
            <strong>Do I need to cover all four elections?</strong>
            <br />
            No. Cover one or more, and say which ones.
          </p>
          <p>
            <strong>When will I hear back?</strong>
            <br />
            Winners are announced January 15, 2027, and notified by email.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-bold">7. Contact</h2>
        <p className="mt-2 leading-relaxed text-neutral-300">
          Questions about the competition:{' '}
          <A href="mailto:tcgyver@jnctv.com">tcgyver@jnctv.com</A>
        </p>

        <p className="mt-10 border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-500">
          Electoral Insights Hub (OhMyCode LLC). This competition deals only with officially
          published figures.
        </p>
      </div>
    </div>
  );
}
