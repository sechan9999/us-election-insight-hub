'use client';
import { useState } from 'react';

const TABS = [
  {
    src: '/map_2024.html',
    label: '2024 vote share',
    labelKo: '2024 득표율',
    summary:
      'Democratic vote share by county in the 2024 presidential election (3,106 counties, Harvard MEDSL). The diploma divide is visible: counties with more college graduates vote more Democratic (r = +0.44).',
    summaryKo:
      '2024년 대선 카운티별 민주당 득표율 (3,106개 카운티, Harvard MEDSL). 학력 격차가 뚜렷합니다: 대졸 비율이 높은 카운티일수록 민주당 득표율이 높습니다 (r = +0.44).',
  },
  {
    src: '/swing_map.html',
    label: '2020→2024 swing',
    labelKo: '2020→2024 스윙',
    summary:
      'Change in Democratic vote share from 2020 to 2024 by county. The shift toward Republicans was broad-based: a decomposition shows a uniform −2.5 to −3.0pp choice effect across all education quintiles, with turnout effects of +3.8 to +5.7pp.',
    summaryKo:
      '2020→2024년 카운티별 민주당 득표율 변화. 공화당으로의 이동은 광범위했습니다: 분해 분석에 따르면 모든 학력 5분위에서 −2.5~−3.0%p의 균일한 선택 효과가 있었고, 투표율 효과는 +3.8~+5.7%p였습니다.',
  },
  {
    src: '/state_divide_map.html',
    label: 'Diploma divide by state',
    labelKo: '주별 학력 격차',
    summary:
      'Per-state slope: how much Democratic vote share rises per 1pp of bachelor\u2019s share (county regression controlling for income, race, age, density, population). National pooled slope +1.49pp; strongest in NY (+3.93), AZ (+3.15), NC (+2.60); weakest in SD, LA, NE.',
    summaryKo:
      '주별 기울기: 대졸 비율 1%p 상승 시 민주당 득표율 상승폭 (소득·인종·연령·밀도·인구 통제 카운티 회귀). 전국 통합 기울기 +1.49%p; 가장 강한 주는 NY (+3.93), AZ (+3.15), NC (+2.60); 가장 약한 주는 SD, LA, NE.',
  },
];

export default function MapsClient() {
  const [tab, setTab] = useState(0);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const t = TABS[tab];
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          background: '#f4f4f5',
          borderBottom: '1px solid #e4e4e7',
          flexWrap: 'wrap',
        }}
      >
        {TABS.map((tb, i) => {
          const active = i === tab;
          return (
            <button
              key={tb.src}
              onClick={() => setTab(i)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: active ? '#1d4ed8' : '#d4d4d8',
                background: active ? '#1d4ed8' : '#ffffff',
                color: active ? '#ffffff' : '#3f3f46',
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {lang === 'ko' ? tb.labelKo : tb.label}
            </button>
          );
        })}
        <button
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          style={{
            marginLeft: 'auto',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #d4d4d8',
            background: '#ffffff',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {lang === 'ko' ? 'English' : '한국어'}
        </button>
      </div>
      <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
        <p style={{ margin: 0, fontSize: 14, color: '#3f3f46', maxWidth: 900 }}>
          {lang === 'ko' ? t.summaryKo : t.summary}
        </p>
      </div>
      <iframe src={t.src} style={{ flex: 1, border: 0, minHeight: '70vh' }} title="election map" />
    </main>
  );
}
