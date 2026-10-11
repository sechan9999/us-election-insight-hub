#!/usr/bin/env python3
"""Calibrate the race-level error model σ_i = √(σ_sys² + σ_poll²/n_i).

Method
------
For each past Senate race (2010–2022, final-21-day polls), compute the error
of the race's poll average vs the actual result, then subtract that cycle's
national error (so only race-specific error remains). Regress the squared
residual on 1/n_polls:

    E[resid²] = σ_sys² + σ_poll² / n

The intercept estimates the systematic race error (house effects, late
movement — does not shrink with more polls); the slope estimates the
idiosyncratic per-poll error.

Data: whyalwaysrose/midterms-forecast data/history/raw_polls.csv.gz
(20,466 polls, 1998–2023). Downloaded on the fly; no vendored copy.

Result (2026-10-11 run)
-----------------------
E[e²] = 17.97 + 29.69/n  →  σ_sys = 4.24, σ_poll = 5.45
Binned validation (rms residual vs model):
  n=1–2 → 6.85 (model 6.91); n=3–4 → 4.59 (5.04);
  n=5–7 → 4.55 (4.79);      n=8+   → 4.42 (4.66)
"""

import gzip
import math
import urllib.request
from collections import defaultdict

URL = ("https://raw.githubusercontent.com/whyalwaysrose/midterms-forecast/HEAD"
       "/data/history/raw_polls.csv.gz")

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
    actual: dict = {}
    for r in sen:
        k = (r["cycle"], r["race"])
        by_race[k].append(float(r["margin_poll"]))
        actual[k] = float(r["margin_actual"])

    cyc: dict = defaultdict(list)
    for k, polls in by_race.items():
        cyc[k[0]].append(sum(polls) / len(polls) - actual[k])
    nat = {c: sum(e) / len(e) for c, e in cyc.items()}

    data = []
    for k, polls in by_race.items():
        resid = (sum(polls) / len(polls) - actual[k]) - nat[k[0]]
        data.append((len(polls), resid))

    xs = [1 / n for n, _ in data]
    ys = [e * e for _, e in data]
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    slope = sxy / sxx
    intercept = my - slope * mx
    print(f"\nraces: {n}")
    print(f"E[e^2] = {intercept:.2f} + {slope:.2f}/n_polls")
    print(f"σ_sys = {math.sqrt(max(intercept, 0)):.2f}, "
          f"σ_poll = {math.sqrt(max(slope, 0)):.2f}")
    print("\nbinned validation:")
    for lo, hi in [(1, 2), (3, 4), (5, 7), (8, 50)]:
        b = [e for nn, e in data if lo <= nn <= hi]
        if not b:
            continue
        rms = math.sqrt(sum(x * x for x in b) / len(b))
        mid = (lo + hi) / 2
        model = math.sqrt(max(intercept, 0) + max(slope, 0) / mid)
        print(f"  n={lo:>2}-{hi:<2}: races={len(b):>3}  rms={rms:.2f}  model@{mid:.0f}={model:.2f}")

if __name__ == "__main__":
    main()
