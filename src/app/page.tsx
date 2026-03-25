"use client";

import { useState, useEffect, useRef } from "react";

type Message = { role: "user" | "model"; parts: { text: string }[] };
type GameState = { narrative: string; choices: string[]; environment: string; minigame?: string };

// --- Minigame Components ---

function DecoderMinigame({ onSolve }: { onSolve: () => void }) {
  const [code, setCode] = useState(Math.floor(100 + Math.random() * 900).toString());
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("Enter 3-digit combination");

  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess === code) {
      setFeedback("ACCESS GRANTED.");
      setTimeout(onSolve, 1000);
    } else if (guess > code) {
      setFeedback("ERR: TOO HIGH");
    } else {
      setFeedback("ERR: TOO LOW");
    }
    setGuess("");
  };

  return (
    <div className="minigame-container decoder-machine animate-fade-in">
      <h3 className="text-[#8b0000] font-mono tracking-widest uppercase text-xl mb-4">Secure Terminal</h3>
      <div className="bg-[#111] p-4 font-mono text-[#00ff00] text-center mb-4 border border-[#333]">
        {feedback}
      </div>
      <form onSubmit={submitGuess} className="flex gap-2">
        <input 
          type="number" 
          value={guess} 
          onChange={e => setGuess(e.target.value.slice(0, 3))}
          className="bg-black text-[#00ff00] border border-[#333] px-4 py-2 w-full text-center font-mono text-xl"
          placeholder="***"
          maxLength={3}
          autoFocus
        />
        <button type="submit" className="bg-[#333] text-white px-4 hover:bg-[#8b0000] transition">ENTER</button>
      </form>
    </div>
  );
}

function WiresMinigame({ onSolve }: { onSolve: () => void }) {
  const sequence = ["red", "blue", "green"];
  const [currentStep, setCurrentStep] = useState(0);
  const [failed, setFailed] = useState(false);

  const cutWire = (color: string) => {
    if (color === sequence[currentStep]) {
      if (currentStep === 2) {
        onSolve();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      setFailed(true);
      setTimeout(() => { setFailed(false); setCurrentStep(0); }, 1000);
    }
  };

  return (
    <div className="minigame-container animate-fade-in">
      <h3 className="text-white font-mono uppercase tracking-widest text-xl mb-4">Defuse Mechanism</h3>
      {failed ? (
        <div className="text-red-500 font-bold animate-pulse text-center p-4 bg-red-900 bg-opacity-20 border border-red-900">
          SHORT CIRCUIT DETECTED. REBOOTING.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-gray-400 text-sm">Sequence required to bypass lock mechanism.</p>
          <div className="flex justify-between px-8 py-4 bg-[#111] border border-[#333]">
            {["blue", "green", "red"].map(color => (
              <div 
                key={color}
                onClick={() => cutWire(color)}
                className="w-4 h-32 cursor-pointer shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: color, opacity: currentStep > sequence.indexOf(color) ? 0.3 : 1 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main App ---

export default function Game() {
  const [history, setHistory] = useState<Message[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, gameState]);

  const sendAction = async (actionText: string) => {
    if (!actionText.trim() || loading) return;

    setLoading(true);
    setCustomInput("");
    
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: actionText })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      let aiResponseText = data.result || "{}";
      aiResponseText = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const newGameState = JSON.parse(aiResponseText) as GameState;

      setGameState(newGameState);

      setHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: actionText }] },
        { role: "model", parts: [{ text: JSON.stringify(newGameState) }] }
      ]);
    } catch (err: any) {
      console.error(err);
      alert("Error communicating with Game Master. Is your API key set properly? " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    sendAction("I wake up in a dark room. I have no memory of how I got here.");
  };

  const currentTheme = gameState?.environment?.toLowerCase() || "dark";
  const isBloody = currentTheme.includes("blood") || currentTheme.includes("red");
  const isFlickering = currentTheme.includes("flickering") || currentTheme.includes("broken");

  const minigame = gameState?.minigame && gameState.minigame !== "none" ? gameState.minigame : null;

  const bgImageUrl = gameState?.environment 
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(gameState.environment + ' photorealistic, dark horror cinematic lighting')}?width=1920&height=1080&nologo=true`
    : "";

  return (
    <main 
      className="game-container"
      style={{
        backgroundImage: bgImageUrl ? `url('${bgImageUrl}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#050505',
        transition: 'background-image 2s ease-in-out'
      }}
    >
      <div className="crt-effect" />
      <div className="vignette-overlay" />
      <div className="particles-layer" />
      
      {!started ? (
        <div className="start-screen">
          <h1 className="game-title glitch" data-text="The Awakening">The Awakening</h1>
          <button onClick={handleStart} className="btn-primary">
            Enter Patient Zero
          </button>
        </div>
      ) : (
        <div className="game-ui relative z-10">
          <div className="narrative-container">
            {gameState ? (
              <div className="fadeIn">
                <p className="narrative-text">{gameState.narrative}</p>
                {minigame && (
                   <div className="mt-8 border-t border-[#8b0000] pt-8">
                     {minigame === 'decoder' && <DecoderMinigame onSolve={() => sendAction("I successfully hacked the terminal.")} />}
                     {minigame === 'wires' && <WiresMinigame onSolve={() => sendAction("I bypassed the wiring mechanism.")} />}
                     {minigame === 'sequence' && <DecoderMinigame onSolve={() => sendAction("I cracked the lock.")} />}
                   </div>
                )}
              </div>
            ) : (
              <div className="loading-text">Connecting to the void...</div>
            )}
            {loading && gameState && (
              <p className="thinking-text">The shadows are shifting...</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {gameState && !loading && !minigame && (
            <div className="controls-overlay">
              <div className="controls-container">
                <div className="choices-list">
                  {gameState.choices?.map((choice, i) => (
                    <button key={i} onClick={() => sendAction(choice)} className="choice-btn">
                      &gt; {choice}
                    </button>
                  ))}
                </div>
                <div className="custom-input-container">
                  <span className="carrot">&gt;</span>
                  <input 
                    type="text" 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendAction(customInput)}
                    placeholder="Type your own action..."
                    className="custom-input"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
