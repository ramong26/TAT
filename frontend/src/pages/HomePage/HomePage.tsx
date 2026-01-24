import { useEffect, useRef, useState } from "react";

function App() {
  const text = "HI!\n\nIT'S TERMINAL TETRIS!";
  const [displayed, setDisplayed] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const raindrops: { x: number; y: number; speed: number; length: number }[] =
      [];

    const creaateRaindrop = () => {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: 0,
        speed: 2 + Math.random() * 10,
        length: 10 + Math.random() * 20,
      });
    };

    const update = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff00";
      ctx.font = "16px monospace";

      raindrops.forEach((drop) => {
        ctx.fillText("|", drop.x, drop.y);
        drop.y += drop.speed;
      });

      for (let i = raindrops.length - 1; i >= 0; i--) {
        if (raindrops[i].y > canvas.height) {
          raindrops.splice(i, 1);
        }
      }
    };

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const interval = setInterval(() => {
      if (raindrops.length < 100) {
        creaateRaindrop();
      }
      update();
    }, 30);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 whitespace-pre drop-shadow-[0_0_8px_#00ff00] text-center text-green-400 font-mono">
          {displayed}
        </h1>

        <div className="flex gap-6 mt-8 justify-center">
          <button className="border-2 border-green-500 bg-[#0c1610] text-[#00ff00] px-8 py-3 text-lg font-mono rounded-lg shadow-[0_0_8px_#00ff00] font-bold  hover:bg-[#00ff00] hover:text-[#00fff6]">
            SINGLE PLAY
          </button>
          <button className="border-2 border-green-500 bg-[#0c1610] text-[#00ff00] px-8 py-3 text-lg font-mono rounded-lg shadow-[0_0_8px_#00ff00] font-bold  hover:bg-[#00ff00] hover:text-[#00fff6]">
            MULTI PLAY
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
