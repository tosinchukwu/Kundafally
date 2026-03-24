import { describe, it, expect, vi } from "vitest";
import { gameReducer, GameState, MIN_BET } from "../context/GameContext";
import { Category } from "../data/quizData";

const mockCategories: Category[] = [
  {
    id: "cat1",
    name: "Category 1",
    icon: "1",
    questions: [
      { id: "q1", question: "Q1", options: [{ label: "A", text: "Opt A" }], correctAnswer: "A", difficulty: "easy" },
      { id: "q2", question: "Q2", options: [{ label: "A", text: "Opt A" }], correctAnswer: "A", difficulty: "medium" },
      { id: "q3", question: "Q3", options: [{ label: "A", text: "Opt A" }], correctAnswer: "A", difficulty: "hard" },
    ]
  },
  {
    id: "cat2",
    name: "Category 2",
    icon: "2",
    questions: [
      { id: "q4", question: "Q4", options: [{ label: "A", text: "Opt A" }], correctAnswer: "A", difficulty: "easy" },
      { id: "q5", question: "Q5", options: [{ label: "A", text: "Opt A" }], correctAnswer: "A", difficulty: "medium" },
      { id: "q6", question: "Q6", options: [{ label: "A", text: "Opt A" }], correctAnswer: "A", difficulty: "hard" },
    ]
  }
];

describe("Game Termination Logic", () => {
  it("should mark as eliminated if tokens fall below MIN_BET after LOCK_ANSWERS", () => {
    // Start game
    let state = gameReducer({} as any, { type: "START_GAME", categories: mockCategories, startingTokens: 1000 });
    
    // Distribute all tokens on a WRONG answer
    // In our mock, correctAnswer is always "A". Let's say we put it on "B" (if it existed) or just 0 on A.
    // The reducer uses the actual question's correctAnswer.
    
    // Simulate losing almost everything
    state.tokens = 100;
    state.distribution = { "B": 100 }; // Incorrect
    
    const newState = gameReducer(state, { type: "LOCK_ANSWERS" });
    
    expect(newState.tokens).toBe(0);
    expect(newState.isEliminated).toBe(true);
    expect(newState.phase).toBe("reveal");
  });

  it("should mark as eliminated if tokens are 50 (below 100) after LOCK_ANSWERS", () => {
    let state = gameReducer({} as any, { type: "START_GAME", categories: mockCategories, startingTokens: 1000 });
    
    // Manually adjust state to simulate a complex win/loss
    state.tokens = 150;
    state.distribution = { "B": 150 }; // Lose all 150
    
    const newState = gameReducer(state, { type: "LOCK_ANSWERS" });
    
    expect(newState.tokens).toBe(0);
    expect(newState.isEliminated).toBe(true);
  });

  it("should transition to results from NEXT_QUESTION if tokens < MIN_BET", () => {
    let state = gameReducer({} as any, { type: "START_GAME", categories: mockCategories, startingTokens: 1000 });
    
    state.tokens = 50; // Below 100
    state.currentQuestionIndex = 0;
    state.phase = "reveal";
    
    const newState = gameReducer(state, { type: "NEXT_QUESTION" });
    
    expect(newState.phase).toBe("results");
  });
});
