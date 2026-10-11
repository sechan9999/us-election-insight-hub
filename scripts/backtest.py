#!/usr/bin/env python3
"""Backtest: race-level calibration of the forecast model on historical data.

Method
------
For each Senate race (2010–2022) with final-21-day polls:
  m_i     = mean poll margin (Democratic pts)
  n_i     = number of polls
  σ_i     = √(4.1² + 5.45²/n_i)          (roadmap #4)
  P_i     = Φ(m_i / √(σ_i² + 3.1² + 1.2²))  (roadmap #3/#5)
  actual  = 1 if Dem won else 0

Calibration: bin races by predicted P_i, compare mean predicted vs actual
win rate per bin. A well-calibrated model has actual ≈ predicted in each bin.
Also reports Brier score and log loss.

NOTE: in-sample — the model parameters were calibrated on 2010–2022.
This checks fit, not out-of-sample skill. Leave-one-cycle-out is future work.

Data: whyalwaysrose/midterms-forecast data/history/raw_polls.csv.gz
(20,466 polls). Downloaded on the fly; no vendored copy.
"""

import gzip
import math
import urllib.request
from collections import defaultdict

URL = ("https://raw.githubusercontent.com/whyalwaysrose/midterms-forecast/HEAD"
       "/data/history/raw_polls.csv.gz")

TAU_NAT, TAU_REG = 3.1, 1.2
SIGMA_SYS, SIGMA_POLL = 4.1, 5.45


def ncdf(x: float) -> float:
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def main() -> None:
    print("downloading", URL)
    with urllib.request.urlopen(URL, timeout=120) as r:
        raw = r.read()
    print(f"downloaded {len(raw)/1e6:.1f} MB")
    with gzip.open(__import__("io").BytesIO(raw), "rt") as f:
        import csv
        rows = list(csv.DictReader(f))

    sen = [r for r in rows
           if r["type_simple"] == "Sen-G"
           and r["time_to_election"] not in ("", None)
           and int(r["time_to_election"]) <= 21
           and r["margin_poll"] not in ("", None)
           and int(r["cycle"]) >= 2010]
    by_race: dict = defaultdict(list)
    actual_margin: dict = {}
    actual_win: dict = {}
    for r in sen:
        k = (r["cycle"], r["race"])
        by_race[k].append(float(r["margin_poll"]))
        actual_margin[k] = float(r["margin_actual"])
        actual_win[k] = 1.0 if float(r["margin_actual"]) > 0 else 0.0

    preds, outcomes = [], []
    for k, polls in by_race.items():
        m = sum(polls) / len(polls)
        n = len(polls)
        sigma = math.sqrt(SIGMA_SYS**2 + SIGMA_POLL**2 / n)
        p = ncdf(m / math.sqrt(sigma**2 + TAU_NAT**2 + TAU_REG**2))
        preds.append(p)
        outcomes.append(actual_win[k])

    n = len(preds)
    brier = sum((p - o) ** 2 for p, o in zip(preds, outcomes)) / n
    logloss = -sum(o * math.log(max(p, 1e-9)) + (1 - o) * math.log(max(1 - p, 1e-9))
                   for p, o in zip(preds, outcomes)) / n
    # Baseline: always predict the base rate
    base = sum(outcomes) / n
    brier_base = sum((base - o) ** 2 for o in outcomes) / n
    print(f"\nraces: {n}, Dem win rate: {base:.1%}")
    print(f"Brier: {brier:.4f} (base rate: {brier_base:.4f})")
    print(f"Log loss: {logloss:.4f}")

    # Standardized residuals: z = (m - actual_margin)/total_sd should be ~N(0,1)
    zs = []
    for k, polls in by_race.items():
        m = sum(polls) / len(polls)
        nn = len(polls)
        sigma = math.sqrt(SIGMA_SYS**2 + SIGMA_POLL**2 / nn)
        tot = math.sqrt(sigma**2 + TAU_NAT**2 + TAU_REG**2)
        zs.append((m - actual_margin[k]) / tot)
    import statistics as st
    print(f"\nstandardized residuals: mean={st.mean(zs):+.3f} (bias), "
          f"sd={st.pstdev(zs):.3f} (should be ~1.0)")
    print(f"|z|>2: {sum(1 for z in zs if abs(z) > 2)/len(zs):.1%} (normal 4.6%), "
          f"|z|>1: {sum(1 for z in zs if abs(z) > 1)/len(zs):.1%} (normal 31.7%)")
    if abs(st.mean(zs)) > 0.15:
        print("NOTE: mean |bias| > 0.15 SD — polls systematically misestimate one side; "
              "consider a bias correction (research question, not auto-applied).")

    print(f"\n{'bin':>12} {'n':>5} {'pred':>7} {'actual':>7} {'diff':>7}")
    for lo in [0.5, 0.6, 0.7, 0.8, 0.9]:
        hi = lo + 0.1
        idx = [i for i, p in enumerate(preds) if lo <= p < hi or (hi == 1.0 and p == 1.0)]
        # mirror for p < 0.5
        idx += [i for i, p in enumerate(preds) if 1 - hi < p <= 1 - lo]
        if not idx:
            continue
        # fold: use max(p, 1-p) as confidence
        conf = sum(max(preds[i], 1 - preds[i]) for i in idx) / len(idx)
        # actual: fraction where the FAVORED side won
        fav_won = sum(1 for i in idx
                      if (preds[i] >= 0.5 and outcomes[i] == 1) or
                         (preds[i] < 0.5 and outcomes[i] == 0)) / len(idx)
        print(f"{lo:.0%}-{hi:.0%}fav {len(idx):>5} {conf:>7.1%} {fav_won:>7.1%} {fav_won-conf:>+7.1%}")


if __name__ == "__main__":
    main()
