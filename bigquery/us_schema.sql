-- US Election Insights Hub — BigQuery tables (dataset electoral_hub, shared with the
-- Korean Electoral Insights Hub so both apps use the same run-versioning pattern).
-- Every row a screen shows can be traced to a run_id.

-- Daily poll ingest (one row per published poll)
CREATE TABLE IF NOT EXISTS electoral_hub.us_polls (
  poll_id      STRING NOT NULL,
  run_id       STRING NOT NULL,    -- ingest batch id
  race_type    STRING NOT NULL,    -- 'house_district' | 'senate'
  state_code   STRING,             -- e.g. 'NH'
  district     STRING,             -- e.g. 'NH-SEN' | 'CA-13'
  pollster     STRING,
  start_date   DATE,
  end_date     DATE,
  dem_pct      FLOAT64,
  rep_pct      FLOAT64,
  sample_n     INT64,
  moe          FLOAT64,
  source_url   STRING              -- every number carries a source
)
CLUSTER BY race_type, end_date;

-- Published polling averages actually fed to the model (e.g. RCP), per race and day
CREATE TABLE IF NOT EXISTS electoral_hub.us_poll_averages (
  as_of        DATE NOT NULL,
  race_id      STRING NOT NULL,    -- 'NH-SEN'
  dem_margin   FLOAT64 NOT NULL,   -- D minus R, points
  source       STRING NOT NULL,    -- 'RealClearPolitics'
  source_url   STRING
);

-- One row per forecast run (feeds the header run ID)
CREATE TABLE IF NOT EXISTS electoral_hub.us_forecast_runs (
  run_id        STRING NOT NULL,   -- 'us-fc-2026-10-01-6fc5a559' (date + input hash)
  created_at    TIMESTAMP NOT NULL,
  polls_as_of   DATE NOT NULL,
  input_hash    STRING NOT NULL,
  seed          INT64 NOT NULL,
  n_sims        INT64 NOT NULL,
  national_tau  FLOAT64 NOT NULL,
  model_version STRING
);

-- Per-race output (closed-form probability + 90% margin band)
CREATE TABLE IF NOT EXISTS electoral_hub.us_race_forecasts (
  run_id         STRING NOT NULL,
  race_id        STRING NOT NULL,
  race_type      STRING NOT NULL,
  dem_margin     FLOAT64,          -- m_i
  sigma_i        FLOAT64,
  national_tau   FLOAT64,
  dem_win_prob   FLOAT64,          -- Φ(m_i / sqrt(σ_i² + τ²))
  margin_lo      FLOAT64,          -- m_i − 1.645·sqrt(σ_i² + τ²)
  margin_hi      FLOAT64
)
CLUSTER BY run_id, race_type;

-- Chamber output (simulated; correlation has no closed form)
CREATE TABLE IF NOT EXISTS electoral_hub.us_chamber_forecasts (
  run_id            STRING NOT NULL,
  chamber           STRING NOT NULL,  -- 'senate' | 'house'
  needed            INT64 NOT NULL,
  safe_dem_seats    INT64 NOT NULL,
  dem_control_prob  FLOAT64,
  expected_dem      FLOAT64,
  dem_seats_p10     INT64,
  dem_seats_p50     INT64,
  dem_seats_p90     INT64,
  histogram_json    STRING            -- [{seats, prob}, ...]
);

-- Election night (empty until counting starts; nothing is shown before polls close)
CREATE TABLE IF NOT EXISTS electoral_hub.us_results_live (
  race_id       STRING NOT NULL,
  pct_reporting FLOAT64,
  dem_votes     INT64,
  rep_votes     INT64,
  called        STRING,               -- 'D' | 'R' | NULL
  called_by     STRING,               -- e.g. 'AP'
  updated_at    TIMESTAMP NOT NULL
);
