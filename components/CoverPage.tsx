import { ParsedScript } from "@/lib/types";

interface CoverPageProps {
  script: ParsedScript;
}

export default function CoverPage({ script }: CoverPageProps) {
  return (
    <div
      className="a4-page"
      style={{
        width: "595px",
        minHeight: "842px",
        background: "#fff",
        padding: "72px 64px 64px 80px",
        fontFamily: '"Noto Serif JP", "Yu Mincho", "MS 明朝", serif',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            marginBottom: "16px",
            color: "#1A1A2E",
          }}
        >
          {script.title}
        </h1>
        {script.subtitle && (
          <p
            style={{
              fontSize: "14px",
              color: "#6B7280",
              marginBottom: "48px",
            }}
          >
            {script.subtitle}
          </p>
        )}
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "#E0E4EA",
            margin: "0 auto 48px auto",
          }}
        />
        {script.author && (
          <p
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "#1A1A2E",
            }}
          >
            {script.author}
          </p>
        )}
        {script.date && (
          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{script.date}</p>
        )}
      </div>

      {script.characters.length > 0 && (
        <div style={{ marginTop: "64px", width: "100%", maxWidth: "360px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              borderBottom: "1px solid #E0E4EA",
              paddingBottom: "4px",
              marginBottom: "12px",
              color: "#1A1A2E",
            }}
          >
            登場人物
          </h2>
          {script.characters.map((c, i) => (
            <div
              key={i}
              style={{
                fontSize: "11px",
                lineHeight: "1.8",
                color: "#333",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{c.name}</span>
              {c.desc && (
                <span style={{ color: "#6B7280" }}>　{c.desc}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
