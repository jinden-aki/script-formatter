export type SceneItemType =
  | "episode_header"
  | "scene_heading"
  | "action"
  | "dialogue"
  | "transition";

export interface EpisodeHeader {
  type: "episode_header";
  text: string;
}

export interface SceneHeading {
  type: "scene_heading";
  number: string;
  location: string;
  time?: string;
}

export interface Action {
  type: "action";
  text: string;
}

export interface Dialogue {
  type: "dialogue";
  character: string;
  line: string;
}

export interface Transition {
  type: "transition";
  text: string;
}

export type SceneItem =
  | EpisodeHeader
  | SceneHeading
  | Action
  | Dialogue
  | Transition;

export interface ParsedScript {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  characters: { name: string; desc: string }[];
  scenes: SceneItem[];
}
