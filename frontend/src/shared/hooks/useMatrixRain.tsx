import { useEffect, type RefObject } from "react";

interface UseMatrixRainProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  speed?: number;
  text?: string;
}

export default function useMatrixRain({
  canvasRef,
  speed = 1,
  text = "'",
}: UseMatrixRainProps) {
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const raindrops: { x: number; y: number; speed: number }[] = [];

    const createRaindrop = () => {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: 0,
        speed: Math.random() * speed,
      });
    };

    const update = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff00";
      ctx.font = "16px monospace";

      raindrops.forEach((drop) => {
        ctx.fillText(text, drop.x, drop.y);
        drop.y += drop.speed;
      });

      for (let i = raindrops.length - 1; i >= 0; i--) {
        if (raindrops[i].y > canvas.height) {
          raindrops.splice(i, 1);
        }
      }
    };

    const resize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const interval = setInterval(() => {
      if (raindrops.length < 100) {
        createRaindrop();
      }
      update();
    }, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, speed, text]);
}
