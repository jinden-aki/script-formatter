import { ParsedScript } from "@/lib/types";
import { COLORS } from "@/lib/constants";

interface SidebarProps {
  script: ParsedScript;
  totalPages: number;
}

export default function Sidebar({ script, totalPages }: SidebarProps) {
  const sceneCount = script.scenes.filter(
    (s) => s.type === "scene_heading"
  ).length;
  const dialogueCount = script.scenes.filter(
    (s) => s.type === "dialogue"
  ).length;

  const characterDialogueCounts: Record<string, number> = {};
  for (const item of script.scenes) {
    if (item.type === "dialogue") {
      characterDialogueCounts[item.character] =
        (characterDialogueCounts[item.character] || 0) + 1;
    }
  }

  const sortedCharacters = Object.entries(characterDialogueCounts).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div
      style={{
        width: "240px",
        minWidth: "240px",
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        padding: "24px 20px",
        height: "100vh",
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: COLORS.text,
          marginBottom: "4px",
        }}
      >
        {script.title}
      </h2>
      {script.subtitle && (
        <p style={{ fontSize: "12px", color: COLORS.textSub, marginBottom: "4px" }}>
          {script.subtitle}
        </p>
      )}
      {script.author && (
        <p style={{ fontSize: "12px", color: COLORS.textSub, marginBottom: "4px" }}>
          {script.author}
        </p>
      )}
      {script.date && (
        <p style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "16px" }}>
          {script.date}
        </p>
      )}

      <div
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: COLORS.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "12px",
          }}
        >
          統計情報
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <StatItem label="総ページ数" value={`${totalPages}P`} />
          <StatItem label="シーン数" value={`${sceneCount}`} />
          <StatItem label="台詞数" value={`${dialogueCount}`} />
        </div>
      </div>

      {sortedCharacters.length > 0 && (
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "16px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            登場人物
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            {sortedCharacters.map(([name, count]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: COLORS.text }}>{name}</span>
                <span
                  style={{
                    fontSize: "10px",
                    color: COLORS.textMuted,
                    background: COLORS.bg,
                    padding: "1px 6px",
                    borderRadius: "8px",
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "12px",
      }}
    >
      <span style={{ color: COLORS.textSub }}>{label}</span>
      <span style={{ fontWeight: "bold", color: COLORS.text }}>{value}</span>
    </div>
  );
}
