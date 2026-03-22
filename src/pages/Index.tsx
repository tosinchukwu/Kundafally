import React from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import MenuScreen from "@/components/MenuScreen";
import SelectionScreen from "@/components/SelectionScreen";
import GameplayScreen from "@/components/GameplayScreen";
import RevealScreen from "@/components/RevealScreen";
import ResultsScreen from "@/components/ResultsScreen";
import GameScene from "@/components/three/GameScene";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("REACT CRASH:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-950 p-10 text-white">
          <h1 className="text-3xl font-black mb-4 italic">KUNDA FALL: ERROR</h1>
          <div className="glass-card p-6 border-red-500/30 max-w-2xl w-full">
            <p className="text-red-400 font-display mb-2 font-bold">Something went wrong during rendering.</p>
            <pre className="p-4 bg-black/40 rounded-lg text-[10px] font-mono mb-6 overflow-auto max-h-60 text-white/80 whitespace-pre-wrap">
              {this.state.error?.message}
              {"\n\nStack:\n"}
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-white text-black py-4 rounded-xl font-display font-black hover:bg-white/90 transition"
            >
              RELOAD SESSION
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GameRouter() {
  const { state, dispatch } = useGame();

  console.log("GameRouter State:", { phase: state.phase, qIdx: state.currentQuestionIndex });
  // In our new logic, all 3 questions are in the first (and only) selected category
  const currentCategory = state.selectedCategories[0];
  const currentQuestion = currentCategory?.questions[state.currentQuestionIndex];
  console.log("Current Question ID:", currentQuestion?.id);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      {/* Persistent 3D Background */}
      <div className="absolute inset-0 z-0">
        <GameScene
          phase={state.phase}
          distribution={state.distribution}
          options={currentQuestion?.options || []}
          revealedAnswer={state.revealedAnswer}
          trapdoorPlatforms={(state.trapdoorsOpen && state.revealedAnswer && currentQuestion) ? currentQuestion.options.filter(o => o.label !== state.revealedAnswer).map(o => o.label) : []}
          onPlatformClick={(label) => state.phase === "playing" && dispatch({ type: "SELECT_PLATFORM", label: state.selectedPlatform === label ? null : label })}
          selectedPlatform={state.selectedPlatform}
        />
      </div>

      <div className="relative z-10 min-h-screen w-full pointer-events-none bg-transparent">
        {(() => {
          switch (state.phase) {
            case "menu":
              return <MenuScreen />;
            case "category":
              return <SelectionScreen />;
            case "playing":
              return <GameplayScreen />;
            case "reveal":
              return <RevealScreen />;
            case "results":
              return <ResultsScreen />;
            default:
              return <MenuScreen />;
          }
        })()}
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <ErrorBoundary>
        <GameRouter />
      </ErrorBoundary>
    </GameProvider>
  );
}
