import { SceneItem } from "@/lib/types";

interface SceneElementProps {
  item: SceneItem;
}

export default function SceneElement({ item }: SceneElementProps) {
  switch (item.type) {
    case "episode_header":
      return (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "13px",
            letterSpacing: "0.2em",
            borderTop: "1px solid #333",
            borderBottom: "1px solid #333",
            padding: "8px 0",
            margin: "16px 0",
          }}
        >
          {item.text}
        </div>
      );

    case "scene_heading":
      return (
        <div
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            borderBottom: "1px solid #333",
            paddingBottom: "2px",
            margin: "14px 0 6px 0",
          }}
        >
          ◯{item.number}　{item.location}
          {item.time ? `（${item.time}）` : ""}
        </div>
      );

    case "action":
      return (
        <div
          style={{
            fontSize: "11px",
            lineHeight: "2.0",
            paddingLeft: "32px",
            margin: "2px 0",
          }}
        >
          {item.text}
        </div>
      );

    case "dialogue": {
      const isMonologue =
        item.character.includes("Ｍ") || item.character.includes("（Ｍ）");
      return (
        <div
          style={{
            display: "flex",
            fontSize: "11px",
            lineHeight: "2.0",
            margin: "2px 0",
            ...(isMonologue ? { color: "#666", fontStyle: "italic" } : {}),
          }}
        >
          <div
            style={{
              width: "96px",
              minWidth: "96px",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {item.character}
          </div>
          <div style={{ flex: 1 }}>「{item.line}」</div>
        </div>
      );
    }

    case "transition":
      return (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: "11px",
            letterSpacing: "0.5em",
            margin: "12px 0",
          }}
        >
          {item.text}
        </div>
      );

    default:
      return null;
  }
}
