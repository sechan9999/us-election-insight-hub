# Senate battleground results sources — 12 states

Research date: 2026-10-06. Purpose: vote counts for the hub's election tracker (policy c: counts from official state election offices only; race calls cited from NYT).

**How this was checked:** each endpoint was requested directly. "Verified" means data was downloaded and the format parsed from a real 2026 (or 2024) election. Nothing here is inferred from documentation alone unless marked.

## Summary

| State | Category | Source | Format | Verified with |
|---|---|---|---|---|
| NC | ✅ live, machine-readable | NC State Board of Elections ENR | JSON | 2026-03-03 primary; 2026-11-03 path already live |
| GA | ✅ live, machine-readable | GA Secretary of State (Enhanced Voting) | JSON API | 2026-05-19 primary, 2024 general |
| MN | ✅ live, machine-readable | MN Secretary of State media files | `;`-delimited text | 2026-08-11 primary, 2024 general |
| IA | ✅ live, machine-readable | IA Secretary of State ENR (Clarity format) | JSON / XML zip | 2026-06-02 primary |
| FL | ✅ live after 7 PM ET, machine-readable | FL Division of Elections extract utility | tab-delimited (POST) | 2026-08-18 primary |
| AK | ✅ machine-readable (RCV caveat) | AK Division of Elections | precinct CSV | 2026 primary |
| TX | ⛔ blocked for automation | TX SOS results site | — | Cloudflare challenge ("Just a moment…") |
| KS | ⛔ blocked for automation | KS SOS unofficial results (ent.sos.ks.gov) | — | Cloudflare "I'm Under Attack" mode |
| MI | ⛔ blocked / unreachable | MI SOS (mvic), mielections.us | — | mvic behind Cloudflare; mielections.us not responding (off-season) |
| OH | ⚠️ unverifiable now | OH SOS liveresults | unknown | liveresults.ohiosos.gov redirects to the data portal off-season |
| NH | ⚠️ no state live feed | NH SOS | town results after election | SOS site blocks scripted requests; results compiled from towns |
| ME | ⚠️ no state live feed | ME SOS | Excel/CVR days later; RCV tabulation after | 2026-06-09 primary files posted 06-16 to 06-18 |

Bot-protection challenges were **not** bypassed. For ⛔ and ⚠️ states, election-night counts need another route (below).

## Verified sources

### North Carolina — JSON
- Live: `https://er.ncsbe.gov/enr/{YYYYMMDD}/data/results_0.txt` (JSON array despite `.txt`). `.../precinct_0.txt` for precincts. `20261103` already returns 200.
- Final files: `https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/{YYYY_MM_DD}/results_pct_{YYYYMMDD}.zip` (tab-delimited, precinct level). The `2026_11_03` folder already exists (absentee files).
- Fields: `cnm` contest name (e.g. `US SENATE - DEM (VOTE FOR 1)`), `bnm` candidate, `pty` party, `vct` votes, `prt`/`ptl` precincts reporting/total, `evc`/`ovc`/`avc`/`pvc` vote-method splits.
- Mapping: `pctReporting = prt/ptl*100`.

### Georgia — JSON API (Enhanced Voting)
- `https://results.sos.ga.gov/results/public/api/elections/Georgia/{electionSlug}` (metadata) and `/ballot-items` (all contests, `data[]`).
- Slugs: 2026 primary `GeneralPrimary51926`, 2024 general `2024NovGen`. **The 2026 general slug is not published yet**; tried `2026NovGen` and similar → 404. Must be looked up once the SOS creates the election.
- Fields per contest: `name[].text` (e.g. `US Senate`), `reportingStatus.reportingUnits/totalUnits` (counties), `summaryResults.ballotOptions[]` with `name`, `voteCount`, `party.abbreviation`, `groupResults` by vote method.

### Minnesota — semicolon text (media files)
- `https://electionresultsfiles.sos.mn.gov/{YYYYMMDD}/ussenate.txt` (other offices have their own files). Main results site is behind a Radware captcha; the media file host is open.
- Row: `MN;;;0102;U.S. Senator;;{cand code};{name};;;{party};{precincts reporting};{total precincts};{votes};{pct};{total votes}`.
- Mapping: `pctReporting = col12/col13*100`; party `DFL` = Democratic.

### Iowa — Clarity ENR format
- Election list: `https://electionresults.iowa.gov/IA/elections.json` (2026 primary EID `126082`). Then `/IA/{EID}/current_ver.txt` → `/IA/{EID}/{ver}/json/en/summary.json`, `/reports/detailxml.zip`, `/reports/summary.zip`.
- `summary.json` contest: `C` name (e.g. `United States Senator - Rep.`), `CH` choices, `P` parties, `V` votes, `PR`/`TP` reporting units/total (99 = counties).
- The 2026 general EID will appear in `elections.json` once created.

### Florida — tab-delimited extract (POST)
- `POST https://results.elections.myflorida.com/ResultsExtract.Asp` with `ElectionDate=M/D/YYYY&OfficialResults=Y&PartyRaces=Y&DataMode=&FormsButton2=Download`.
- Columns: `ElectionDate, PartyCode, PartyName, RaceCode (USS = US Senate), OfficeDesc, CountyCode, CountyName, …, Precincts, PrecinctsReporting, CanNameLast, CanNameFirst, CanNameMiddle, CanVotes` (county level; sum across counties).
- The utility states it "may not be available prior to the closing of polls at 7 PM on election day".

### Alaska — precinct CSV
- 2026 primary: `https://www.elections.alaska.gov/enr26/results/GA_ENR_Precinct_State_of_Alaska.csv` (linked from `/election-results/e/?id=26prim`). Summary PDF alongside. General election page id expected `26genr` (not yet populated).
- Columns include `Precinct_name, Reporting_flag, Contest_title ("U.S. Senator"), candidate_name, Party_Code, total_votes` plus vote-method splits.
- **RCV:** the general election uses ranked-choice voting. Election-night counts are first-choice only; the RCV tabulation is published later. The tracker must label AK counts as "first choice" and not treat them as final.

## States without an automatable official feed

| State | Finding | Options |
|---|---|---|
| TX | Results site behind Cloudflare challenge | (1) Request a media/data feed from the TX SOS; (2) manual entry from the official page by the operator; (3) county sites (large counties publish their own) |
| KS | Unofficial results site in Cloudflare "Under Attack" mode | Same as TX |
| MI | mvic behind Cloudflare; mielections.us down off-season | Re-check mielections.us before Nov 2; otherwise manual entry or county feeds |
| OH | Live site redirects to the data portal outside elections | Re-check liveresults.ohiosos.gov in the days before Nov 3; some counties run Clarity ENR (`liveresults.boe.ohio.gov/ENR/...`) |
| NH | No state live feed; towns report; SOS blocks scripted requests | Manual entry from official town/SOS postings; mark as "partial" |
| ME | Results posted as Excel days after; RCV tabulation later | Manual entry; label as preliminary until SOS posts; RCV round results later |

## Implications for the tracker
1. **6 states can be ingested automatically** (NC, GA, MN, IA, FL, AK). GA and IA need the general-election ID once published; FL only after 7 PM ET; AK first-choice only.
2. **6 states need a manual-entry path** (TX, KS, MI, OH, NH, ME) unless a feed appears. The same operator who enters NYT calls can enter counts from the official pages, with a timestamp and source link per entry.
3. Two RCV states (AK, ME): show first-choice counts with an explicit label; never mark called from counts (consistent with policy c).
4. Re-check OH and MI in the week before the election, when their live sites usually come back.

## Ingest (`scripts/ingest-results.ts`, `ingest/results/`)

Automated for the 6 states above (NC, GA, MN, IA, FL, AK). Output is a `LiveFeed` JSON (`app/us/lib/live.ts`): per race D/R votes, `pctReporting` with its basis (precincts or counties), `countSource`, `firstChoiceOnly` for Alaska, and a `sources` status list (`ok` / `notAvailable` / failure message per state).

```bash
npm run ingest:results:test                               # 2026 primaries; fails unless every state matches published values
npm run ingest:results -- --mode general --out feed.json  # election window
npm run ingest:results -- --mode general --rehearsal      # exercise states' pre-election TEST files (marked mode: test)
```

Safeguards:
- **Poll-close gate (`notBefore`).** Data published before a state's first polls close is ignored. States post test files with fake numbers before Election Day; on 2026-10-06 Minnesota's `20261103/ussenate.txt` already showed 7.6% "reporting".
- **Exact nominee matchers.** Full-name patterns per state; 0 or more than 1 match is an error, never a guess (Alaska lists both "Sullivan, Dan S." and "Sullivan, Daniel J. Jr.").
- **Election-bound sources.** Alaska's CSV is resolved from the general-election page (`?id=26genr`), Iowa's election from `elections.json` by name, so a stale primary file is never read as the general.
- **Never calls races.** `called` stays null; calls come only from the NYT call entered by the operator.
- `--previous feed.json` keeps a state's last good row if its fetch fails, and the failure is listed in `sources`.

Test run on 2026-10-06 (all match the official sources):

| State | Contest tested | Result |
|---|---|---|
| NC | US Senate DEM primary | Cooper 761,345, 100% precincts |
| GA | US Senate REP primary | Collins 369,642, 100% counties |
| MN | US Senate primaries | Flanagan 411,853 / Tafoya 211,813, 100% precincts |
| IA | US Senate REP primary | Hinson 153,059, 100% precincts (from detail.xml; summary.json PR/TP is not a reporting share) |
| FL | US Senate primaries | Nixon 705,835 / Moody 1,320,780, 100% precincts |
| AK | US Senate top-four primary | Peltola 82,244 / Sullivan 68,726, reporting not derivable (flag undocumented) |

Still to configure before Nov 3: Georgia's general-election slug (not published yet), and confirmation of Iowa's general election name and Alaska's `26genr` page once they go live. Poll-close times in `config.ts` should be double-checked against each state's official hours.
