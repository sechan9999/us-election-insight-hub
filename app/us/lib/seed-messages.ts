// Message-analysis tab data (Trump Truth Social), schema message_index_weekly/v1.
//
// DISPLAY-ONLY descriptive layer: never a forecast input (endogeneity unresolved), not part of
// the run ID (run.ts hashes seed-data only). Built weekly by sechan9999/trump-truth-analysis
// (scripts/export_weekly.py). v1 ships a checked-in snapshot and refreshes from the published
// URL at runtime; production can swap the URL for a BigQuery-backed endpoint.

import snapshot from './data/message_index_weekly.json';

export const MESSAGE_INDEX_URL = 'https://sechan9999.github.io/trump-truth-analysis/message_index_weekly.json';
export const MESSAGE_SITE_URL = 'https://sechan9999.github.io/trump-truth-analysis/';
export const MESSAGE_REPO_URL = 'https://github.com/sechan9999/trump-truth-analysis';

export interface StateMessageStats {
  endorseShare: number; // I^E_s, 0..1 — trailing 4-week endorsement share (12 states sum to 1)
  demMentionShare: number | null; // share of Democratic-candidate name mentions (tone not measured)
  nEndorse: number;
  nDemMention: number;
  zVsBaseline: number | null; // vs 2025-01-20..2026-06-30 4-week shares
  rank: number; // 1..12 by endorseShare
  surge: boolean; // z > 2 and sample sufficient
  smallN: boolean; // fewer than 20 battleground-mapped posts in the window
}

export interface TopicLabel {
  ko: string;
  en: string;
  color: string;
  cohesion: number;
  caution: boolean; // cohesion < 0.05
  keywords: string[];
}

export interface Annotation {
  month: string;
  topic: string;
  nMonth: number;
  shareMonth: number;
  episodeStart: string;
  episodeEnd: string;
  episodeCount: number;
  ratio: number;
  keywords: string[];
}

export interface MessageIndexWeekly {
  week: string;
  windowWeeks: number;
  methodVersion: string;
  gazetteerVersion: string;
  labelsVersion: string;
  collected: string;
  nPostsTotal: number;
  nPostsAnalyzed: number;
  silhouette: number;
  coverage: { mappedShare: number | null; anyStateShare: number | null; nEndorseWindow: number; nMapped: number };
  smallN: boolean;
  states: Record<string, StateMessageStats>; // key: postal code ("NC") = race id prefix
  topicLabels: Record<string, TopicLabel>;
  topics: ({ month: string } & Record<string, number | string>)[];
  annotations: Annotation[];
}

type Raw = typeof snapshot;

export function normalize(r: Raw): MessageIndexWeekly {
  return {
    week: r.week,
    windowWeeks: r.window_weeks,
    methodVersion: r.method_version,
    gazetteerVersion: r.gazetteer_version,
    labelsVersion: r.labels_version,
    collected: r.collected,
    nPostsTotal: r.n_posts_total,
    nPostsAnalyzed: r.n_posts_analyzed,
    silhouette: r.silhouette_cosine,
    coverage: {
      mappedShare: r.coverage.mapped_share,
      anyStateShare: r.coverage.any_state_share ?? null,
      nEndorseWindow: r.coverage.n_endorse_window,
      nMapped: r.coverage.n_mapped_battleground,
    },
    smallN: r.small_n,
    states: Object.fromEntries(
      Object.entries(r.states).map(([k, s]) => [
        k,
        {
          endorseShare: s.endorse_share,
          demMentionShare: s.dem_mention_share,
          nEndorse: s.n_endorse,
          nDemMention: s.n_dem_mention,
          zVsBaseline: s.z_vs_baseline,
          rank: s.rank,
          surge: s.surge,
          smallN: s.small_n,
        },
      ]),
    ),
    topicLabels: r.topic_labels,
    topics: r.topics,
    annotations: r.annotations.map((a) => ({
      month: a.month,
      topic: a.topic,
      nMonth: a.n_month,
      shareMonth: a.share_month,
      episodeStart: a.episode_start,
      episodeEnd: a.episode_end,
      episodeCount: a.episode_count,
      ratio: a.ratio,
      keywords: a.keywords,
    })),
  };
}

/** Checked-in snapshot (renders immediately, also the fallback if the URL fails). */
export const MESSAGE_SNAPSHOT: MessageIndexWeekly = normalize(snapshot);
export const MESSAGE_DATA_AS_OF = MESSAGE_SNAPSHOT.week;

/** Latest weekly export; rejects on network or shape errors so the caller keeps the snapshot. */
export async function fetchLatestMessageIndex(signal?: AbortSignal): Promise<MessageIndexWeekly> {
  const res = await fetch(MESSAGE_INDEX_URL, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`message index ${res.status}`);
  const j = (await res.json()) as Raw;
  if (j?.schema !== 'message_index_weekly/v1' || typeof j.states !== 'object') throw new Error('message index: bad shape');
  return normalize(j);
}

/** 'NC-SEN' -> 'NC' */
export const stateCode = (raceId: string) => raceId.split('-')[0];
