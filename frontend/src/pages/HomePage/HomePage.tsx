import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMatrixRain from "../../shared/hooks/useMatrixRain";

function App() {
  const text = "HI!\n\nIT'S TERMINAL TETRIS!";
  const [displayed, setDisplayed] = useState("");

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

  // // Matrix rain effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain({ canvasRef, speed: 4, text: "|" });

  // Navigation handlerss
  const navigate = useNavigate();
  const handleSinglePlay = () => {
    navigate("/singleplay");
  };
  const handleMultiPlay = () => {
    navigate("/multiplay");
  };
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
          <button
            className="border-2 border-green-500 bg-[#0c1610] text-[#00ff00] px-8 py-3 text-lg font-mono rounded-lg shadow-[0_0_8px_#00ff00] font-bold  hover:bg-[#00ff00] hover:text-[#00fff6]"
            onClick={handleSinglePlay}
          >
            SINGLE PLAY
          </button>
          <button
            className="border-2 border-green-500 bg-[#0c1610] text-[#00ff00] px-8 py-3 text-lg font-mono rounded-lg shadow-[0_0_8px_#00ff00] font-bold  hover:bg-[#00ff00] hover:text-[#00fff6]"
            onClick={handleMultiPlay}
          >
            MULTI PLAY
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
