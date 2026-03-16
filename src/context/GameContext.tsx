import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Category, Question } from "@/data/quizData";

export type GamePhase = "menu" | "category" | "playing" | "reveal" | "results";

interface GameState {
  phase: GamePhase;
  tokens: number;
  startingTokens: number;
  sponsor: string;
  selectedCategories: Category[];
  currentCategoryIndex: number;
  currentQuestionIndex: number;
  distribution: Record<string, number>; // label -> tokens
  revealedAnswer: string | null;
  questionsAnswered: number;
  history: { question: string; correct: boolean; tokensLost: number; bonus: number }[];
  isEliminated: boolean;
  selectedPlatform: string | null;
  trapdoorsOpen: boolean;
}

type GameAction =
  | { type: "START_GAME"; categories: Category[]; sponsor?: string }
  | { type: "DISTRIBUTE_TOKENS"; label: string; amount: number }
  | { type: "LOCK_ANSWERS" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET" }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SELECT_PLATFORM"; label: string | null }
  | { type: "OPEN_TRAPDOORS" };

const STARTING_TOKENS = 1000;
const BONUS_RATE = 0.1;

const initialState: GameState = {
  phase: "menu",
  tokens: STARTING_TOKENS,
  startingTokens: STARTING_TOKENS,
  sponsor: "BASE",
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
};

function getCurrentQuestion(state: GameState): Question | null {
  const cat = state.selectedCategories[state.currentCategoryIndex];
  if (!cat) return null;
  return cat.questions[state.currentQuestionIndex] || null;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const randomizedCategories = action.categories.map(cat => ({
        ...cat,
        questions: [...cat.questions].sort(() => Math.random() - 0.5)
      }));
      return {
        ...initialState,
        phase: "playing",
        selectedCategories: randomizedCategories,
        sponsor: action.sponsor || "BASE",
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

    case "LOCK_ANSWERS": {
      const question = getCurrentQuestion(state);
      if (!question) return state;

      const correctLabel = question.correctAnswer;
      const tokensOnCorrect = state.distribution[correctLabel] || 0;
      const totalDistributed = Object.values(state.distribution).reduce((a, b) => a + b, 0);
      const tokensLost = totalDistributed - tokensOnCorrect;
      const undistributed = state.tokens - totalDistributed;
      
      // If no tokens on correct answer, all distributed tokens are lost
      const remainingTokens = undistributed + tokensOnCorrect;
      const isEliminated = remainingTokens === 0;
      const bonus = isEliminated ? 0 : Math.floor(remainingTokens * BONUS_RATE);
      const newTokens = remainingTokens + bonus;

      return {
        ...state,
        phase: "reveal",
        revealedAnswer: correctLabel,
        tokens: newTokens,
        isEliminated,
        selectedPlatform: null,
        questionsAnswered: state.questionsAnswered + 1,
        history: [
          ...state.history,
          {
            question: question.question,
            correct: tokensOnCorrect > 0,
            tokensLost,
            bonus,
          },
        ],
      };
    }

    case "NEXT_QUESTION": {
      if (state.isEliminated) {
        return { ...state, phase: "results" };
      }

      const cat = state.selectedCategories[state.currentCategoryIndex];
      const nextQ = state.currentQuestionIndex + 1;

      if (nextQ < cat.questions.length) {
        return {
          ...state,
          phase: "playing",
          currentQuestionIndex: nextQ,
          distribution: {},
          revealedAnswer: null,
        };
      }

      const nextCat = state.currentCategoryIndex + 1;
      if (nextCat < state.selectedCategories.length) {
        return {
          ...state,
          phase: "playing",
          currentCategoryIndex: nextCat,
          currentQuestionIndex: 0,
          distribution: {},
          revealedAnswer: null,
        };
      }

      return { ...state, phase: "results", selectedPlatform: null };
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
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const currentQuestion = getCurrentQuestion(state);

  return (
    <GameContext.Provider value={{ state, dispatch, currentQuestion }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
