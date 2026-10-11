#!/usr/bin/env python3
"""Calibrate the national polling-error scale τ from historical Senate polls.

Method
------
For each past cycle, take Senate general-election polls fielded in the final
21 days, average them per race (mimicking the model's use of polling
averages), and compute the polling error per race:

    error_i = mean_poll_margin_i - actual_margin_i   (Democratic margin, pts)

The cycle's *national* error is the mean of error_i across that cycle's
Senate races. τ is the standard deviation of the national error across
cycles — i.e., how much the common polling miss varies from one cycle to
the next. This is exactly the s ~ N(0, τ²) term in forecast.ts.

Data
----
whyalwaysrose/midterms-forecast data/history/raw_polls.csv.gz
(20,466 polls, 1998–2023; columns include margin_poll / margin_actual).
Downloaded on the fly; no vendored copy.

Result (2026-10-11 run)
-----------------------
τ = 3.4  (population SD of cycle national error, 2010–2022 Senate cycles)
Alternative cuts: 3.0 (all 13 cycles), 3.7 (2010–2022 sample SD),
1.9 (midterms only, 6 cycles — too few points, not used).

Fat tails: kurtosis of the 13 cycle national errors is 2.45 (normal = 3.0),
i.e. no evidence for fat tails. The model keeps a normal national error.
Revisit if more cycles accumulate.
"""

import gzip
import csv
import statistics as st
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
        rows = list(csv.DictReader(f))

    sen = [r for r in rows
           if r["type_simple"] == "Sen-G"
           and r["time_to_election"] not in ("", None)
           and int(r["time_to_election"]) <= 21
           and r["margin_poll"] not in ("", None)]
    by_race: dict = defaultdict(list)
    actual: dict = {}
    for r in sen:
        k = (r["cycle"], r["race"])
        by_race[k].append(float(r["margin_poll"]))
        actual[k] = float(r["margin_actual"])

    cycles: dict = defaultdict(list)
    for k, polls in by_race.items():
        cycles[k[0]].append(sum(polls) / len(polls) - actual[k])

    nat = {c: sum(e) / len(e) for c, e in cycles.items() if len(e) >= 20}
    print(f"\n{'cycle':>6} {'races':>6} {'national err (pts)':>18}")
    for c in sorted(nat):
        print(f"{c:>6} {len(cycles[c]):>6} {nat[c]:>+18.2f}")

    allv = list(nat.values())
    modern = [v for c, v in nat.items() if int(c) >= 2010]
    mid = [v for c, v in nat.items() if int(c) % 4 == 2]
    print("\nτ estimates (SD of cycle national error):")
    print(f"  all {len(allv)} cycles : pop {st.pstdev(allv):.2f} / sample {st.stdev(allv):.2f}")
    print(f"  2010-2022 ({len(modern)} cycles): pop {st.pstdev(modern):.2f} / sample {st.stdev(modern):.2f}")
    print(f"  midterms only ({len(mid)} cycles): pop {st.pstdev(mid):.2f} / sample {st.stdev(mid):.2f}")
    mean = sum(allv) / len(allv)
    m2 = sum((v - mean) ** 2 for v in allv) / len(allv)
    m4 = sum((v - mean) ** 4 for v in allv) / len(allv)
    print(f"\nkurtosis of national errors: {m4 / m2**2:.2f} (normal = 3.0)")

if __name__ == "__main__":
    main()
