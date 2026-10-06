// Korean / English strings for the US board. Korean is the default; ?lang=en switches.

export type Lang = 'ko' | 'en';

const S = {
  sample: { ko: '샘플 데이터', en: 'Sample data' },
  title: { ko: '미국 중간선거 예측 2026', en: 'US Midterm Forecast 2026' },
  subtitle: {
    ko: '선거일 2026년 11월 3일 · 시뮬레이션 {n}회',
    en: 'Election Day November 3, 2026 · {n} simulations',
  },
  runId: { ko: '예측 run ID', en: 'Forecast run ID' },
  staleFresh: { ko: '입력 {d}일 경과', en: 'Inputs {d} days old' },
  staleOld: { ko: '입력 {d}일째 갱신 안 됨', en: 'Inputs not updated for {d} days' },
  nextRun: { ko: '다음 업데이트 {date} (매주 월요일)', en: 'Next update {date} (every Monday)' },
  dataAsOf: { ko: '여론조사 기준일', en: 'Polls as of' },
  senateKpi: { ko: '상원 민주당 과반 확률', en: 'P(Democratic Senate majority)' },
  houseKpi: { ko: '하원 민주당 과반 확률', en: 'P(Democratic House majority)' },
  expected: { ko: '기대 의석 {e}석 · 과반 기준 {need}석', en: 'Expected {e} seats · majority = {need}' },
  band: { ko: '80% 범위 {lo}–{hi}석', en: '80% range {lo}–{hi} seats' },
  houseAssume: { ko: '22개 경합 지역구 시뮬레이션 (가정: 민주 안전 의석 {safe}석)', en: '22 toss-up districts simulated (assumes {safe} safe Dem seats)' },
  distTitle: { ko: '민주당 의석 분포', en: 'Democratic seat distribution' },
  distNote: {
    ko: '막대 = 시뮬레이션에서 각 의석수가 나온 비율. 음영 = 80% 범위, 점선 = 과반 기준.',
    en: 'Bars = share of simulations ending at each seat count. Shaded = 80% range, dashed = majority line.',
  },
  battleTitle: { ko: '상원 경합주', en: 'Senate battlegrounds' },
  battleNote: { ko: '민주당 여론조사 우위 (D−R, %p) · 세로 점선 = 4%p 기준선', en: 'Democratic polling margin (D−R, pts) · dashed line = 4-pt mark' },
  detailTitle: { ko: '경합주 상세', en: 'Race details' },
  thState: { ko: '주', en: 'State' },
  thDem: { ko: '민주당', en: 'Democrat' },
  thRep: { ko: '공화당', en: 'Republican' },
  thAvg: { ko: 'RCP 평균', en: 'RCP average' },
  thBand: { ko: '90% 오차 범위', en: '90% margin range' },
  thRating: { ko: '레이팅', en: 'Rating' },
  thProb: { ko: 'P(민주 승리)', en: 'P(Dem win)' },
  pollsTitle: { ko: '최신 개별 여론조사: 뉴욕타임스/시에나', en: 'Latest individual polls: New York Times/Siena' },
  pollsMeta: {
    ko: '가능성 높은 유권자 대상 · {released} 공개 · 전화 조사',
    en: 'Likely voters · released {released} · phone survey',
  },
  pollsSummary: {
    ko: '{n}개 주 중 민주당 우위 {d}곳, 공화당 우위 {r}곳, 동률 {t}곳',
    en: 'Of {n} states: Democrat ahead in {d}, Republican ahead in {r}, tied in {t}',
  },
  pollsVsAvg: { ko: '모형 입력 RCP 평균 {avg}', en: 'RCP average in model {avg}' },
  pollsSample: { ko: '{n}명 · 오차 ±{moe}%p · {dates}', en: 'n={n} · ±{moe} pts · {dates}' },
  pollsTie: { ko: '동률', en: 'Tied' },
  pollsOther: { ko: '다른 조사 기관', en: 'Different pollster' },
  pollsNote: {
    ko: '개별 조사는 참고용이며 모형 입력이 아닙니다. 모형은 RCP 평균만 쓰므로, 이 조사는 평균에 반영된 뒤 다음 run에서 확률에 들어갑니다. 대부분의 격차가 오차범위 안이라 한 조사만으로 우세를 판단하면 안 됩니다.',
    en: 'Individual polls are shown for reference and are not model inputs. The model reads RCP averages only, so these polls reach the probabilities once they enter the average. Most gaps sit inside the margin of error, so no single poll settles a race.',
  },
  tabForecast: { ko: '예측', en: 'Forecast' },
  tabMessages: { ko: '메시지 분석', en: 'Message analysis' },
  msgTitle: { ko: '트럼프 트루스소셜 메시지 분석', en: "Trump's Truth Social messaging, analyzed" },
  msgMeta: {
    ko: '2025.01–{end} · {total}건 수집 · 본문 {n}건 분석',
    en: '2025.01–{end} · {total} posts collected · {n} text posts analyzed',
  },
  msgAsOf: { ko: '데이터 기준 {week} 주', en: 'Data as of week of {week}' },
  msgSnapshot: { ko: '체크인 스냅샷', en: 'checked-in snapshot' },
  msgFull: { ko: '전체 분석 보기', en: 'Full analysis' },
  ivTitle: { ko: '개입 지수', en: 'Intervention index' },
  ivNote: {
    ko: '최근 {w}주 지지 선언 중 12개 경합주로 매핑된 글의 주별 비중(합 = 100%)과, 민주당 후보 이름 언급 비중. 색은 예측과 구분하려고 파랑·빨강 대신 amber·teal을 씁니다.',
    en: 'Share of the last {w} weeks of endorsement posts mapped to each of the 12 battlegrounds (sums to 100%), and share of Democratic-candidate name mentions. Amber and teal are used instead of blue and red to keep messaging visually apart from the forecast.',
  },
  ivEndorse: { ko: '지지 화력 점유율 (최근 4주)', en: 'Endorsement share (trailing 4 wks)' },
  ivDem: { ko: '민주당 후보 언급 점유율', en: 'Democratic-candidate mention share' },
  ivZ: { ko: '평소 대비 (z-score)', en: 'vs. baseline (z-score)' },
  ivRank: { ko: '순위', en: 'Rank' },
  ivPosts: { ko: '지지 선언 {n}건 · 민주당 후보 언급 {m}건', en: '{n} endorsement posts · {m} Democratic-candidate mentions' },
  ivKpiTop: { ko: '최대 화력 주', en: 'Top state' },
  ivKpiSurge: { ko: '급증 (z > 2)', en: 'Surge (z > 2)' },
  ivKpiCoverage: { ko: '매핑 커버리지', en: 'Mapping coverage' },
  ivTopSentence: {
    ko: '최근 4주간 트럼프 지지 화력의 {p}%가 {state}에 향했습니다 (12개 주 중 {rank}위)',
    en: "{p}% of Trump's endorsement firepower went to {state} in the last 4 weeks (rank {rank} of 12)",
  },
  ivNone: { ko: '없음', en: 'None' },
  ivCoverage: { ko: '최근 4주 지지 선언 {n}건 중 {p}% 경합주 매핑', en: '{p}% of {n} endorsement posts in the last 4 weeks mapped to a battleground' },
  ivSmall: { ko: '표본 부족', en: 'Insufficient sample' },
  ivSmallNote: {
    ko: '최근 4주 경합주 매핑 글이 {n}건으로 20건 미만이라 점유율·순위·급증 대신 배지를 표시합니다. 막대는 참고용으로 흐리게 남겼습니다.',
    en: 'Only {n} battleground-mapped posts in the last 4 weeks (under 20), so shares, ranks and surges are replaced by a badge. Bars are dimmed for reference only.',
  },
  ivDemSmall: {
    ko: '민주당 후보 이름 언급이 최근 4주 {n}건으로 20건 미만이라 언급 점유율 막대는 표시하지 않습니다.',
    en: 'Democratic-candidate mentions in the last 4 weeks: {n} (under 20), so mention-share bars are not shown.',
  },
  ivSmallDetail: {
    ko: '최근 4주 경합주 매핑이 {n}건뿐이라 점유율·z·순위는 표시하지 않습니다.',
    en: 'Only {n} battleground-mapped posts in the last 4 weeks, so share, z and rank are not shown.',
  },
  ivPick: { ko: '막대를 누르면 주별 수치가 나옵니다.', en: 'Select a bar for state details.' },
  mixTitle: { ko: '주제 믹스', en: 'Topic mix' },
  mixNote: {
    ko: '월별 본문 게시물의 주제 비중 (상위 6개 주제 + 기타). 번호는 주제 급증 에피소드 주석입니다. {last}월은 진행 중입니다.',
    en: 'Monthly share of text posts by topic (top 6 + other). Numbers mark topic-spike annotations. {last} is partial.',
  },
  mixOther: { ko: '기타', en: 'Other' },
  mixAnn: { ko: '{month}: {topic} {n}건 ({p}%)', en: '{month}: {topic} {n} posts ({p}%)' },
  mixAnnKw: { ko: '두드러진 말', en: 'distinctive terms' },
  mixCaution: { ko: '* 해석 주의: 응집도(silhouette) 0.05 미만 주제.', en: '* Interpret with care: topic cohesion (silhouette) under 0.05.' },
  mixAnnNote: {
    ko: '주석은 급증 규칙(직전 12주 기준선의 2배 이상 등)으로 고른 것이며, 사건 이름은 붙이지 않았습니다.',
    en: 'Annotations are chosen by a spike rule (at least 2x the trailing 12-week baseline, etc.) and are deliberately unnamed.',
  },
  mvpTitle: { ko: '메시지 vs 민심', en: 'Message vs. public' },
  mvpNote: {
    ko: '트럼프 게시 비중과 유권자가 꼽은 문제를 주제 대응표 {v}로 짝지었습니다. 세 지표는 단위가 달라 정규화하지 않고 각자 원래 %로 그렸습니다. 높이(수준)가 아니라 오르내린 시점을 비교하세요.',
    en: 'Trump posting share and the problems voters name, paired by topic mapping {v}. The three measures have different units, so each is drawn in its own % without normalization. Compare timing, not levels.',
  },
  mvpTrump: { ko: '트럼프 게시 비중 (본문 글 중 %)', en: 'Trump posting share (% of text posts)' },
  mvpGallup: { ko: 'Gallup 가장 중요한 문제 (응답자 중 %)', en: 'Gallup most important problem (% of adults)' },
  mvpYouGov: { ko: 'YouGov 가장 중요한 이슈 (1순위 %)', en: 'YouGov most important issue (% top pick)' },
  mvpPeak: { ko: '최고치', en: 'Peak' },
  mvpMatchPartial: { ko: '부분 대응', en: 'partial match' },
  mvpMatchDirect: { ko: '직접 대응', en: 'direct match' },
  mvpMatchApprox: { ko: '근사 대응', en: 'approximate match' },
  mvpYgBreak: { ko: 'YouGov 문항 변경', en: 'YouGov wording change' },
  mvpLegend: {
    ko: 'Gallup 점: 채움 = 그 달 조사 원자료, 빈 원 = 다른 달 자료의 추세 열. 선이 끊긴 달은 자료 없음(보간하지 않음). {partial}은 진행 중인 달이라 최고치 계산에서 뺐습니다.',
    en: 'Gallup dots: filled = that month’s own release, hollow = trend column in a later release. Gaps mean no data (never interpolated). {partial} is in progress and excluded from peaks.',
  },
  mvpGaps: {
    ko: '회색 띠 = Gallup 자료 없음: 2025-06·07, 2026-08(문항 없음), 2026-09(2차 출처뿐이라 제외). 2025-08은 범죄만 있음.',
    en: 'Grey bands = no Gallup data: 2025-06, 2025-07, 2026-08 (not asked) and 2026-09 (excluded, secondary source only). 2025-08 has crime only.',
  },
  mvpGuard: {
    ko: '같은 달에 함께 오른 것은 동시 발생일 뿐 어느 쪽이 원인인지 말해 주지 않습니다.',
    en: 'Rising in the same month is co-occurrence; it does not show which way any influence runs.',
  },
  mvpSources: { ko: '출처: Gallup 월간 토플라인, YouGov/Economist 트래커(CC BY-NC 4.0)', en: 'Sources: Gallup monthly toplines, YouGov/Economist tracker (CC BY-NC 4.0)' },
  msgMethodTitle: { ko: '방법론 노트', en: 'Methodology notes' },
  msgM1: {
    ko: '데이터: CNN Truth Social 아카이브 → truth-analysis 파이프라인 (수집 {collected}, 주 1회 갱신)',
    en: 'Data: CNN Truth Social archive → truth-analysis pipeline (collected {collected}, weekly)',
  },
  msgM2: {
    ko: '군집: all-mpnet-base-v2 → t-SNE → k-means k=10, silhouette(코사인) {sil}, 즉 군집 경계가 뚜렷하지 않습니다. 주제 이름(라벨 {lv})은 키워드와 대표 게시물을 보고 붙인 해석입니다.',
    en: 'Clusters: all-mpnet-base-v2 → t-SNE → k-means k=10, silhouette (cosine) {sil}: boundaries are weak. Topic names (labels {lv}) are interpretations',
  },
  msgM3: {
    ko: '매핑: 가제티어 {g}, 후보명 우선 → 주 이름 → 약어, 동명이인·경선 탈락자는 규칙과 날짜로 제한 (방법 {m})',
    en: 'Mapping: gazetteer {g}, candidate name first → state name → abbreviation; namesakes and primary losers restricted by rules and dates (method {m})',
  },
  msgAudit: {
    ko: '라벨 감사({v}): 고정 표본 {n}건(주제당 {per}건) 중 최종 {k}건이 라벨과 맞아 일치율 {p}% (95% 신뢰구간 {lo}–{hi}%).',
    en: 'Label audit ({v}): in the final judgments, {k} of {n} sampled posts ({per} per topic) matched their label, {p}% (95% CI {lo}–{hi}%).',
  },
  msgAuditHow: {
    ko: '기준: “{c}”. 1차로 검토자 {r}명이 같은 루브릭으로 표본을 나눠 판정했습니다(글당 1명).',
    en: 'Criterion: “{c}”. In the first pass the sample was split among {r} reviewers using the same rubric (one reviewer per post).',
  },
  msgAuditRe: {
    ko: '이어서 {r2}명이 300건 전체를 다시 보고 최종 판정에 합의했고 {ch}건이 바뀌었습니다(N→Y {ny}, Y→N {yn}). 1차 판정 대비 유지율 {ret}% (κ {k}).',
    en: 'Then {r2} reviewers re-checked all posts and agreed final judgments; {ch} changed ({ny} N→Y, {yn} Y→N). First-pass retention {ret}% (κ {k}).',
  },
  msgAuditIrr: {
    ko: '재검토자 개별 판정이 기록되지 않아 검토자 간 일치도는 측정하지 않았습니다.',
    en: 'Inter-rater agreement was not measured because individual re-review judgments were not recorded.',
  },
  msgAuditLow: { ko: '일치율이 가장 낮은 주제: {list}.', en: 'Lowest-fit topics: {list}.' },
  msgLimitsTitle: { ko: '한계', en: 'Limits' },
  msgL1: { ko: '인과 추론 불가: 지지 선언은 접전주를 따라다닙니다', en: 'No causal reading: endorsements follow competitive races' },
  msgL2: { ko: '트루스소셜 ≠ 유권자 전체', en: 'Truth Social is not the electorate' },
  msgL3: { ko: '소규모·저응집 주제에 기반한 주장은 자제합니다', en: 'Avoid claims built on small or low-cohesion topics' },
  msgL4: { ko: '참여도(좋아요 등) 지표는 알고리즘·봇 영향을 받을 수 있습니다', en: 'Engagement metrics can be distorted by algorithms and bots' },
  msgGuard: {
    ko: '이 탭은 기술적 서술만 하며 예측 모형의 입력이 아닙니다. 추측성 해석에는 (추정)을 붙입니다.',
    en: 'This tab is descriptive only and is not a forecast input. Speculative readings are labeled (inferred).',
  },
  houseTitle: { ko: '하원', en: 'House' },
  generic: { ko: '전국 여론조사 평균 (generic ballot)', en: 'Generic ballot average' },
  compDist: { ko: '경합 지역구 조사 ({n}곳)', en: 'Competitive-district polls ({n})' },
  houseSim: { ko: '경합 지역구 시뮬레이션', en: 'Toss-up simulation' },
  houseNote: {
    ko: '지역구별 여론조사가 아직 없어 22개 경합 지역구에 평균(D+2.0)을 일괄 적용한 샘플 시뮬레이션입니다. 일일 여론조사 적재가 시작되면 실제 지역구 수치로 교체됩니다.',
    en: 'District-level polls are not ingested yet, so all 22 toss-ups use the competitive-district average (D+2.0). This is a sample simulation until the daily poll ingest replaces it.',
  },
  liveTitle: { ko: '개표일 실시간 트래커', en: 'Election-night tracker' },
  livePre: {
    ko: '개표 전입니다. 결과가 나오기 전에는 확률과 불확실성 범위만 표시합니다. 선거 당일 개표가 시작되면 이 자리에 확정 의석과 개표율이 표시됩니다.',
    en: 'Counting has not started. Until results arrive the board shows only probabilities and uncertainty ranges. On election night this panel shows called seats and percent reporting.',
  },
  liveWindow: {
    ko: '운영 기간: {start} ~ {end} (선거 전날부터 선거 후 일주일, 미 동부 기준). 기간 중 1분마다 갱신합니다.',
    en: 'Runs {start} to {end} (the day before Election Day through one week after, ET). Refreshes every minute in that window.',
  },
  liveCalledRule: {
    ko: '개표 수치는 각 주 선거관리 당국의 공식 결과만 씁니다. 확정 표시는 뉴욕타임스가 승자를 판정한 경주에만 붙이며(출처 표기), 개표율이나 표 차이만으로는 확정으로 표시하지 않습니다.',
    en: 'Vote counts come only from official state election offices. A race is marked called only when The New York Times has called it (credited); vote share or margin alone never marks a race as decided.',
  },
  liveSources: { ko: '출처:', en: 'Sources:' },
  liveAgo: { ko: '{m}분 전 업데이트', en: 'Updated {m} min ago' },
  liveWaiting: {
    ko: '결과 대기 중입니다. 투표가 끝나고 출처가 집계를 발표하면 표시됩니다.',
    en: 'Waiting for results. They appear once polls close and the sources publish counts.',
  },
  liveNotConfigured: {
    ko: '결과 피드가 아직 연결되지 않아 결과를 표시하지 않습니다.',
    en: 'The results feed is not connected yet, so no results are shown.',
  },
  liveDown: {
    ko: '결과 소스가 응답하지 않습니다. 아래 출처에서 직접 확인하세요.',
    en: 'The results source is not responding. Check the sources below directly.',
  },
  liveStale: {
    ko: '결과가 {m}분째 갱신되지 않았습니다. 마지막으로 받은 값을 보여주고 있으니 출처에서 최신 결과를 확인하세요.',
    en: 'Results have not updated for {m} min. Showing the last data received; check the sources for the latest.',
  },
  liveClosed: { ko: '트래커 운영 기간이 끝났습니다.', en: 'The tracker window has ended.' },
  liveNotCalled: { ko: '미확정', en: 'Not called' },
  liveCountSource: { ko: '개표 출처', en: 'Count source' },
  liveDays: { ko: '선거일까지 {d}일', en: '{d} days to Election Day' },
  liveCalled: { ko: '확정', en: 'Called' },
  liveReporting: { ko: '개표율', en: 'Reporting' },
  methodTitle: { ko: '방법론', en: 'Methodology' },
  method1: {
    ko: '각 시뮬레이션은 전국 공통 오차 s ~ N(0, τ²) 하나를 뽑고, 각 지역의 결과 = mᵢ + s + σᵢ·εᵢ 로 계산합니다. s가 모든 지역에 공통 적용되므로 지역들이 함께 움직이는 효과가 반영됩니다.',
    en: 'Each simulation draws one national error s ~ N(0, τ²), then scores every race as mᵢ + s + σᵢ·εᵢ. Because s is shared, races move together the way they do in real elections.',
  },
  mTau: { ko: 'τ = {tau}pt (전국 오차 스케일, 과거 선거의 여론조사 오차로 보정 예정)', en: 'τ = {tau} pts (national error; to be calibrated on past cycles)' },
  mSigma: { ko: 'σᵢ = 4.0pt (지역별 오차, 현재 일괄 적용)', en: 'σᵢ = 4.0 pts (race error, same for all races for now)' },
  mSims: { ko: '{n}회 시뮬레이션 · seed {seed} (같은 입력이면 같은 결과)', en: '{n} simulations · seed {seed} (same inputs give the same result)' },
  mGeneric: { ko: '전국 여론조사는 지역구 결과로 1:1 환원되지 않으므로 직접 사용하지 않음', en: 'The generic ballot is not mapped 1:1 to districts and is not used directly' },
  sources: { ko: '출처', en: 'Sources' },
  charterTitle: { ko: '편집 원칙', en: 'Editorial charter' },
  charter: {
    ko: [
      '이 보드는 특정 후보나 정당을 지지하지 않으며, 정보 제공만을 목적으로 합니다.',
      '모든 숫자에는 출처가 붙습니다. 여론조사 평균은 공개 집계 기준이고, 확률은 run ID로 재현할 수 있습니다.',
      '확률은 결과가 아닙니다. 60% 우세 후보도 열 번 중 네 번은 집니다.',
      '결과 발표 전에는 미래 데이터를 쓰지 않고, 확률과 불확실성 범위로만 표시합니다.',
      '첫 선거 사이클의 모델은 베타입니다. 선거가 끝난 뒤 실제 결과로 검증해 공개합니다.',
    ],
    en: [
      'This board supports no candidate or party; its purpose is information only.',
      'Every number carries a source. Polling averages come from public aggregates; probabilities are reproducible from the run ID.',
      'Probabilities are not results. A 60% favorite loses four times in ten.',
      'No future data is used. Before results, the board shows only probabilities and uncertainty ranges.',
      'The model is in beta for its first cycle and will be scored against actual results after the election.',
    ],
  },
  assumptions: { ko: '공개 전 교체해야 할 가정', en: 'Assumptions to replace before launch' },
  // Rendered in place of the English notes in seed-data.ts. Those strings feed the
  // run-ID hash (run.ts), so the data stays unchanged and only the display is localized.
  aSigma: {
    ko: '지역별 오차 σᵢ = {sigma}pt, 모든 지역 일괄 적용 (가정)',
    en: 'Race-level error σᵢ = {sigma} pts for all races (labeled assumption)',
  },
  aTau: {
    ko: '전국 오차 스케일 τ = {tau}pt (가정, 과거 선거의 여론조사 오차로 보정 예정)',
    en: 'National error scale τ = {tau} pts (labeled assumption; calibrate from historical cycle polling error)',
  },
  aHouseSafe: {
    ko: '하원 민주 안전 의석 {safe}석 (가정, Cook 레이팅 기준 안전 의석으로 교체 예정)',
    en: 'House safe Democratic seats = {safe} (assumption; replace with Cook-rated safe-seat baseline)',
  },
  aHouseTossup: {
    ko: '하원 경합 지역구 {n}곳에 D+2.0 임시값 일괄 적용',
    en: 'House toss-ups: D+2.0 placeholder × {n}',
  },
  liveSource: {
    ko: '개표 시작 전 · 투표 마감 전에는 결과를 표시하지 않습니다',
    en: 'Not started — no results are shown before polls close',
  },
  footer: { ko: '비당파 예측', en: 'Non-partisan forecast' },
  ratingLeansD: { ko: '민주 우세', en: 'Leans D' },
  ratingLeansR: { ko: '공화 우세', en: 'Leans R' },
  ratingTossUp: { ko: '경합', en: 'Toss Up' },
  langSwitch: { ko: 'English', en: '한국어' },
} as const;

type Key = keyof typeof S;

export function t(lang: Lang, key: Key, vars: Record<string, string | number> = {}): string {
  const v = S[key][lang];
  if (typeof v !== 'string') throw new Error(`${key} is a list; use tl()`);
  return v.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

const RATING_KEY: Record<string, Key> = {
  'Leans D': 'ratingLeansD',
  'Leans R': 'ratingLeansR',
  'Toss Up': 'ratingTossUp',
};

/** Localize a rating label from the seed data; unknown labels pass through. */
export function tRating(lang: Lang, rating: string): string {
  const key = RATING_KEY[rating];
  return key ? t(lang, key) : rating;
}

export function tl(lang: Lang, key: 'charter'): readonly string[] {
  return S[key][lang];
}
