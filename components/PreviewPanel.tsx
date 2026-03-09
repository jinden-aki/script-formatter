"use client";

import { useRef } from "react";
import { ParsedScript } from "@/lib/types";
import { paginateScenes } from "@/lib/paginate";
import { COLORS } from "@/lib/constants";
import Sidebar from "./Sidebar";
import CoverPage from "./CoverPage";
import A4Page from "./A4Page";

interface PreviewPanelProps {
  script: ParsedScript;
  onReset: () => void;
}

export default function PreviewPanel({ script, onReset }: PreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pages = paginateScenes(script.scenes);
  const totalPages = pages.length + 1; // +1 for cover

  const handleExportPDF = async () => {
    const pagesEl = containerRef.current?.querySelectorAll(".a4-page");
    if (!pagesEl) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pagesEl.length; i++) {
      const canvas = await html2canvas(pagesEl[i] as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    const filename = `${script.title || "script"}.pdf`;
    pdf.save(filename);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar script={script} totalPages={totalPages} />

      <div
        style={{
          flex: 1,
          background: "#E8EAF0",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            padding: "0 8px",
          }}
        >
          <button
            onClick={onReset}
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "13px",
              color: COLORS.textSub,
              cursor: "pointer",
            }}
          >
            最初から
          </button>
          <button
            onClick={handleExportPDF}
            style={{
              background: COLORS.primary,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = COLORS.primary;
            }}
          >
            PDF出力
          </button>
        </div>

        <div
          ref={containerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            <CoverPage script={script} />
          </div>

          {pages.map((pageItems, i) => (
            <div key={i} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
              <A4Page items={pageItems} pageNumber={i + 2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
