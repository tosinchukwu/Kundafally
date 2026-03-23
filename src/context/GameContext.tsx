import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Category, Question } from "@/data/quizData";

export type GamePhase = "menu" | "category" | "playing" | "reveal" | "results";
export type Difficulty = "easy" | "medium" | "hard";

interface GameState {
  phase: GamePhase;
  tokens: number;
  startingTokens: number;
  sponsor: string;
  selectedCategories: Category[];
  currentCategoryIndex: number; // For simplicity in 3-question mode, we might not need this as much
  currentQuestionIndex: number; // 0, 1, 2
  distribution: Record<string, number>; // label -> tokens
  revealedAnswer: string | null;
  questionsAnswered: number;
  history: { question: string; correct: boolean; tokensLost: number; bonus: number }[];
  isEliminated: boolean;
  selectedPlatform: string | null;
  trapdoorsOpen: boolean;
  difficulty: Difficulty;
  currentTokenIndex: number;
  totalScore: number;
  lastWinAmount: number;
}

const TOKENS = ["BNB", "ETH", "BTC", "AVAX", "POL", "SOL"];

type GameAction =
  | { type: "START_GAME"; categories: Category[]; sponsor?: string }
  | { type: "DISTRIBUTE_TOKENS"; label: string; amount: number }
  | { type: "LOCK_ANSWERS" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET" }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SELECT_PLATFORM"; label: string | null }
  | { type: "SET_DISTRIBUTION"; label: string; amount: number }
  | { type: "OPEN_TRAPDOORS" };

const STARTING_TOKENS = 1000;
const MIN_BET = 100;
const BONUS_RATE = 0; // Removing bonus for now as per "equivalent to $1000" requirement

const initialState: GameState = {
  phase: "menu",
  tokens: STARTING_TOKENS,
  startingTokens: STARTING_TOKENS,
  sponsor: "KUNDAFALL",
  selectedCategories: [],
  currentCategoryIndex: 0,
  currentQuestionIndex: 0,
  distribution: {},
  revealedAnswer: null,
  questionsAnswered: 0,
  history: [],
  isEliminated: false,
  selectedPlatform: null,
  trapdoorsOpen: false,
  difficulty: "easy",
  currentTokenIndex: 0,
  totalScore: 0,
  lastWinAmount: 0,
};

function getCurrentQuestion(state: GameState): Question | null {
  // In the new mode, we have a flat list of 3 questions from selected categories
  // filtered by difficulty.
  // For simplicity, let's assume selectedCategories contains the questions we need
  const cat = state.selectedCategories[0]; // Logic refined in START_GAME
  if (!cat) return null;
  return cat.questions[state.currentQuestionIndex] || null;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      // Pick 1 Easy, 1 Medium, 1 Hard from the first 2 categories
      const cat1 = action.categories[0];
      const cat2 = action.categories[1];
      
      const getQuestions = (cat: Category) => {
        const easy = cat.questions.filter(q => q.difficulty === "easy").sort(() => Math.random() - 0.5).slice(0, 1);
        const med = cat.questions.filter(q => q.difficulty === "medium").sort(() => Math.random() - 0.5).slice(0, 1);
        const hard = cat.questions.filter(q => q.difficulty === "hard").sort(() => Math.random() - 0.5).slice(0, 1);
        return [...easy, ...med, ...hard];
      };

      const randomizedQuestions = [...getQuestions(cat1), ...getQuestions(cat2)];
      
      // We package these into a single "virtual" category for the game logic
      const virtualCategory: Category = {
        id: "game-session",
        name: "Current Quiz",
        icon: "🎮",
        questions: randomizedQuestions
      };

      return {
        ...initialState,
        phase: "playing",
        selectedCategories: [virtualCategory],
        difficulty: "easy", // Default start difficulty, will change per question but not used globally anymore
        sponsor: action.sponsor || "KUNDAFALL",
        tokens: STARTING_TOKENS,
        currentTokenIndex: Math.floor(Math.random() * TOKENS.length),
        totalScore: 0,
      };
    }

    case "DISTRIBUTE_TOKENS": {
      const currentDistributed = Object.values(state.distribution).reduce((a, b) => a + b, 0);
      const available = state.tokens - currentDistributed;
      const clampedAmount = Math.min(action.amount, available);
      if (clampedAmount <= 0 && !state.distribution[action.label]) return state;
      
      const newDist = { ...state.distribution };
      newDist[action.label] = (newDist[action.label] || 0) + clampedAmount;
      return { ...state, distribution: newDist };
    }

    case "SET_DISTRIBUTION": {
      const currentLabelAmount = state.distribution[action.label] || 0;
      const otherDistributed = Object.values(state.distribution).reduce((a, b) => a + b, 0) - currentLabelAmount;
      const availableTotal = state.tokens - otherDistributed;
      
      const clampedAmount = Math.max(0, Math.min(action.amount, availableTotal));
      
      const newDist = { ...state.distribution };
      if (clampedAmount === 0) {
        delete newDist[action.label];
      } else {
        newDist[action.label] = clampedAmount;
      }
      return { ...state, distribution: newDist };
    }

    case "LOCK_ANSWERS": {
      const totalDistributed = Object.values(state.distribution).reduce((a, b: any) => a + b, 0);
      const question = getCurrentQuestion(state);
      if (!question) return state;

      const correctLabel = question.correctAnswer;
      const tokensOnCorrect = state.distribution[correctLabel] || 0;
      const newTokens = tokensOnCorrect;
      
      // Eliminated if:
      // 1. Didn't make a valid attempt (totalDistributed < 50)
      // 2. OR final balance is below minimum bet
      const isEliminated = totalDistributed < MIN_BET || newTokens < MIN_BET;

      return {
        ...state,
        phase: "reveal",
        revealedAnswer: correctLabel,
        tokens: newTokens,
        isEliminated,
        selectedPlatform: null,
        questionsAnswered: state.questionsAnswered + 1,
        lastWinAmount: tokensOnCorrect,
        history: [
          ...state.history,
          {
            question: question.question,
            correct: tokensOnCorrect > 0,
            tokensLost: totalDistributed - tokensOnCorrect,
            bonus: 0,
          },
        ],
      };
    }

    case "NEXT_QUESTION": {
      const nextQ = state.currentQuestionIndex + 1;
      const newTotalScore = state.totalScore + state.tokens;

      if (nextQ < 6 && !state.isEliminated) {
        return {
          ...state,
          phase: "playing",
          currentQuestionIndex: nextQ,
          distribution: {},
          revealedAnswer: null,
          lastWinAmount: 0,
           // Keep same token for entire session
          totalScore: newTotalScore,
        };
      }

      return { ...state, phase: "results", selectedPlatform: null, totalScore: newTotalScore };
    }

    case "RESET":
      return initialState;

    case "SET_PHASE":
      return { ...state, phase: action.phase, selectedPlatform: null, trapdoorsOpen: false };

    case "SELECT_PLATFORM":
      return { ...state, selectedPlatform: action.label };

    case "OPEN_TRAPDOORS":
      return { ...state, trapdoorsOpen: true };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  currentQuestion: Question | null;
  currentToken: string;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const currentQuestion = getCurrentQuestion(state);
  const currentToken = TOKENS[state.currentTokenIndex];

  return (
    <GameContext.Provider value={{ state, dispatch, currentQuestion, currentToken }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
