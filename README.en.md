# US Election Insights Hub

[한국어](README.md) · **English**

A forecast and results board for the US midterm elections on November 3, 2026. It is built by the team behind the Korean presidential election dashboards (Electoral Insights Hub, 18th–21st elections) on the same stack: Next.js, BigQuery and Cloud Run. The board is bilingual (Korean/English), needs no login, and is designed to be scanned on a TV screen.

**Live:** https://us-election-insight-hub-38273401034.us-central1.run.app/us (`?lang=en` for English)

> **Status: in development (beta).** The board currently runs on sample data built from RCP averages as of 2026-10-01. Assumptions that must be replaced before launch are listed below and in the on-screen "Assumptions to replace before launch" section.

## Screens (`/us`, English at `/us?lang=en`)

The page has two tabs: **Forecast** (default) and **Message analysis** (`?tab=messages`). Both combine with the language parameter, e.g. `?lang=en&tab=messages`. Switching tabs is client-side state only, so the 40,000-run simulation is not re-run.

### Forecast tab
- Probability of a Democratic majority in the Senate and House, expected seats, 80% seat range, and seat-distribution histograms.
- Election-night tracker. Before counting starts, it shows only probabilities and uncertainty ranges.
- Senate battleground polling-average chart (4-pt reference line; vertical layout so labels never collide).
- Race details: candidates, RCP average, 90% margin range, rating, win probability.
- Latest individual polls: New York Times/Siena plus other recent polls (`app/us/lib/polls.ts`). These are display-only and are not model inputs.
- House panel, methodology, assumptions, sources, and the editorial charter ([docs/EDITORIAL_CHARTER.md](docs/EDITORIAL_CHARTER.md)).
- The run ID in the header (`us-fc-<as-of date>-<input hash>`) reproduces the same numbers.

## Message analysis tab (`/us?tab=messages`, not a model input)

A descriptive context layer built from Donald Trump's Truth Social posts. It is kept separate from the forecast model and does not affect `seed-data.ts` or the run ID.

- **Data:** [`message_index_weekly.json`](https://sechan9999.github.io/trump-truth-analysis/message_index_weekly.json), produced weekly by `scripts/export_weekly.py` in [trump-truth-analysis](https://github.com/sechan9999/trump-truth-analysis).
  - `app/us/lib/seed-messages.ts` renders a checked-in snapshot (`app/us/lib/data/`) first, then swaps in the latest published file. In production the URL can be replaced with BigQuery or another endpoint.
  - Join key: the race-id prefix (`NC-SEN` → `NC`).
- **Screen** (`app/us/components/MessageTab.tsx`):
  - **Header strip:** post counts, data-as-of badge, link to the full analysis.
  - **Intervention index:** grouped bars of endorsement share and Democratic-candidate mention share, in amber and teal to keep messaging visually apart from the forecast's blue and red. Three KPIs: top state, surge (z > 2), mapping coverage. When fewer than 20 posts are mapped, an "Insufficient sample" badge replaces the numbers.
  - **Topic mix:** monthly stacked area chart with spike annotations.
  - **Message vs. public:** see below.
  - **Methodology notes,** including four limits.
- **Message vs. public:** one line chart for each of the 4 pairs in topic mapping v1:
  - Tariffs & trade ↔ economy + inflation
  - Crime & immigration ↔ immigration | crime (two separate lines)
  - Iran & war ↔ war and foreign-policy categories, summed
  - GOP & legislation ↔ government/poor leadership (approximate match)

  Each chart shows Trump's posting share (amber), Gallup's most important problem (teal) and YouGov's top issue (grey dashed). **Each series stays in its own native percentage, with no normalization**, and only the month of each peak is stated. Filled Gallup dots are that month's own release; hollow dots come from a trend column in a later release. Months with no data are left as gaps (never interpolated), and the month in progress is excluded from peaks. Sources and validation are documented in truth-analysis [`data/polls/README.md`](https://github.com/sechan9999/trump-truth-analysis/blob/main/data/polls/README.md).
- **Guardrails:**
  - Descriptive statements only; no causal or predictive sentences.
  - Never used as a forecast-model input.
  - Speculative readings are labeled "(inferred)".

## Model (`app/us/lib/forecast.ts`)

Each simulation draws one national error s ~ N(0, τ²) shared by every race, and scores each race as mᵢ + s + σᵢ·εᵢ. The published race probability uses the closed form Φ(mᵢ / √(σᵢ² + τ²)). Chamber majorities come from simulation, since the shared error means there is no closed form.

`npm run verify:model` (run on 2026-10-02):

| Check | Result |
|---|---|
| Monte Carlo (200k runs) vs closed form, margins −8 to +8 | max difference 0.0017 |
| Re-run with the same seed | identical results |
| Senate P(Democratic majority) | 57.8%, expected 50.75 seats, 80% range 47–54 |
| House P(Democratic majority) | 54.3%, expected 217.2 seats, 80% range 208–224 |
| Per-race simulation vs closed form | within 0.01 in all 12 states |

## Assumptions to replace before launch

- σᵢ = 4.0 pts for every race. Replace with values based on poll count and spread.
- τ = 3.5 pts. Calibrate against past-cycle polling error.
- House: all 22 toss-ups use a D+2.0 placeholder, with 203 safe Democratic seats (assuming 11 of the 22 toss-ups are Democratic-held). **The House distribution is capped at 225 seats (203 + 22).** About 8% of simulations pile up at 225, so until the toss-up list grows or district polls arrive, the House probability is affected by this cap. Replace with safe seats from public ratings such as Cook and the full list of competitive districts.
- Senate baseline: 53R–47D, so Democrats need 51 seats (the Vice President is Republican). 4 of the 12 battlegrounds (GA, MI, MN, NH) are Democratic-held, giving 43 safe Democratic seats.

## Data flow (production)

```
us_polls ──▶ us_poll_averages ──▶ (Vertex AI custom job: simulation) ──▶ us_forecast_runs
                                                                       ├─▶ us_race_forecasts
                                                                       └─▶ us_chamber_forecasts
Election day: results desk feed ──▶ us_results_live ──▶ tracker panel

trump-truth-analysis (weekly) ──▶ message_index_weekly.json ──▶ Message analysis tab
```

Table definitions: [bigquery/us_schema.sql](bigquery/us_schema.sql). Today the input is `app/us/lib/seed-data.ts`. Once the daily ingest starts, only that file needs to be replaced with values generated from BigQuery; the model and the screens stay the same.

## Run

```bash
npm install
npm run dev            # http://localhost:3000/us
npm run verify:model   # model checks
npm run build          # standalone build (used by the Dockerfile)
```

## Deploy to Cloud Run

The production service `us-election-insight-hub` is deployed from source:

```bash
gcloud run deploy us-election-insight-hub --source . --region us-central1 --project <your-gcp-project>
```

Image-based staging deploy:

```bash
export PROJECT=your-gcp-project REGION=us-central1
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT/us-hub/app:staging .
gcloud run deploy us-hub-staging \
  --image $REGION-docker.pkg.dev/$PROJECT/us-hub/app:staging \
  --region $REGION --allow-unauthenticated \
  --port 8080 --cpu 1 --memory 512Mi --min-instances 0 --max-instances 10
```

Set a budget alert before opening to public traffic (`gcloud billing budgets create ... --threshold-rule=percent=50/80/100`).

## Files

| Path | Contents |
|---|---|
| `app/us/page.tsx` | Board with the tab bar (client component) |
| `app/us/components/MessageTab.tsx` | Message analysis tab |
| `app/us/lib/forecast.ts` | Correlated-error simulation, closed form, seeded RNG |
| `app/us/lib/seed-data.ts` | Sample inputs (RCP 2026-10-01), baselines, assumptions |
| `app/us/lib/polls.ts` | Latest individual polls (display only; not part of the run ID) |
| `app/us/lib/seed-messages.ts` | Message-analysis types, snapshot loading, latest-file fetch |
| `app/us/lib/data/message_index_weekly.json` | Checked-in snapshot of the weekly message export |
| `app/us/lib/run.ts` | Run ID = as-of date + input hash |
| `app/us/lib/live.ts` | Election-night results feed (empty before Election Day) |
| `app/us/lib/i18n.ts` | Korean and English strings |
| `scripts/verify-model.ts` | Model check script |
| `bigquery/us_schema.sql` | BigQuery tables |
| `docs/EDITORIAL_CHARTER.md` | Editorial charter (Korean and English) |
| `Dockerfile` | Multi-stage build for Cloud Run |
