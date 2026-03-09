import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは日本の脚本フォーマット専門家です。
入力された脚本テキストを解析し、JSONのみ返してください。説明文・コードブロック記号は不要です。

{
  "title": "作品タイトル",
  "subtitle": "第N稿",
  "author": "作者名",
  "date": "日付",
  "characters": [{"name": "キャラ名（スペース除去済み）", "desc": "説明"}],
  "scenes": [
    {"type": "episode_header", "text": "【N話】"},
    {"type": "scene_heading", "number": "1", "location": "場所名", "time": "時間帯"},
    {"type": "action", "text": "ト書き本文"},
    {"type": "dialogue", "character": "キャラ名", "line": "台詞（カギ括弧なし）"},
    {"type": "transition", "text": "転換テキスト"}
  ]
}

===判定ルール===

【タイトルブロック】
- 冒頭の『タイトル』行 → title
- 「第N稿」形式 → subtitle
- 日付形式（YYYY/MM/DD等）→ date
- タイトルと日付の間の人名 → author

【登場人物】
- 「【登場人物】」以降の「名前（年齢）　説明」形式の行 → characters
- キャラ名のスペース（全角・半角）は除去して格納（例:「小川　裕　太」→「小川裕太」）

【話数ヘッダー】
- 「【N話】」「【第N話】」→ episode_header

【シーン柱】
- 「N.  場所（時間）」「N．場所（時間）」（全角・半角数字両対応）→ scene_heading
- ○や◯が付いている場合も同様に処理
- numberは数字のみ抽出（「1」「２」など）
- timeが記載されていない場合はnullまたは省略

【台詞】
- 「キャラ名「台詞」」形式 → dialogue
- キャラ名のスペースは除去して格納
- 「名前Ｍ」「名前M」はモノローグとして処理（characterにそのまま格納）
- 「名前の声」もdialogueとして処理
- lineにカギ括弧を含めない

【転換・テロップ】
- 「×　×　×」「×　　　　×　　　　×」等（全角スペース数不問）→ transition
- 「Ｔ　『テロップ』」「Ｔ『テロップ』」→ transition

【ト書き】
- 上記以外の地の文・描写・カメラ指定 → action

【除外】
- 空行・区切り線のみの行は除外`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "テキストが空です" }, { status: 400 });
    }
    if (text.length > 50000) {
      return NextResponse.json(
        { error: "テキストが長すぎます（50,000文字以内）" },
        { status: 400 }
      );
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    const raw = await stream.finalText();
    const cleaned = raw
      .replace(/```json|```/g, "")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "解析に失敗しました" },
      { status: 500 }
    );
  }
}
