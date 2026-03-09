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
  "characters": [{"name": "キャラ名", "desc": "説明"}],
  "scenes": [
    {"type": "episode_header", "text": "【N話】"},
    {"type": "scene_heading", "number": "1", "location": "場所名", "time": "時間帯"},
    {"type": "action", "text": "ト書き本文"},
    {"type": "dialogue", "character": "キャラ名", "line": "台詞（カギ括弧なし）"},
    {"type": "transition", "text": "×　　×　　×"}
  ]
}

判定ルール:
- 「【N話】」「第N話」→ episode_header
- 数字/◯で始まる「場所（時間）」形式の行 → scene_heading（numberは数字のみ）
- 「キャラ名「台詞」」→ dialogue（lineにカギ括弧を含めない）
- 「Ｔ　『...』」「×　×　×」→ transition
- モノローグ（Ｍ）・声つきキャラもdialogueで処理
- それ以外の地の文 → action
- 登場人物リストは charactersに格納`;

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

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "解析に失敗しました" },
      { status: 500 }
    );
  }
}
