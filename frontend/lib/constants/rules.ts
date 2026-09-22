export interface RuleItem {
  label: string;
}

export interface RuleCategory {
  title: "DO" | "ASK FIRST" | "DON'T";
  type: "do" | "ask" | "dont";
  items: string[];
}

export const RULES: RuleCategory[] = [
  {
    title: "DO",
    type: "do",
    items: [
      "Original Character",
      "FanArt",
      "Couple",
      "Kemonomimi",
      "Simple Background",
    ],
  },
  {
    title: "ASK FIRST",
    type: "ask",
    items: ["Animal", "Furry"],
  },
  {
    title: "DON'T",
    type: "dont",
    items: [
      "NSFW",
      "Gore",
      "Mecha",
      "Many People",
      "Complicated Background",
      "Monsters",
    ],
  },
];