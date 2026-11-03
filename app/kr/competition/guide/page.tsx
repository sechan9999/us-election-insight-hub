// Participant Guide — official rules for the 18th–21st Presidential
// Election Data Analysis Competition. Approved by the organizer
// 2026-11-03. Bilingual: ?lang=ko renders the Korean rules, ?lang=en
// the English rules. Sources:
// ~/workspace/user/files/competition-participant-guide-2026-11-03.md (EN)
// ~/workspace/user/files/competition-participant-guide-ko-2026-11-03.md (KO)
// (the competition page links here.)
// Sponsor: JNCTV (added 2026-11-03); sponsor logo (public/jnctv-logo.png)
// links to https://jnctv.com/ (added 2026-11-03).

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
      lang === 'ko'
        ? '18–21대 대선 데이터 분석 컴피티션 공식 규칙: 일정, 규칙, 기술 자료, 문제, 심사 정보.'
        : 'Official rules for the 18th–21st Presidential Election Data Analysis Competition: schedule, rules, technical resources, problem statements, and judging.',
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
          {lang === 'ko'
            ? '18–21대 대선 데이터 분석 컴피티션 — 참가자 가이드'
            : '18th–21st Presidential Election Data Analysis Competition — Participant Guide'}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {lang === 'ko' ? (
            <>
              공식 규칙, 2026년 11월 3일 주최 측 승인. In-kind 상품은 OhMyCode LLC 제공, 심사위원은
              주최 측과 초빙 전문가, 문의:{' '}
              <A href="mailto:tcgyver@jnctv.com">tcgyver@jnctv.com</A>.
            </>
          ) : (
            <>
              Official rules, approved by the organizer on November 3, 2026. In-kind prizes provided
              by OhMyCode LLC; judging panel: organizer plus invited experts; questions:{' '}
              <A href="mailto:tcgyver@jnctv.com">tcgyver@jnctv.com</A>.
            </>
          )}
        </p>

        {lang === 'ko' ? (
          <>
            <p className="mt-6 leading-relaxed text-neutral-300">
              18–21대 대선 데이터 분석 컴피티션에 오신 것을 환영합니다!
            </p>
            <p className="mt-3 leading-relaxed text-neutral-300">
              이 가이드는 일정, 규칙, 기술 자료, 문제, 심사 정보 등 행사에 필요한 모든 내용을 담은
              종합 안내서입니다. 꼼꼼히 읽어 주세요. 대부분의 질문에 대한 답을 여기서 찾을 수
              있습니다.
            </p>
            <p className="mt-3 leading-relaxed text-neutral-300">
              주최: Electoral Insights Hub (OhMyCode LLC).
            </p>
            <p className="mt-3 flex items-center gap-2 leading-relaxed text-neutral-300">
              후원:
              <a href="https://jnctv.com/" target="_blank" rel="noopener noreferrer">
                <img src="/jnctv-logo.png" alt="JNC TV" className="h-8 w-auto" />
              </a>
            </p>

            <h2 className="mt-10 text-xl font-bold">1. 목표: 문제</h2>
            <p className="mt-2 leading-relaxed text-neutral-300">
              테마: <strong>주장이 아니라 원본으로 확인하라.</strong>
            </p>
            <p className="mt-2 leading-relaxed text-neutral-300">
              18대(2012)부터 21대(2025)까지의 대통령선거 데이터를 모두가 사용하는 같은 공개 자료로
              분석하고, 모든 수치를 원본 기록과 대조해 검증합니다. 좋은 참가작은 결과를 제시하는 데
              그치지 않고, 수치 하나하나가 어디에서 왔고 어떻게 확인했는지를 보여줍니다.
            </p>
            <p className="mt-2 leading-relaxed text-neutral-300">
              주제 중 하나를 선택하세요(또는 &ldquo;기타&rdquo;로 직접 제안하세요):
            </p>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-neutral-300">
              <li>
                <strong>투표지분류기 운영과 K값 분석.</strong> 18·19대 분류기 운영 결과와 미분류표
                패턴. 배경: K는 분류기가 가려낸 분류표와 미분류표에서 두 선두 후보의 득표 비율을
                비교합니다. K = 1이면 두 후보의 미분류율이 같다는 뜻입니다. 2017년 프로젝트부 글은
                18대 대선의 K값이 1.5로 나타났다고 설명합니다. 여러분의 과제는 그 해석을 되풀이하는
                것이 아니라, 원본 기록으로 직접 계산하고 검증하는 것입니다.
              </li>
              <li>
                <strong>선거 간 개표 패턴 비교.</strong> 18대에서 21대까지, 표를 세고 분류하고
                보고하는 방식이 어떻게 달라졌는가?
              </li>
              <li>
                <strong>시각화와 대시보드.</strong> 누구나 원본으로 확인할 수 있는 결과 — 독자가 모든
                수치를 출처까지 거슬러 올라가 확인할 수 있는 인터랙티브 결과물.
              </li>
            </ol>

            <h2 className="mt-10 text-xl font-bold">2. 일정</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-300">
              <li>
                <strong>접수 시작:</strong> 2026년 11월 3일. 참가 신청 폼으로 제출:{' '}
                <A href="https://forms.gle/97UHnHhM1gMDAuQH8">
                  https://forms.gle/97UHnHhM1gMDAuQH8
                </A>
              </li>
              <li>
                <strong>제출 마감:</strong> 2026년 12월 31일(목).
              </li>
              <li>
                <strong>심사:</strong> 2027년 1월 초.
              </li>
              <li>
                <strong>결과 발표:</strong> 2027년 1월 15일(금).
              </li>
              <li>
                <strong>규칙:</strong> 이 가이드(2026년 11월 3일 승인).
              </li>
            </ul>

            <h2 className="mt-10 text-xl font-bold">3. 규칙</h2>
            <h3 className="mt-6 font-semibold">3.1 참가 자격</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              누구나 참가할 수 있습니다. 국적, 연령, 소속 제한이 없습니다. 참가작은 한국어 또는
              영어로 작성할 수 있습니다.
            </p>
            <h3 className="mt-6 font-semibold">3.2 팀</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              개인 참가와 팀 참가 모두 가능합니다. 팀은 최대 5명까지입니다.
            </p>
            <h3 className="mt-6 font-semibold">3.3 제출 내용</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              참가 신청 폼으로 제출합니다. 각 참가작은 다음을 포함해야 합니다:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
              <li>참가작 제목, 팀명, 팀원, 연락 이메일.</li>
              <li>주제(위 세 가지 중 하나, 또는 설명을 덧붙인 &ldquo;기타&rdquo;).</li>
              <li>대상 선거(18대, 19대, 20대, 21대 중 하나 이상).</li>
              <li>분석 요약: 무엇을 분석했고 무엇을 발견했는지.</li>
              <li>
                결과물 링크: 공개 GitHub 저장소 또는 공개 대시보드. 심사 대상이 되려면 결과물이
                공개되어 있어야 하며, 비공개 링크는 심사하지 않습니다.
              </li>
              <li>
                검증 방법: 모든 수치를 원본과 어떻게 대조해 검증했는지(필수 — 3.5 참조).
              </li>
              <li>이 분석이 보여주는 것: 결과가 왜 중요한지.</li>
              <li>
                선택 사항: 발표 영상(3분 이내 권장)과 추가로 사용한 공개 데이터 출처.
              </li>
            </ul>
            <h3 className="mt-6 font-semibold">3.4 데이터 규칙</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
              <li>
                네 개의 공개 선거 아카이브(4절) 중 최소 하나를 사용해야 합니다. 출처를 밝히면 다른
                공개 자료도 추가로 사용할 수 있습니다.
              </li>
              <li>
                수치는 공개 아카이브나 출처를 밝힌 다른 공개 자료에서 가져와야 하며, 기억이나 추정,
                검증되지 않은 제3자의 주장에서 가져와서는 안 됩니다.
              </li>
              <li>
                참고: 프로젝트부 미러에 있는 18대 대선 원본 스캔은 일부가 빠져 있습니다(아카이브 색인
                공개 사항 참조). 빠져 있는 파일에 대해 완전하다고 주장하지 마세요.
              </li>
            </ul>
            <h3 className="mt-6 font-semibold">3.5 검증 규칙(핵심 규칙)</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              참가작의 모든 수치는 원본 기록 — 개표상황표, 분류기 운영 기록, 공식 투표구 결과 —
              까지 거슬러 올라갈 수 있어야 하며, 어떻게 확인했는지 설명해야 합니다. 날조했거나
              검증할 수 없거나 출처를 밝힐 수 없는 수치가 있는 참가작은 실격됩니다. 검증할 수 없는
              수치가 있으면 사실인 것처럼 제시하지 말고, 그 사실을 밝히고 제외하세요.
            </p>
            <h3 className="mt-6 font-semibold">3.6 비당파 규칙</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              이 컴피티션은 공식 발표 수치만을 다룹니다. 후보·정당·정책에 대한 추천이나 평가는
              컴피티션의 일부가 아니며, 참가작에 포함되어서는 안 됩니다.
            </p>
            <h3 className="mt-6 font-semibold">3.7 독창성과 AI 사용</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              참가작은 본인의 작업이어야 합니다. 분석과 코딩에 AI 도구를 사용할 수 있지만, 모든
              수치는 여전히 3.5에 따라 검증해야 합니다. AI 출력은 출처가 아닙니다. 표절한 참가작은
              실격됩니다.
            </p>
            <h3 className="mt-6 font-semibold">3.8 1팀 1작품, 재제출</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              1팀당 1작품입니다. 마감 전에 재제출할 수 있으며, 마지막 제출본이 심사 대상입니다.
            </p>
            <h3 className="mt-6 font-semibold">3.9 상금</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
              <li>현금 상금: 1등 $1,000.</li>
              <li>
                차순위 수상자에게는 OhMyCode LLC가 제공하는 in-kind 상품. 상세 내용은 추후
                공지합니다.
              </li>
            </ul>
            <h3 className="mt-6 font-semibold">3.10 실격</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              다음 경우 실격됩니다. 날조했거나 검증할 수 없는 수치, 후보·정당·정책에 대한 추천이나
              평가, 표절, 비공개 또는 접근할 수 없는 결과물, 마감(2026년 12월 31일) 이후 제출.
            </p>
            <h3 className="mt-6 font-semibold">3.11 공개 및 개인정보</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              참가함으로써 제출한 자료가 주최 측에 의해 공개·공유·홍보될 수 있음에 동의하게
              됩니다(이 동의는 참가 신청 폼에서 받습니다). 연락 이메일은 컴피티션 운영에만
              사용합니다.
            </p>

            <h2 className="mt-10 text-xl font-bold">4. 기술 자료</h2>
            <p className="mt-2 leading-relaxed text-neutral-300">
              네 번의 대선 기록이 전부 공개되어 있습니다:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-neutral-300">
              <li>
                <strong>18대(2012):</strong> 분류 결과와 미분류표 K값, 251개 구, 공식 투표구 결과
                17,871행, 원본 스캔 73,363장.{' '}
                <A href="https://storage.googleapis.com/k18-archive/index.html">
                  https://storage.googleapis.com/k18-archive/index.html
                </A>
              </li>
              <li>
                <strong>19대(2017):</strong> 투표지분류기 기록, 개표단위 13,949곳, 공식 투표구 결과
                22,214행.{' '}
                <A href="https://storage.googleapis.com/k19-archive/index.html">
                  https://storage.googleapis.com/k19-archive/index.html
                </A>
              </li>
              <li>
                <strong>20대(2022):</strong> 개표상황표 원본 17,377장, 공식 투표구 결과 22,752행.{' '}
                <A href="https://storage.googleapis.com/k20-tally-archive/index.html">
                  https://storage.googleapis.com/k20-tally-archive/index.html
                </A>
              </li>
              <li>
                <strong>21대(2025):</strong> 개표상황표 원본 18,949장, 공식 투표구 결과 22,685행.{' '}
                <A href="https://storage.googleapis.com/k21-tally-archive/index.html">
                  https://storage.googleapis.com/k21-tally-archive/index.html
                </A>
              </li>
            </ul>
            <p className="mt-4 leading-relaxed text-neutral-300">도움이 되는 도구와 배경 자료:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-neutral-300">
              <li>
                데이터 탐색 에이전트(질문, 수치 확인, 개표상황표 보기):{' '}
                <A href="https://app.ohmycodellc.com/kr/agent">
                  https://app.ohmycodellc.com/kr/agent
                </A>
              </li>
              <li>
                대시보드, 21대 대선 비교 뷰:{' '}
                <A href="https://k18to21-election2.vercel.app/?view=compare&election=21st">
                  https://k18to21-election2.vercel.app/?view=compare&amp;election=21st
                </A>
              </li>
              <li>
                뉴스타파 데이터 포털, 18·19대 대선 투표지분류기 운영 결과:{' '}
                <A href="https://data.newstapa.org/datasets/18-19대-대선-투표지-분류기-운영결과">
                  https://data.newstapa.org/datasets/18-19대-대선-투표지-분류기-운영결과
                </A>
              </li>
              <li>
                프로젝트부 아카이브, K값 설명 글(전희경·현화신, 2017):{' '}
                <A href="http://www.projectboo.com/archive/153768">
                  http://www.projectboo.com/archive/153768
                </A>
              </li>
              <li>
                전체 코드(공개 GitHub):{' '}
                <A href="https://github.com/sechan9999/K18to21Election2">
                  https://github.com/sechan9999/K18to21Election2
                </A>
              </li>
            </ul>

            <h2 className="mt-10 text-xl font-bold">5. 심사</h2>
            <h3 className="mt-6 font-semibold">5.1 심사 기준</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-300">
              <li>
                <strong>검증 충실도 — 40%.</strong> 모든 수치를 원본까지 거슬러 올라가 다시 확인할 수
                있는가? 가장 비중이 큰 기준입니다.
              </li>
              <li>
                <strong>분석 통찰 — 30%.</strong> 분석이 실질적이고 근거가 탄탄한 내용을 말하고
                있는가?
              </li>
              <li>
                <strong>재현 가능성과 명확성 — 20%.</strong> 다른 사람이 결과물만으로 작업을 재현하고
                논리를 따라갈 수 있는가?
              </li>
              <li>
                <strong>발표 — 10%.</strong> 대시보드나 영상을 포함해 결과가 읽기 쉽고 사용하기
                좋은가?
              </li>
            </ul>
            <h3 className="mt-6 font-semibold">5.2 심사 절차</h3>
            <p className="mt-2 leading-relaxed text-neutral-300">
              심사는 2027년 1월 초에 진행됩니다. 수상작은 2027년 1월 15일에 발표되며, 참가 신청
              폼에 적힌 연락 이메일로 통지합니다. 심사위원: 주최 측과 초빙 전문가(명단 추후 확정).
            </p>

            <h2 className="mt-10 text-xl font-bold">6. 자주 묻는 질문</h2>
            <div className="mt-3 space-y-4 text-neutral-300">
              <p>
                <strong>한국인이어야 참가할 수 있나요?</strong>
                <br />
                아니요. 데이터는 한국어이지만, 참가작은 한국어 또는 영어로 작성할 수 있습니다.
              </p>
              <p>
                <strong>AI 도구를 사용할 수 있나요?</strong>
                <br />
                네, 분석과 코딩에 사용할 수 있습니다. 다만 모든 수치는 여전히 원본과 대조해
                검증해야 합니다. AI 출력은 출처가 아닙니다.
              </p>
              <p>
                <strong>팀으로 참가할 수 있나요?</strong>
                <br />
                네. 팀은 최대 5명까지입니다.
              </p>
              <p>
                <strong>공개 데이터에서 오류를 발견하면 어떻게 하나요?</strong>
                <br />
                원본 기록을 인용해 참가작에 보고하세요. 문서화되고 확인 가능한 정정은 실격 사유가
                아니라 분석입니다.
              </p>
              <p>
                <strong>네 번의 선거를 모두 다뤄야 하나요?</strong>
                <br />
                아니요. 하나 이상을 다루고, 어떤 선거를 다루는지 밝히세요.
              </p>
              <p>
                <strong>언제 결과를 알 수 있나요?</strong>
                <br />
                수상작은 2027년 1월 15일에 발표되며 이메일로 통지합니다.
              </p>
            </div>

            <h2 className="mt-10 text-xl font-bold">7. 문의</h2>
            <p className="mt-2 leading-relaxed text-neutral-300">
              컴피티션에 대한 문의:{' '}
              <A href="mailto:tcgyver@jnctv.com">tcgyver@jnctv.com</A>
            </p>

            <p className="mt-10 border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-500">
              Electoral Insights Hub (OhMyCode LLC). 이 컴피티션은 공식 발표 수치만을 다룹니다.
            </p>
          </>
        ) : (
          <>
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
        <p className="mt-3 flex items-center gap-2 leading-relaxed text-neutral-300">
          Sponsor:
          <a href="https://jnctv.com/" target="_blank" rel="noopener noreferrer">
            <img src="/jnctv-logo.png" alt="JNC TV" className="h-8 w-auto" />
          </a>
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
          </>
        )}
      </div>
    </div>
  );
}
