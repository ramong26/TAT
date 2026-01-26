type PlayMode = "SINGLE" | "MULTI";

export interface PlayerPanelProps {
  mode: PlayMode;
  title: string;
  ready: boolean;
  score: number;
  name: string;
  onReadyChange: (ready: boolean) => void;
  countdown?: number | null;
}
