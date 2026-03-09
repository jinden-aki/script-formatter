import mammoth from "mammoth";

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  let text = result.value;
  return cleanWordText(text);
}

export function cleanWordText(raw: string): string {
  return raw
    // Wordの引用符ブロック記号（> ）を除去
    .replace(/^>\s*/gm, "")
    // 太字マークダウン残骸を除去
    .replace(/\*\*/g, "")
    // バックスラッシュ改行残骸を除去
    .replace(/\\\n/g, "\n")
    .replace(/\\$/gm, "")
    // 3行以上の連続空行を2行に圧縮
    .replace(/\n{3,}/g, "\n\n")
    // 行末の余分な空白を除去
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
