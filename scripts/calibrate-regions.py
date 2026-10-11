#!/usr/bin/env python3
"""Decompose polling error into national + Census-region components.

Method
------
For each cycle (2010–2022 Senate, final-21-day polls), compute each race's
poll-average error, then the cycle mean (national error) and the mean error
within each Census region (NE/MW/S/W). The regional deviation is
    d_{c,r} = regional_mean_{c,r} - national_mean_c.
Variance decomposition:
    Var(d)      = τ_reg² + σ_u² / n̄_reg     (observed regional deviations)
    σ_sys²(#4)  = τ_reg² + σ_u²              (race systematic var incl. region)
    τ²(#3)      = τ_nat² + τ_reg²            (total common var)
Solving gives τ_reg, then τ_nat and the region-free σ_sys.

Data: whyalwaysrose/midterms-forecast data/history/raw_polls.csv.gz
(20,466 polls). Downloaded on the fly; no vendored copy.

Result (2026-10-11 run)
-----------------------
τ_reg² = 1.35 → τ_reg = 1.2;  τ_nat² = 9.54 → τ_nat = 3.1;
σ_sys: 4.24 → 4.1 (regional component removed).
"""

import gzip
import math
import urllib.request
from collections import defaultdict

URL = ("https://raw.githubusercontent.com/whyalwaysrose/midterms-forecast/HEAD"
       "/data/history/raw_polls.csv.gz")

REGION = {
    "CT": "NE", "ME": "NE", "MA": "NE", "NH": "NE", "RI": "NE", "VT": "NE",
    "NJ": "NE", "NY": "NE", "PA": "NE",
    "IL": "MW", "IN": "MW", "MI": "MW", "OH": "MW", "WI": "MW", "IA": "MW",
    "KS": "MW", "MN": "MW", "MO": "MW", "NE": "MW", "ND": "MW", "SD": "MW",
    "DE": "S", "FL": "S", "GA": "S", "MD": "S", "NC": "S", "SC": "S",
    "VA": "S", "WV": "S", "AL": "S", "KY": "S", "MS": "S", "TN": "S",
    "AR": "S", "LA": "S", "OK": "S", "TX": "S",
    "AZ": "W", "CO": "W", "ID": "W", "MT": "W", "NV": "W", "NM": "W",
    "UT": "W", "WY": "W", "AK": "W", "CA": "W", "HI": "W", "OR": "W",
    "WA": "W",
}

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
           and int(r["cycle"]) >= 2010
           and r["location"] in REGION]
    by_race: dict = defaultdict(list)
    actual: dict = {}
    loc: dict = {}
    for r in sen:
        k = (r["cycle"], r["race"])
        by_race[k].append(float(r["margin_poll"]))
        actual[k] = float(r["margin_actual"])
        loc[k] = r["location"]
    race_err = {k: sum(p) / len(p) - actual[k] for k, p in by_race.items()}

    print(f"\n{'cycle':>6} {'nat':>7}  regional means (deviation from national)")
    reg_devs = []
    n_reg_total = 0
    for cyc in sorted(set(k[0] for k in by_race)):
        rk = [k for k in by_race if k[0] == cyc]
        n_mean = sum(race_err[k] for k in rk) / len(rk)
        regs: dict = defaultdict(list)
        for k in rk:
            regs[REGION[loc[k]]].append(race_err[k])
        rmeans = {rg: sum(v) / len(v) for rg, v in regs.items()}
        n_reg_total += sum(len(v) for v in regs.values())
        for rg, m in rmeans.items():
            reg_devs.append(m - n_mean)
        detail = " ".join(f"{rg}={m:+.1f}" for rg, m in sorted(rmeans.items()))
        print(f"{cyc:>6} {n_mean:+7.2f}  {detail}")

    var_reg_obs = sum(d * d for d in reg_devs) / len(reg_devs)
    n_bar = n_reg_total / len(reg_devs)
    # Solve: var_reg_obs = t2_reg + s2_u/n_bar ; 18.0 (#4 intercept) = t2_reg + s2_u
    t2_reg = (var_reg_obs - 18.0 / n_bar) / (1 - 1 / n_bar)
    s2_u = 18.0 - t2_reg
    t2_nat = 10.89 - t2_reg  # #3 total common var (tau=3.3)
    print(f"\nVar(regional deviations): {var_reg_obs:.2f}  (n={len(reg_devs)}, "
          f"avg races/region={n_bar:.1f})")
    print(f"τ_reg² = {t2_reg:.2f} → τ_reg = {math.sqrt(t2_reg):.2f}")
    print(f"τ_nat² = {t2_nat:.2f} → τ_nat = {math.sqrt(t2_nat):.2f}")
    print(f"σ_sys² = {s2_u:.2f} → σ_sys = {math.sqrt(s2_u):.2f}")

if __name__ == "__main__":
    main()
