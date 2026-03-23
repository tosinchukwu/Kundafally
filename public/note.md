# KUNDA FALL

A high-stakes strategy quiz game built with React, Three.js, and Framer Motion. Protect your vault across 6 rounds of increasing difficulty.

## 🎮 How to Play

### 01. The Objective
You begin with **$1,000**. Your goal is to keep as much as possible through **6 Rounds** of high-stakes questioning.

### 02. Stable vs Void
- **Stable Vault**: Money **NOT** placed on platforms is 100% safe. It stays with you regardless of the answer.
- **The Void (Risk)**: Money placed on platforms is at risk. If the answer is wrong, the trapdoors open and those tokens fall into the void.

### 03. Deployment Rules
- **Stakes**: Minimum bet is **$50**. Maximum bet is **$1,000** per platform.
- **Precision**: All bets must be in **multiples of $50**.
- **Timing**: You have exactly **45 Seconds** per round to distribute your tokens across the options (A, B, C, D).

### 04. Game Over
If your balance falls below **$50** or you fail to place a valid bet before the timer expires, the session ends.

---

## 🛠 Tech Stack

- **Framework**: React + Vite
- **3D Engine**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS + Tailwind
- **State Management**: React Context + Hooks

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open the game: `http://localhost:5173`

## 💎 Features

- **Dynamic 3D Environment**: Interactive platforms and falling physics.
- **Vault Centric UI**: Real-time balance reconciliation with "stable" and "risk" zones.
- **Local History**: Tracks your last 20 game sessions in local storage.
- **Visual Feedback**: Coins rise to the vault on wins and fall to the void on losses.

## 📊 Scoring & Strategy

For a detailed breakdown of the mathematical formulas, hedging strategies, and elimination rules, please see:
[SCORING_STRATEGY.md](/SCORING_STRATEGY.md)
