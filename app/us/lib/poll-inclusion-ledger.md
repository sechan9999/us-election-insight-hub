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

## Catch-up decision for Monday 2026-11-02 refresh (HK decision 2026-10-30)

Three pre-Oct-28 releases the Oct 28 run had the opportunity to include but
did not: INCLUDE all three as catch-up items in the Monday Nov 2, 2026
refresh, even though their release dates predate the current DATA_AS_OF
(2026-10-30) and the normal "released after DATA_AS_OF" window rule would
skip them. This exception applies to these three polls only.

| Poll | Race | Release | Notes |
|---|---|---|---|
| St. Pete Polls | FL-SEN | Oct 27 | Topline, field dates, n to be verified from the primary source at the Monday run and recorded in that refresh's section. |
| High Point University | NC-SEN | Oct 27 | Same — verify from the primary source at the Monday run. |
| Rasmussen Reports | NH-SEN | Oct 25 | Same — verify from the primary source at the Monday run. |

Notes:
- Each poll gets its own ledger row in the Monday refresh section with
  verified figures; no figure is recorded here in advance because none was
  verified before this decision.
- Sponsor disclosure follows the standing inclusion principle (HK,
  2026-10-28): lean alone never excludes; only deliberate manipulation
  would.
- After the Monday Nov 2 run includes these polls, remove the one-time
  catch-up paragraph from the refresh cron body.
- EXECUTED EARLY: this catch-up executed on Oct 31, moved up from Nov 2 per
  HK decision Oct 31 (see the Refresh 2026-10-31 section below). The
  one-time catch-up paragraph should now be removed from the refresh cron
  body.

## Refresh 2026-10-31 — included (13 polls, 8 races)

Catch-ups (HK decision Oct 31, moved up from the Nov 2 refresh):

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| St. Pete Polls / Florida Politics | FL-SEN | Oct 26–28 (PollingSource dates Oct 27; released Oct 28) | 916 LV | −4 (Nixon 45 / Moody 49) | PollingSource FL page; On Point FL page (44.7/49 unrounded); Florida Politics via Florida Press rewrite |
| High Point University / YouGov | NC-SEN | Oct 1–20 | 620 LV | +14 (Cooper 54 / Whatley 40) | highpoint.edu primary release (published Oct 28) |
| Rasmussen Reports | NH-SEN | Oct 20–23 | 970 LV | +6 (Pappas 50 / Sununu 44) | RealClearPolling NH page; PollingSource NH page |

New Oct 30 releases (after the Oct 30 morning run):

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| Data for Progress | ME-SEN | Oct 23–27 | 652 LV | +5 (Jackson 50 / Collins 45) | dataforprogress.org blog + ME tabs PDF |
| Data for Progress | MI-SEN | Oct 23–25 | 622 LV | +4 (El-Sayed 50 / Rogers 46) | DFP blog + MI tabs PDF |
| Data for Progress | TX-SEN | Oct 23–26 | 712 LV | +4 (Talarico 49 / Paxton 45) | DFP blog + TX tabs PDF |
| Quantus Insights | TX-SEN | Oct 26–28 | 1,221 LV | −1.1 (Talarico 47.6 / Paxton 48.7, initial ballot) | 270toWin TX page; texpolls.com |
| Big Data Poll | FL-SEN | unverified; fieldEnd = release date (proxy) | 1,129 LV | −8.5 (Nixon 44.1 / Moody 52.6 detailed; PollingSource rounds 45/52) | PollingSource FL page; On Point FL page |
| InsiderAdvantage | FL-SEN | ended Oct 29 | 1,200 LV | −6 (Nixon 43 / Moody 49) | PollingSource FL page; PoliAgg daily Oct 31 (release Oct 30) |
| Washington Post / Schar School | KS-SEN | Oct 22–26 | 801 LV | +9 (Hamilton 52 / Marshall 43) | USA Today, Oct 30; Political Wire, Oct 30 |
| Emerson College Polling | KS-SEN | Oct 26–28 | 800 LV | +4 (Hamilton 49 / Marshall 45) | emersoncollegepolling.com primary release, Oct 30 |
| KSTP / SurveyUSA | MN-SEN | Oct 24–28 | 714 LV | +7 (Flanagan 48 / Tafoya 41) | RealClearPolling MN page; PollingSource MN page; Political Wire, Oct 30 |
| Alaska Survey Research | AK-SEN | Oct 26–29 | 1,326 LV | +2 (final round 51/49; first choice 48/46) | RealClearPolling AK page; PollingSource AK page; Political Wire, Oct 30 |

House: generic-ballot input updated 8.3 → 8.2 (RCP average, Oct 30, 2026:
51.4/43.2, reported by NorthJersey Oct 30, Zark News and Fyrim Oct 31);
all 435 district margins in house-districts.ts shifted −0.1 accordingly.

Adjudication notes for this refresh (2026-10-31):
- Dating: the HPU NC primary release is dated Oct 28 (18:58 UTC), not
  Oct 27 as the decision memo said; it postdates the Oct 28 08:00 run, so
  it was missed by both the Oct 28 and Oct 30 runs. The HK catch-up
  decision names the poll, so inclusion stands. Rasmussen NH release
  dating is ambiguous (RCP groups 10/23; decision memo said Oct 25);
  fieldEnd = Oct 23 (end of field) per the model's convention.
- St. Pete FL dating: PollingSource dates Oct 27, NJ Globe reports field
  Oct 26–28, Florida Politics released Wednesday Oct 28. fieldEnd =
  Oct 27 (PollingSource date); a 1-day difference is immaterial at a
  21-day half-life.
- Big Data Poll FL field dates are unverified; fieldEnd = Oct 30 release
  date as a labeled proxy (Oct 28 precedent).
- Detailed vs rounded splits: Quantus TX uses the initial ballot
  (48.7/47.6 → −1.1), not leaners (49.4/48.4); Big Data FL uses the
  detailed 44.1/52.6 → −8.5 (PollingSource rounds to 45/52 → −7); AK uses
  +2, which is the same for the final-round (51/49) and first-choice
  (48/46) cuts. Emerson KS uses the initial ballot (49/45), not leaners
  (50/47).
- Sponsorship/disclosure: Quantus TX — no sponsor named for this survey
  (texpolls); the firm sells campaign consulting and the NRSC paid it
  $15,000 for other work. ASR AK — flagged D-sponsored by PollingSource;
  its director has publicly opposed Sullivan (Juneau Independent).
  WaPo/Schar KS — the Post/GMU themselves flagged differential
  nonresponse (Democratic completion 32% vs Republican 12%) as a possible
  Democratic overstatement. Under the standing inclusion principle all
  are included with disclosure; none is a deliberate-manipulation
  finding.
- NOT added (for HK decision at the Nov 2 run): ActiVote TX (Oct 29:
  Talarico 52.1 / Paxton 47.9, +4.2, n=400, field Oct 22–28; activote.net
  primary), A2 Insights TX (Oct 29: Talarico 50 / Paxton 47, +3, n=631;
  270toWin TX page), UNF FL (made public Oct 21: Moody 49 / Nixon 45,
  −4, n=1,471, field Oct 12–19; Miramar News / CNN), Palafox /
  Political Matrix FL (field Oct 26–28, n=500, Moody 41.8 / Nixon 35.8,
  22.4% undecided; release date unverifiable from the firm's own page;
  unrated first-appearance firm, not listed by PollingSource/270toWin).
  All four were available to the Oct 30 run or predate the window; per
  the Oct 30 precedent, re-adjudicating them is HK's decision, not this
  run's. Also noted for the Nov 2 sweep: RedBox Research KS (Marshall
  +1, field ~Oct 20–23, per ElectionTracker) — release date unverified.
- No new polls were found for GA, OH, IA in this sweep; the Marist IA
  50/42 figure circulating Oct 30 is the September poll (Sept 17–20,
  RV), inside the RCP window, not new.
- polls.ts (display-only) was not updated, consistent with the Oct 28
  and Oct 30 runs.
- Result vs the Oct 30 run: Senate 58.1% → 60.3% (+2.2pp), expected
  seats 50.68 → 50.81, band 47–54 unchanged; House 97.1% → 96.9%
  (−0.2pp), expected seats 241.04 → 240.64, band 224–259 → 224–258.

## Include all pending polls in the Nov 1 refresh (HK decision 2026-10-31)

The five polls listed as "NOT added" in the Oct 31 adjudication notes
above are INCLUDED in the Sunday Nov 1, 2026 refresh (moved up from the
Nov 2 sweep by HK decision Oct 31), even though their release/field
dates predate DATA_AS_OF (2026-10-31) and the normal "released after
DATA_AS_OF" window rule would skip them. Each gets its own ledger row
in the Nov 1 refresh section with figures re-verified from the primary
source at that run; the figures below are the Oct 31 sweep's notes,
not pre-recorded model inputs.

| Poll | Race | Notes from the Oct 31 sweep |
|---|---|---|
| ActiVote | TX-SEN | Oct 29; Talarico 52.1 / Paxton 47.9 (+4.2), n=400, field Oct 22–28; activote.net primary. A different poll from the excluded ActiVote TX Oct 21 release; that exclusion does not extend to it. |
| A2 Insights | TX-SEN | Oct 29; Talarico 50 / Paxton 47 (+3), n=631; 270toWin TX page. |
| University of North Florida (UNF) | FL-SEN | Made public Oct 21; Moody 49 / Nixon 45 (−4), n=1,471, field Oct 12–19; Miramar News / CNN. |
| Palafox / Political Matrix | FL-SEN | Field Oct 26–28, n=500; Moody 41.8 / Nixon 35.8, 22.4% undecided; release date unverifiable from the firm's own page; unrated first-appearance firm, not listed by PollingSource/270toWin. |
| RedBox Research | KS-SEN | Marshall +1, field ~Oct 20–23 per ElectionTracker; release date unverified. |

Notes:
- Sponsor disclosure follows the standing inclusion principle (HK,
  2026-10-28): lean alone never excludes; only a
  deliberate-manipulation finding would.
- After the Nov 1 run includes these polls, remove the one-time
  paragraph from the refresh cron body.

## Refresh 2026-11-01 — included (6 polls, 4 races)

Five HK catch-ups (decision Oct 31) + one genuinely new release since the
Oct 31 morning run:

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| ActiVote | TX-SEN | Oct 22–28 | 400 LV | +4.2 (Talarico 52.1 / Paxton 47.9) | activote.net primary poll page, Oct 29 |
| A2 Insights | TX-SEN | unverified; fieldEnd = release date (proxy) | 631 LV | +3 (Talarico 50 / Paxton 47) | 270toWin TX page; Political Wire, Oct 29 |
| University of North Florida (PORL) | FL-SEN | Oct 12–19 | 1,471 LV | −4 (Nixon 45 / Moody 49) | UNF PORL press release, Oct 21 (embargoed); Fox 35 Orlando |
| Palafox / Political Matrix | FL-SEN | Oct 26–28 | 500 LV | −6.0 (Nixon 35.8 / Moody 41.8) | palafoxproductions.com primary release |
| RedBox Research | KS-SEN | Oct 20–23 | 1,301 LV | −1 (Hamilton 45 / Marshall 46) | ElectionTracker KS final-call page; PollingSource KS page |
| ActiVote | OH-SEN | Oct 18–31 | 400 LV | +0.4 (Brown 50.2 / Husted 49.8) | activote.net primary poll page, Oct 31; PollingSource OH page |

Adjudication notes for this refresh (2026-11-01):
- ActiVote OH is the only poll released after the Oct 31 08:00 run (field
  ended Oct 31, so it cannot predate that run); all other Oct 30–31
  candidates were already available to the Oct 31 run.
- Field-date proxies: A2 Insights TX field dates unverified; fieldEnd =
  Oct 29 release date as a labeled proxy (Oct 28 precedent). Palafox FL
  release date remains unverified from the firm's own page; fieldEnd =
  Oct 28 (end of field) per the model's convention. RedBox KS release
  date unverified; fieldEnd = Oct 23 (end of field).
- Sponsorship/disclosure: RedBox KS is flagged D-sponsored by
  PollingSource. Palafox/Political Matrix is an unrated first-appearance
  firm, not listed by PollingSource/270toWin, with 22.4% undecided in its
  FL ballot. Under the standing inclusion principle both are included
  with disclosure; neither is a deliberate-manipulation finding.
- ActiVote TX Oct 29 is a different poll from the excluded ActiVote TX
  Oct 21 release; that exclusion does not extend to it (Oct 28 precedent
  for ActiVote FL).
- House: generic-ballot input UNCHANGED at Dem +8.2 (RCP average still
  51.4/43.2 per Oct 31 reporting); no new RCP average value was adopted.
- NOT added (missed by the Oct 31 run; re-adjudication is HK's decision
  per the Oct 30 precedent, not this run's scope): Stetson/CPOR FL
  (released Oct 30 17:06 EDT, Moody 49 / Nixon 45, n=861 RV, online
  non-probability panel); Kreate Strategies TX (released Oct 30,
  Talarico 48 / Paxton 45, n=900 LV, field Oct 27–30; full methodology
  behind a contact form, not publicly disclosed); Rasmussen MI (field
  Oct 28–29, El-Sayed 49 / Rogers 44, n=745 LV); Upswing Research MI
  (Oct 28, 50/45, n=505 LV); MSU/Verasight MI (Oct 23, 50.5/43.1,
  n=1,383 LV).
- Result vs the Oct 31 run: Senate 60.3% → 59.6% (−0.7pp), expected
  seats 50.81 → 50.79, band 47–54 unchanged; House unchanged (96.9%,
  240.64 seats, band 224–258).

## Refresh 2026-11-02 — included (16 polls, 9 races)

Four HK-decision polls (decision 2026-11-02 06:36 ET, main chat: include all
four deferred polls) + genuinely new Nov 1 releases since the Nov 1 08:00 run
(final NYT/Siena round, YouGov final round, Trafalgar TX).

| Poll | Race | Field dates | n | Margin (D−R) | Source |
|---|---|---|---|---|---|
| Stetson University/CPOR | FL-SEN | Oct 26–30 | 861 RV | −4 (Nixon 45 / Moody 49) | Stetson Today primary release, Oct 30 |
| Kreate Strategies (KStrat) | TX-SEN | Oct 27–30 | 900 LV | +3 (Talarico 48 / Paxton 45) | 270toWin TX page; texpolls.com TX race page |
| Rasmussen Reports | MI-SEN | Oct 28–29 | 745 LV | +5 (El-Sayed 49 / Rogers 44) | RealClearPolling MI page; PollingSource MI page |
| Upswing Research / Demand Justice | MI-SEN | Oct 24–28 | 505 LV | +5 (El-Sayed 50 / Rogers 45) | Demand Justice primary release, Oct 29 |
| NYT/Siena College | AK-SEN | Oct 23–Nov 1 (round) | 610 LV | +2 (Peltola 48 / Sullivan 46) | Siena Research Institute primary release, Nov 1 |
| NYT/Siena College | IA-SEN | Oct 23–Nov 1 (round) | 705 LV | +1 (Turek 48 / Hinson 47) | Siena Research Institute primary release, Nov 1 |
| NYT/Siena College | KS-SEN | Oct 23–Nov 1 (round) | 736 LV | +5 (Hamilton 49 / Marshall 44) | Siena Research Institute primary release, Nov 1 |
| NYT/Siena College | ME-SEN | Oct 23–Nov 1 (round) | 714 LV | +6 (Jackson 51 / Collins 45) | Siena Research Institute primary release, Nov 1 |
| NYT/Siena College | MI-SEN | Oct 23–Nov 1 | 1,011 LV | +11 (El-Sayed 53 / Rogers 42) | Siena Research Institute primary release, Nov 1 |
| NYT/Siena College | OH-SEN | Oct 26–Nov 1 | 717 LV | +5 (Brown 49 / Husted 44) | Siena Research Institute primary release, Nov 1 |
| NYT/Siena College | TX-SEN | Oct 27–Nov 1 | 1,215 LV | +7 (Talarico 50 / Paxton 43) | Siena Research Institute primary release, Nov 1 |
| YouGov | NC-SEN | Oct 26–29 | 2,130 LV | +11 (Cooper 55 / Whatley 44) | Political Wire, Nov 1; PollingSource NC page |
| YouGov | OH-SEN | Oct 26–29 | 2,090 LV | +2 (Brown 50 / Husted 48) | Political Wire, Nov 1; PollingSource OH page |
| YouGov | TX-SEN | Oct 26–29 | 2,141 LV | +4 (Talarico 51 / Paxton 47) | Political Wire, Nov 1; UT Texas Politics Project tracker |
| YouGov | MI-SEN | Oct 26–29 | 2,093 LV | +4 (El-Sayed 51 / Rogers 47) | 270toWin MI page; PollingSource MI page |
| Trafalgar Group | TX-SEN | Oct 31–Nov 1 | 1,089 LV | 0 (Talarico 48 / Paxton 48) | RealClearPolling TX page; 270toWin TX page |

Adjudication notes for this refresh (2026-11-02):
- HK one-time inclusion verified, not copied: every figure above was
  re-verified from its primary or aggregator source at run time. Upswing's
  candidate order, unstated in the Nov 1 ledger, is resolved by the Demand
  Justice primary release: El-Sayed 50 / Rogers 45. Stetson n=861 is the
  registered-voter electoral base (1,000 adults interviewed); PollingSource
  labels the same sample LV.
- Siena per-state sample sizes cross-checked: AK 610, IA 705, KS 736, ME 714,
  MI 1,011, OH 717, TX 1,215 — sum 5,708 matches the NYT-reported round total.
  Per-state field windows are verified only for MI (Oct 23–Nov 1), OH
  (Oct 26–Nov 1, per RCP) and TX (Oct 27–Nov 1, per texpolls); the other four
  use fieldEnd = Nov 1 with the round window noted.
- Sponsorship/disclosure: Upswing MI is sponsored by Demand Justice
  (D-aligned); Trafalgar TX is flagged R-sponsored by PollingSource; Kreate
  TX names no sponsor and its full methodology sits behind a contact form
  (online panel, MoE ±3.3, per texpolls); Stetson FL uses a Qualtrics online
  non-probability panel. Under the standing inclusion principle all are
  included with disclosure; none is a deliberate-manipulation finding.
- House: generic-ballot input UNCHANGED at Dem +8.2. No new RCP average value
  was verified from RCP itself; secondary reports conflict (8.2 per a Nov 1
  final-polls roundup citing RCP; 8.9 per QNC News citing RCP through Oct 30;
  8.3 per Newsmax, Oct 29). Per the Nov 1 precedent, no change is adopted
  without a verified new RCP value.
- NOT added (with reason): YouGov KS (Hamilton 50 / Marshall 49) and YouGov
  IA (Turek 50 / Hinson 49) — margins verified via Political Wire, but sample
  sizes unverified, and the model cannot take a poll without n; Siena already
  covers both races in this run. ResearchCo MI — published shares conflict
  (48/46 per FutureBallot, On Point, pollcheck vs 51/48 per 270toWin), no
  primary release found; margin +2 vs +3 unresolved. AtlasIntel TX —
  published shares conflict (Talarico 51 per pollcheck vs 52 per RCP) and the
  sample is listed as adults, not likely voters. On Point Polling TX (Nov 1,
  544 LV, Talarico +5.5) — an aggregator's own house poll, not independently
  published; never used in prior runs.
- NOT added (missed pre-Oct-30 polls; re-adjudication remains HK's decision
  per the Oct 30 precedent, not this run's scope): MSU/Verasight MI (field
  Oct 8–23, n=1,383, El-Sayed 51 / Rogers 43 per 270toWin); East Carolina
  University NC (field Oct 26–29, n=1,041, Cooper 54 / Whatley 45);
  Quantus NC (field Oct 24–25, n=722, Cooper 51.4 / Whatley 42.8);
  RedBox Research NC (field Oct 23, n=3,292, Cooper 50 / Whatley 44).
- polls.ts (display-only) was not updated, consistent with the Oct 28–Nov 1
  runs.
- Result vs the Nov 1 run: Senate 59.6% → 62.1% (+2.5pp), expected
  seats 50.79 → 50.94, band 47–54 unchanged; House unchanged (96.9%,
  240.64 seats, band 224–258).
