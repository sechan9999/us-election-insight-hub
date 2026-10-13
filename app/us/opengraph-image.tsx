import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0a1628',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#93c5fd', letterSpacing: 4 }}>
          US ELECTION INSIGHTS HUB
        </div>
        <div style={{ fontSize: 22, color: '#9ca3af', marginTop: 12 }}>
          2026 Midterm Forecast · 40,000 simulations
        </div>
        <div style={{ display: 'flex', gap: 80, marginTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 88, fontWeight: 800, color: '#60a5fa' }}>53.4%</div>
            <div style={{ fontSize: 24, color: '#d1d5db' }}>Senate Dem majority</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 88, fontWeight: 800, color: '#60a5fa' }}>96.6%</div>
            <div style={{ fontSize: 24, color: '#d1d5db' }}>House Dem majority</div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: '#6b7280', marginTop: 40 }}>
          Transparent · Reproducible · Nonpartisan
        </div>
      </div>
    ),
    { ...size },
  );
}
