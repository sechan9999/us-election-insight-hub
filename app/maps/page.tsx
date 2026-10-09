"use client";
import { useState } from "react";
export default function Maps() {
    const [src, setSrc] = useState("/map_2024.html");
    return (
        <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 8, display: "flex", gap: 8 }}>
                <button onClick={() => setSrc("/map_2024.html")}>2024 vote share</button>
                <button onClick={() => setSrc("/swing_map.html")}>2020→2024 swing</button>
            </div>
            <iframe src={src} style={{ flex: 1, border: 0 }} />
        </main>
    );
}