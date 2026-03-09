"use client";

import { useState } from "react";
import { COLORS, SAMPLE_TEXT } from "@/lib/constants";

interface InputPanelProps {
  onConvert: (text: string) => void;
  isLoading: boolean;
}

export default function InputPanel({ onConvert, isLoading }: InputPanelProps) {
  const [text, setText] = useState("");

  const lineCount = text ? text.split("\n").length : 0;
  const charCount = text.length;

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "48px 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: COLORS.text,
            marginBottom: "8px",
          }}
        >
          ScriptFormatter Pro
        </h1>
        <p style={{ fontSize: "14px", color: COLORS.textSub }}>
          脚本テキストを台本業界標準フォーマットに自動変換
        </p>
      </div>

      <div
        style={{
          background: COLORS.primaryLight,
          border: `1px solid ${COLORS.primary}33`,
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
          fontSize: "13px",
          color: COLORS.text,
          lineHeight: "1.6",
        }}
      >
        <strong>対応フォーマット</strong>
        <br />
        柱（◯1 場所名（時間））、ト書き（地の文）、台詞（キャラ名「台詞」）、
        テロップ（Ｔ『...』）、場面転換（× × ×）に対応しています。
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="脚本テキストをここに貼り付けてください..."
          style={{
            width: "100%",
            minHeight: "300px",
            padding: "16px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: '"Noto Sans Mono", "Courier New", monospace',
            lineHeight: "1.8",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            color: COLORS.text,
            background: COLORS.surface,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
            fontSize: "12px",
            color: COLORS.textMuted,
          }}
        >
          <span>
            {lineCount} 行 / {charCount.toLocaleString()} 文字
          </span>
          <button
            onClick={() => setText(SAMPLE_TEXT)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.primary,
              cursor: "pointer",
              fontSize: "12px",
              textDecoration: "underline",
            }}
          >
            サンプルテキストを挿入
          </button>
        </div>
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button
          onClick={() => onConvert(text)}
          disabled={isLoading || text.trim().length === 0}
          style={{
            background:
              isLoading || text.trim().length === 0
                ? COLORS.border
                : COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "14px 48px",
            fontSize: "15px",
            fontWeight: "bold",
            cursor:
              isLoading || text.trim().length === 0
                ? "not-allowed"
                : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && text.trim().length > 0) {
              e.currentTarget.style.background = COLORS.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && text.trim().length > 0) {
              e.currentTarget.style.background = COLORS.primary;
            }
          }}
        >
          {isLoading ? "変換中..." : "台本フォーマットに変換"}
        </button>
      </div>
    </div>
  );
}
