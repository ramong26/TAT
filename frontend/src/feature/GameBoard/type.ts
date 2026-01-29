import type { PlayMode } from "@/types/types";

export interface GameBoardProps {
  mode: PlayMode;
  controlScheme?: "ARROWS" | "WASD";
}
