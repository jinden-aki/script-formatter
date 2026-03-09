"use client";
import { useCallback, useState } from "react";
import { extractTextFromDocx } from "@/lib/docxParser";
import { COLORS } from "@/lib/constants";

interface Props {
  onTextExtracted: (text: string) => void;
  onError: (msg: string) => void;
}

export default function FileUploader({ onTextExtracted, onError }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".docx")) {
        onError(".docxファイルのみ対応しています");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onError("ファイルサイズは10MB以内にしてください");
        return;
      }

      setIsProcessing(true);
      setFileName(file.name);

      try {
        const text = await extractTextFromDocx(file);
        onTextExtracted(text);
      } catch {
        onError("ファイルの読み込みに失敗しました");
      } finally {
        setIsProcessing(false);
      }
    },
    [onTextExtracted, onError]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      style={{
        display: "block",
        border: `2px dashed ${isDragging ? COLORS.primary : COLORS.border}`,
        borderRadius: "10px",
        padding: "28px 20px",
        textAlign: "center",
        cursor: "pointer",
        background: isDragging ? COLORS.primaryLight : COLORS.bg,
        transition: "all 0.2s",
      }}
    >
      <input
        type="file"
        accept=".docx"
        onChange={onChange}
        style={{ display: "none" }}
      />
      {isProcessing ? (
        <div style={{ color: COLORS.primary, fontSize: 13 }}>
          Wordファイルを読み込み中...
        </div>
      ) : fileName ? (
        <div style={{ color: "#10B981", fontSize: 13 }}>
          {fileName} を読み込みました（クリックで再選択）
        </div>
      ) : (
        <>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
          <div
            style={{
              color: COLORS.text,
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            .docxファイルをドロップ
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 11 }}>
            またはクリックしてファイルを選択
          </div>
        </>
      )}
    </label>
  );
}
