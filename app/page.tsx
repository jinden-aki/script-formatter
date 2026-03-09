"use client";

import { useState } from "react";
import { ParsedScript } from "@/lib/types";
import { COLORS } from "@/lib/constants";
import InputPanel from "@/components/InputPanel";
import PreviewPanel from "@/components/PreviewPanel";

export default function Home() {
  const [script, setScript] = useState<ParsedScript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "変換に失敗しました");
      }

      const parsed: ParsedScript = await res.json();
      setScript(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "変換に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setScript(null);
    setError(null);
  };

  if (script) {
    return <PreviewPanel script={script} onReset={handleReset} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <InputPanel onConvert={handleConvert} isLoading={isLoading} />

      {isLoading && (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <div
            style={{
              display: "inline-block",
              width: "32px",
              height: "32px",
              border: `3px solid ${COLORS.border}`,
              borderTopColor: COLORS.primary,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: COLORS.textSub,
            }}
          >
            AIが脚本を解析しています...
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FCA5A5",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "13px",
              color: "#DC2626",
            }}
          >
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
