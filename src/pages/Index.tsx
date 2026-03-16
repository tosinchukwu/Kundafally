import { GameProvider, useGame } from "@/context/GameContext";
import MenuScreen from "@/components/MenuScreen";
import CategorySelect from "@/components/CategorySelect";
import GameplayScreen from "@/components/GameplayScreen";
import RevealScreen from "@/components/RevealScreen";
import ResultsScreen from "@/components/ResultsScreen";

function GameRouter() {
  const { state } = useGame();

  console.log("Current Game Phase:", state.phase);
  
  switch (state.phase) {
    case "menu":
      return <MenuScreen />;
    case "category":
      return <CategorySelect />;
    case "playing":
      return <GameplayScreen />;
    case "reveal":
      return <RevealScreen />;
    case "results":
      return <ResultsScreen />;
    default:
      return <MenuScreen />;
  }
}

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
