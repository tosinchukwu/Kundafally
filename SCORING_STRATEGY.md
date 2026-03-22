# KUNDA FALL: Scoring & Game Mechanics Strategy

This document outlines the core mathematical and strategic design of the **Kunda Fall** game session. Developers should refer to this when modifying the `GameContext` reducer or the `HUD` / `Results` components.

---

## 1. The "Stable Vault" Philosophy
The game is built on a **Split-Risk** model. Instead of a binary "All-In" bet, the player manages a portfolio of tokens.

- **Stable Vault (The Reserve)**: Any tokens NOT placed on a platform are considered "Stable". They are 100% immune to the void.
- **The Void (The Stake)**: Tokens placed on platforms (A, B, C, D) are at risk.

### Mathematical Formula (Per Round)
At the end of each round (the "Reveal"):
$$NewBalance = (Tokens_{CorrectPlatform}) + (Tokens_{StableVault})$$

*Example:*
- Starting: $1,000
- Bet on A: $200
- Bet on B: $300
- Stable Vault: $500
- **If A is correct**: Player keeps $200 + $500 = **$700**.
- **If C is correct**: Player keeps **$500** (B $300 and A $200 fall into the void).

---

## 2. Session Scoring (6 Rounds)
The final "Vault Reconciliation" (Total Score) is a **Cumulative Performance Index**. It is calculated as the rolling sum of the balance at the end of every round.

$$TotalScore = \sum_{Round=1}^{6} Balance_{RoundEnd}$$

- **Perfect Game**: Finishing all 6 rounds with $1,000 kept each time results in a score of **$6,000**.
- **Consistency Bonus**: This system rewards players who play conservatively and keep their vault high across all rounds, rather than just surviving the last round.

---

## 3. Deployment Constraints
To maintain the "Emerald Night" premium gaming feel, several constraints are hardcoded into the validation logic:

1.  **Stakes Boundary**: $50 Minimum / $1,000 Maximum per platform.
2.  **The $50 Rule**: All bets and increments MUST be multiples of $50.
3.  **The 45s Protocol**: A 45-second timer enforces "Analysis Paralysis" prevention.
4.  **Inactivity Penalty**: If `totalDistributed < $50` when the timer expires, the session is terminated (`isEliminated = true`).

---

## 4. Elimination & Game Over
A session is terminated immediately if:
- The `Ending Balance` falls below the **Minimum Bet ($50)**.
- The player fails to lock a valid distribution before the **45s timer** expires.

*Note: In `GameContext.tsx`, any elimination triggers a shift from the `reveal` phase directly to the `results` phase (via `NEXT_QUESTION` check), bypassing further rounds.*
