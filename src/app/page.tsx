"use client";

import { useState, useEffect, useRef } from "react";

type Message = { role: "user" | "model"; parts: { text: string }[] };
type GameState = { narrative: string; choices: string[]; environment: string };

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
  
  return (
    <main className="game-container" style={{ backgroundColor: isBloody ? "var(--primary-alt)" : "var(--bg-color)" }}>
      <div className="crt-effect" />
      
      {!started ? (
        <div className="start-screen">
          <h1 className="game-title">The Awakening</h1>
          <button onClick={handleStart} className="btn-primary">
            Enter Patient Zero
          </button>
        </div>
      ) : (
        <div className="game-ui">
          <div className="narrative-container">
            {gameState ? (
              <p className="narrative-text">{gameState.narrative}</p>
            ) : (
              <div className="loading-text">Connecting to the void...</div>
            )}
            {loading && gameState && (
              <p className="thinking-text">The shadows are shifting...</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {gameState && !loading && (
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
