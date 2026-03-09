import { SceneItem } from "@/lib/types";
import SceneElement from "./SceneElement";

interface A4PageProps {
  items: SceneItem[];
  pageNumber: number;
}

export default function A4Page({ items, pageNumber }: A4PageProps) {
  return (
    <div
      className="a4-page"
      style={{
        width: "595px",
        minHeight: "842px",
        background: "#fff",
        padding: "72px 64px 64px 80px",
        fontFamily: '"Noto Serif JP", "Yu Mincho", "MS 明朝", serif',
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div>
        {items.map((item, i) => (
          <SceneElement key={i} item={item} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          right: "32px",
          fontSize: "9px",
          color: "#aaa",
        }}
      >
        {pageNumber}
      </div>
    </div>
  );
}
