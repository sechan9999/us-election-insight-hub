# Poll inclusion ledger (US Election Insights Hub forecast)

Durable record of which candidate polls entered the forecast model and which
did not, with one reason per exclusion. Read this file BEFORE collecting new
polls for the next refresh; carry prior decisions forward unchanged unless a
new poll overlaps them or a stated rule changes. `polls.ts` is display-only
and never a model input.

Standing model settings affecting inclusion: POLL_BIAS_ADJUST = 0 (HK
decision 2026-10-11); seed 20261103; 40,000 simulations; only poll INPUTS
change between refreshes. Inclusion window rule: a poll qualifies when it was
released after the current DATA_AS_OF and is not inside the Oct 21, 2026 RCP
compilation window (to avoid double-counting the RCP consensus pseudo-poll).

Standing inclusion principle (HK, 2026-10-28): include EVERY poll unless it
comes from a firm that deliberately manipulates public opinion; when a poll
has a sponsor, disclose the sponsor. Partisan lean alone is not a reason to
exclude. This principle supersedes the Oct 26, 2026 reversal decision (see
the superseded rows below).

## Carried exclusions (decided earlier, still in force)

The six Oct 22–23 rows below are SUPERSEDED: they were INCLUDED on
2026-10-28 under the standing inclusion principle above. They are kept here
so the decision history stays readable.

| Poll | Race | Figures | Decision date | Reason |
|---|---|---|---|---|
| InsiderAdvantage (Oct 22–23) | OH-SEN | Brown 47 / Husted 44 | 2026-10-26 (HK reversal) | HK decision: the Oct 28, 2026 run uses newly released polls only; this poll's content overlaps the same races. |
| InsiderAdvantage (Oct 22–23) | MI-SEN | El-Sayed 47 / Rogers 46 | 2026-10-26 (HK reversal) | Same HK decision as above. |
| InsiderAdvantage (Oct 22–23) | IA-SEN | Turek 45 / Hinson 47 | 2026-10-26 (HK reversal) | Same HK decision as above. |
| InsiderAdvantage (Oct 22–23) | KS-SEN | Hamilton 47 / Marshall 48 | 2026-10-26 (HK reversal) | Same HK decision as above. |
| RedBox Research (completed Oct 23) | MI-SEN | El-Sayed 49 / Rogers 44, n=2,696 | 2026-10-26 (HK reversal) | Same HK decision as above. |
| Verasight (Oct 23) | TX-SEN | Talarico 48 / Paxton 45, n=601 | 2026-10-26 (HK reversal) | Same HK decision as above. |
| ActiVote (Oct 21) | TX-SEN | — | Oct 23 refresh | Low-quality / timing-ambiguous release (recorded in seed-data.ts header). Applies to that poll only, not to ActiVote generally. |
| Pollfinity (Oct 22) | TX-SEN | — | Oct 23 refresh | Low-quality / timing-ambiguous release (recorded in seed-data.ts header). |

Note on the reversal: on 2026-10-26 HK first decided to include the six
Oct 22–23 polls at the Oct 28 refresh, then reversed the decision the same
day. On 2026-10-28 HK replaced the reversal with the standing inclusion
principle above, and the six were included the same day (see the amendment
section below). The reversal no longer governs any refresh.

## Refresh 2026-10-28 (amendment) — six Oct 22–23 polls included

Decision date 2026-10-28 (HK): the six are included under the standing
inclusion principle — none of the three firms is a deliberate-manipulation
firm, and partisan lean alone does not exclude. No separate sponsor exists
for these six beyond the firm name itself. Result vs the published Oct 28
run: Senate 56.3% → 55.9% (−0.4pp), expected seats 50.57 → 50.55, band
47–54 unchanged, House unchanged.

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| InsiderAdvantage | OH-SEN | Oct 21–22 | 1,200 LV | +3 (Brown 47 / Husted 44) | 270toWin OH page |
| InsiderAdvantage | MI-SEN | Oct 21–22 | 1,200 LV | +1 (El-Sayed 47 / Rogers 46) | 270toWin MI page |
| InsiderAdvantage | IA-SEN | Oct 21–22 | 1,200 LV | −2 (Turek 45 / Hinson 47) | 270toWin IA page |
| InsiderAdvantage | KS-SEN | ended Oct 22 | 1,200 LV | −1 (Hamilton 47 / Marshall 48) | PollingSource KS |
| RedBox Research | MI-SEN | ended Oct 23 | 2,696 LV | +5 (El-Sayed 49 / Rogers 44) | PollingSource |
| Verasight | TX-SEN | ended Oct 23 | 601 LV | +3 (Talarico 48 / Paxton 45) | 270toWin TX page |

## Refresh 2026-10-28 — included (12 polls, 8 races)

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| Echelon Insights / NetChoice | GA-SEN | Oct 16–23 | 508 LV | +15 (Ossoff 55 / Collins 40) | netchoice.org release, Oct 27 |
| Suffolk / USA TODAY Ohio Network | OH-SEN | unverified; fieldEnd = release date (proxy) | 500 LV | +3 (Brown 47 / Husted 44) | Columbus Dispatch, Oct 28; 270toWin OH page |
| Echelon Insights / NetChoice | OH-SEN | Oct 16–23 | 508 LV | 0 (47 / 47) | netchoice.org release, Oct 27 |
| Glengariff / Detroit News-WDIV | MI-SEN | Oct 19–22 | 600 LV | +6.3 (51.4 / 45.1) | USA Today, Oct 27; 270toWin MI page |
| N+ Univision / YouGov | TX-SEN | Oct 13–21 | 1,000 RV | +5 (Talarico 50 / Paxton 45) | TelevisaUnivision press release, Oct 27 |
| NYT / Siena College | MN-SEN | unverified; fieldEnd = release date (proxy) | 752 LV | +14 (Flanagan 54 / Tafoya 40) | Siena release page, Oct 28 |
| Echelon Insights / NetChoice | IA-SEN | Oct 16–23 | 403 LV | +2 (Turek 45 / Hinson 43) | netchoice.org release, Oct 27 |
| Marist Poll | ME-SEN | ended Oct 25 | 1,449 LV | +2 (Jackson 49 / Collins 47) | 270toWin ME page; Call the Map |
| Echelon Insights / NetChoice | ME-SEN | Oct 16–23 | 413 LV | +7 (Jackson 51 / Collins 44) | netchoice.org release, Oct 27 |
| NYT / Siena College | FL-SEN | unverified; fieldEnd = release date (proxy) | 813 LV | −6 (Nixon 44 / Moody 50) | Siena release page, Oct 28 |
| ActiVote | FL-SEN | Oct 17–27 | 400 | −6 (Nixon 47.0 / Moody 53.0) | activote.net poll page, Oct 27 |
| Echelon Insights / NetChoice | FL-SEN | Oct 16–23 | 515 LV | −8 (Nixon 43 / Moody 51) | netchoice.org release, Oct 27 |

Adjudication notes for this refresh (decision date 2026-10-28):
- Dating: Glengariff MI, Univision TX, and Marist ME are dated Oct 27 per
  their primary/press sources; RCP groups them Oct 26. Primary-source date
  governs, so all three qualify as Oct 27 releases.
- Field-date proxies: Suffolk OH and NYT/Siena MN/FL field dates could not
  be verified (NYT topline PDFs are unreachable from this environment).
  fieldEnd is set to the Oct 28 release date and labeled as a proxy in the
  code. With a 21-day half-life, a 2–3 day dating error moves a race margin
  by well under 0.1 points.
- Sponsorship: the five Echelon/NetChoice polls share one sponsor (tech
  trade association NetChoice) and one methodology (online/text-to-web from
  the L2 voter file). No standing rule excludes sponsored or leaning
  pollsters, and the model already weights by sample size, so all five are
  included with the sponsorship noted here and in the refresh report.
- Marist ME margin of error (±6.6% as reported by two aggregators) is
  unusually large for n=1,449 and is unverified against Marist's own
  release. MoE is not a model input, so this does not change inclusion.
- ActiVote FL is a different poll from the excluded ActiVote TX Oct 21
  poll; the TX exclusion does not extend to it. Its page is internally
  inconsistent on population (body: likely voters; metadata: registered
  voters); population type is not a model input.
- Races with no qualifying Oct 27–28 poll: NC, NH, AK, KS.
- House: the RCP generic-ballot average value could not be re-verified on
  Oct 28 (the RCP page text fetch exposes dates only, latest 10/25–10/26).
  The House input is therefore UNCHANGED at Dem +8.3 (last verified value),
  and +8.3 must not be presented as an Oct 28 reading. A new national
  datapoint exists (Echelon/NetChoice generic ballot, Dem +5, single poll,
  released Oct 27) but a single poll does not replace the RCP average.

## Catch-up decision for Friday 2026-10-30 refresh (HK decision 2026-10-29)

MSU State of the State Survey / YouGov, MI-SEN: INCLUDE as a catch-up item
in the Friday Oct 30, 2026 refresh, even though its field dates (Oct 2–19)
and release date (Oct 26) predate the current DATA_AS_OF (2026-10-28).
Without this flag the normal "released after DATA_AS_OF" window rule would
skip it a second time. This exception applies to this one poll only and
does not change the window rule for other polls.

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| MSU State of the State Survey / YouGov | MI-SEN | Oct 2–19 | 836 LV | +3.5 (El-Sayed 47.7 / Rogers 44.2) | Detroit Free Press, Oct 26; 270toWin MI page |

Notes:
- Margin uses the detailed split (47.7/44.2), consistent with the
  Glengariff MI precedent (detailed 51.4/45.1 → margin 6.3). The rounded
  topline (48/46, margin +2) is NOT the model input.
- Sample-size conflict: one aggregator lists 863 LV; the Free Press /
  270toWin pair gives 836 LV, which is the recorded value. The 27-person
  difference is immaterial to the aggregation.
- fieldEnd = 2026-10-19 (end of field period, not the Oct 26 release
  date), per the model's recency-weighting convention.
- Sponsor: Michigan State University (university survey, no separate
  sponsor disclosed). No deliberate-manipulation concern; included under
  the standing inclusion principle (HK, 2026-10-28).
- After the Friday Oct 30 run includes this poll, remove the one-time
  catch-up paragraph from the refresh cron body.

## Refresh 2026-10-30 — included (9 polls, 6 races)

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| CNN / SSRS | MI-SEN | Oct 20–27 | 768 LV | +7 (El-Sayed 49 / Rogers 42) | CNN, Oct 29 |
| CNN / SSRS | TX-SEN | Oct 20–27 | 923 LV | +6 (Talarico 49 / Paxton 43) | CNN, Oct 29 |
| CNN / SSRS | ME-SEN | Oct 20–26 | 783 LV | +4 (Jackson 49 / Collins 45) | CNN, Oct 29 |
| CNN / SSRS | KS-SEN | Oct 20–26 | 838 LV | +4 (Hamilton 49 / Marshall 45) | CNN, Oct 29 |
| MSU State of the State Survey / YouGov | MI-SEN | Oct 2–19 | 836 LV | +3.5 (El-Sayed 47.7 / Rogers 44.2) | Detroit Free Press, Oct 26; HK catch-up decision Oct 29 |
| CBS Detroit / Mitchell Research | MI-SEN | Oct 26–27 | 636 LV | +7 (El-Sayed 51 / Rogers 44) | Political Wire, Oct 28 6:44pm ET; CBS Detroit report |
| Texas Southern University / YouGov | TX-SEN | Oct 21–25 | 2,000 LV | +2 (Talarico 49 / Paxton 47) | USA Today, Oct 29 (released Oct 29) |
| UMass Lowell / YouGov | NH-SEN | Oct 2–19 | 600 LV | +7 (Pappas 48 / Sununu 41) | UMass Lowell release, Oct 28; 270toWin NH page |
| co/efficient | IA-SEN | Oct 28 | 1,020 LV | −2 (Turek 46 / Hinson 48) | co/efficient battlegrounds page (fielded Oct 28) |

Adjudication notes for this refresh (2026-10-30):
- Timing boundary: the Oct 28 refresh ran at 08:00 EDT Oct 28. CBS/Mitchell
  MI (Oct 28 evening), UMass Lowell NH (Oct 28 release), and co/efficient
  IA (fielded Oct 28) all postdate that run's data collection, so they
  qualify as new for this run even though their dates equal DATA_AS_OF's
  predecessor date. RCP groups the CNN polls under Oct 28, but CNN's own
  article is dated Oct 29, which governs (primary-source-date rule, as in
  the Oct 28 adjudication). TSU TX is likewise dated Oct 29 by USA Today.
- Sponsorship: co/efficient IA is flagged R-sponsored by PollingSource.
  Under the standing inclusion principle, sponsorship is disclosed, not
  a reason to exclude; no deliberate-manipulation concern was found.
- NOT added (boundary, for HK decision): pre-Oct-28 releases the Oct 28
  run had the opportunity to include but did not — e.g. St. Pete Polls FL
  (Oct 27), High Point NC (Oct 27), Rasmussen NH (Oct 25). Re-adjudicating
  those is not this run's scope; only the HK-flagged MSU catch-up was
  pulled back across the window. If HK wants them, they enter at a later
  refresh with their own ledger row.
- House: generic-ballot input UNCHANGED at Dem +8.3 (last verified value);
  no new RCP generic-ballot average was adopted, and single-poll national
  values do not replace the average (Oct 28 precedent).
- Result vs the Oct 28 run: Senate 55.9% → 58.1% (+2.2pp), expected seats
  50.55 → 50.68, band 47–54 unchanged, House unchanged (97.1%).
