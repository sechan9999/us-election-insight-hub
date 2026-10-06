# US Election Insights Hub

2026년 11월 3일 미국 중간선거 예측·개표 현황판입니다. 한국 대선 18–21대 대시보드(Electoral Insights Hub) 팀이 같은 데이터 스택(Next.js · BigQuery · Cloud Run)으로 만듭니다. 한국어·영어 이중언어, 로그인 없음, TV에서 훑어보는 용도입니다.

> **상태: 개발 중 (베타).** 현재 화면은 2026-10-01 RCP 평균을 넣은 샘플 데이터로 돌아갑니다. 공개 전 교체해야 할 가정은 아래와 화면의 "공개 전 교체해야 할 가정"에 정리했습니다.

## 화면 (`/us`, 영어는 `/us?lang=en`)

- 상원·하원 민주당 과반 확률, 기대 의석, 80% 의석 범위, 의석 분포 히스토그램
- 개표일 실시간 트래커 (개표 전에는 확률과 불확실성 범위만 표시)
- 상원 경합주 여론조사 평균 차트 (4pt 기준선, 세로 배치로 라벨 충돌 없음)
- 경합주 상세: 후보, RCP 평균, 90% 오차 범위, 레이팅, 승리 확률
- 하원 패널, 방법론, 가정, 출처, 편집 헌장 ([docs/EDITORIAL_CHARTER.md](docs/EDITORIAL_CHARTER.md))
- 헤더의 run ID(`us-fc-<기준일>-<입력 해시>`)로 같은 숫자를 재현할 수 있습니다.

## 트럼프 메시지 분석 탭 (`/us?tab=truth`, 모형 입력 아님)

[trump-truth-analysis](https://github.com/sechan9999/trump-truth-analysis)가 매주 만드는 JSON 두 개를 브라우저에서 불러와 표시합니다(`app/us/MessageTab.tsx`, `app/us/lib/truth.ts`). 재배포 없이 주간 갱신이 반영되고, `seed-data.ts`와 run ID에는 영향이 없습니다.

- [`weekly.json`](https://sechan9999.github.io/trump-truth-analysis/weekly.json): 최근 4주 주제 구성(취임 이후 이전 기간 대비 %p), 주제별 주간 추이(최근 26주), 대표 키워드, 응집도 0.05 미만 '해석 주의'
- 이벤트 타임라인(`app/us/EventTimeline.tsx`): `weekly.json`의 `events`. 주간 게시량 막대 아래에 주제별 급증 에피소드 띠를 표시하고, 선택하면 기간·평소 대비 배수·두드러진 키워드·대표 게시물 원문 링크를 보여줌. 사건 이름은 붙이지 않음. 여론조사 시계열이 들어오면 같은 에피소드를 추이 차트 주석으로 재사용 가능
- [`intervention.json`](https://sechan9999.github.io/trump-truth-analysis/intervention.json): 상원 경합주 개입 지수(지지 선언 점유율, 민주당 후보 언급, 경합주 매핑 20건 미만이면 '표본 부족')
- 한계: 주제 이름은 해석, 군집 경계 약함, 지지 선언은 접전주를 따라가는 내생 변수, 트루스소셜 ≠ 유권자

## 모델 (`app/us/lib/forecast.ts`)

각 시뮬레이션은 전국 공통 오차 s ~ N(0, τ²)를 하나 뽑아 모든 선거구에 공유하고, 선거구 결과 = mᵢ + s + σᵢ·εᵢ로 계산합니다. 선거구별 공개 확률은 닫힌 식 Φ(mᵢ / √(σᵢ² + τ²)), 의회 과반은 시뮬레이션(상관 때문에 닫힌 식 없음)으로 구합니다.

`npm run verify:model` (2026-10-02 실행 결과):

| 검사 | 결과 |
|---|---|
| Monte Carlo(20만 회) vs 닫힌 식, 마진 −8~+8 | 최대 차이 0.0017 |
| 같은 seed 재실행 | 결과 동일 |
| 상원 P(민주 과반) | 57.8%, 기대 50.75석, 80% 범위 47–54석 |
| 하원 P(민주 과반) | 54.3%, 기대 217.2석, 80% 범위 208–224석 |
| 선거구별 시뮬레이션 vs 닫힌 식 | 12개 주 모두 0.01 이내 |

## 공개 전 교체해야 할 가정

- σᵢ = 4.0pt 일괄 (여론조사 수·편차 기반으로 교체)
- τ = 3.5pt (과거 사이클 여론조사 오차로 보정)
- 하원: 경합 22곳 모두 D+2.0 placeholder, 안전 민주 203석(경합 22곳 중 11곳이 민주 현직이라는 가정). **하원 분포는 상한 225석(203+22)에서 잘립니다.** 시뮬레이션의 약 8%가 225석에 몰려 있어, 경합 지역구 목록이 늘거나 지역구 여론조사가 들어오기 전까지 하원 확률은 이 상한의 영향을 받습니다. Cook 등 공개 레이팅 기준 안전 의석과 전체 경합 지역구로 교체해야 합니다.
- 상원 기준선: 53R–47D, 민주 과반 51석(부통령 공화당). 경합 12곳 중 4곳(GA, MI, MN, NH)이 민주 보유 → 안전 민주 43석.

## 데이터 흐름 (운영)

```
us_polls ──▶ us_poll_averages ──▶ (Vertex AI 커스텀 잡: 시뮬레이션) ──▶ us_forecast_runs
                                                                     ├─▶ us_race_forecasts
                                                                     └─▶ us_chamber_forecasts
선거일: 집계 기관 피드 ──▶ us_results_live ──▶ 트래커 패널
```

테이블 정의: [bigquery/us_schema.sql](bigquery/us_schema.sql). 지금은 `app/us/lib/seed-data.ts`가 입력이고, 일일 적재가 시작되면 이 파일만 BigQuery에서 생성한 값으로 바꾸면 됩니다. 모델과 화면은 그대로입니다.

## 실행

```bash
npm install
npm run dev            # http://localhost:3000/us
npm run verify:model   # 모델 검증
npm run build          # standalone 빌드 (Dockerfile용)
```

## Cloud Run 배포

```bash
export PROJECT=your-gcp-project REGION=us-central1
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT/us-hub/app:staging .
gcloud run deploy us-hub-staging \
  --image $REGION-docker.pkg.dev/$PROJECT/us-hub/app:staging \
  --region $REGION --allow-unauthenticated \
  --port 8080 --cpu 1 --memory 512Mi --min-instances 0 --max-instances 10
```

공개 트래픽 전 예산 알림을 먼저 걸어 두세요 (`gcloud billing budgets create ... --threshold-rule=percent=50/80/100`).

## 파일

| 경로 | 내용 |
|---|---|
| `app/us/page.tsx` | 예측 보드 (클라이언트 컴포넌트) |
| `app/us/lib/forecast.ts` | 상관오차 시뮬레이션, 닫힌 식, seed 고정 난수 |
| `app/us/lib/seed-data.ts` | 샘플 입력 (RCP 2026-10-01), 기준선, 가정 |
| `app/us/lib/run.ts` | run ID = 기준일 + 입력 해시 |
| `app/us/lib/live.ts` | 개표일 결과 피드 (선거일 전 비어 있음) |
| `app/us/lib/i18n.ts` | 한국어·영어 문자열 |
| `scripts/verify-model.ts` | 모델 검증 스크립트 |
| `bigquery/us_schema.sql` | BigQuery 테이블 |
| `Dockerfile` | Cloud Run용 멀티스테이지 빌드 |
