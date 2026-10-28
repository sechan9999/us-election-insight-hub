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

## Carried exclusions (decided earlier, still in force)

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
day. The reversal is the standing decision; a later refresh reuses it unless
HK changes it.

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
