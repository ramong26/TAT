export interface PlayerPanelProps {
  title: string;
  ready: boolean;
  score: number;
  name: string;
  onReadyChange: (ready: boolean) => void;
}
