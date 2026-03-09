import { SceneItem } from "./types";
import { HEIGHT_WEIGHT, PAGE_HEIGHT_LIMIT } from "./constants";

function getItemWeight(item: SceneItem): number {
  const base = HEIGHT_WEIGHT[item.type] ?? 2.0;
  if (item.type === "action" || item.type === "dialogue") {
    const text = item.type === "action" ? item.text : item.line;
    const lineCount = Math.ceil(text.length / 28);
    return base * Math.max(1, lineCount);
  }
  return base;
}

export function paginateScenes(scenes: SceneItem[]): SceneItem[][] {
  const pages: SceneItem[][] = [];
  let currentPage: SceneItem[] = [];
  let currentWeight = 0;

  for (const item of scenes) {
    const weight = getItemWeight(item);

    if (currentWeight + weight > PAGE_HEIGHT_LIMIT && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentWeight = 0;
    }

    currentPage.push(item);
    currentWeight += weight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
