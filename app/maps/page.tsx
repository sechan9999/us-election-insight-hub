"use client";
import { useState } from "react";

const TABS = [
  { src: "/map_2024.html", label: "2024 vote share" },
  { src: "/swing_map.html", label: "2020→2024 swing" },
  { src: "/state_divide_map.html", label: "Diploma divide by state" },
];

export default function Maps() {
  const [src, setSrc] = useState(TABS[0].src);
  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "#f4f4f5",
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        {TABS.map((t) => {
          const active = src === t.src;
          return (
            <button
              key={t.src}
              onClick={() => setSrc(t.src)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: active ? "#1d4ed8" : "#d4d4d8",
                background: active ? "#1d4ed8" : "#ffffff",
                color: active ? "#ffffff" : "#3f3f46",
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <iframe src={src} style={{ flex: 1, border: 0 }} title="election map" />
    </main>
  );
}
