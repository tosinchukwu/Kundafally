export interface Question {
  id: string;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  questions: Question[];
}

export const categories: Category[] = [
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    questions: [
      {
        id: "sp1",
        question: "Which country hosted the 2010 FIFA World Cup?",
        options: [
          { label: "A", text: "Brazil" },
          { label: "B", text: "Germany" },
          { label: "C", text: "South Africa" },
          { label: "D", text: "Russia" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sp2",
        question: "Which tennis player has won the most Grand Slam men's singles titles?",
        options: [
          { label: "A", text: "Roger Federer" },
          { label: "B", text: "Novak Djokovic" },
          { label: "C", text: "Rafael Nadal" },
          { label: "D", text: "Andy Murray" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sp3",
        question: "In basketball, how many points is a shot worth from beyond the three-point line?",
        options: [
          { label: "A", text: "2" },
          { label: "B", text: "3" },
          { label: "C", text: "4" },
          { label: "D", text: "5" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    questions: [
      {
        id: "en1",
        question: "Which director created the movies Inception and Interstellar?",
        options: [
          { label: "A", text: "Christopher Nolan" },
          { label: "B", text: "Steven Spielberg" },
          { label: "C", text: "James Cameron" },
          { label: "D", text: "Ridley Scott" },
        ],
        correctAnswer: "A",
      },
      {
        id: "en2",
        question: "Which TV series features the fictional continent of Westeros?",
        options: [
          { label: "A", text: "The Witcher" },
          { label: "B", text: "Vikings" },
          { label: "C", text: "Game of Thrones" },
          { label: "D", text: "The Last Kingdom" },
        ],
        correctAnswer: "C",
      },
      {
        id: "en3",
        question: "Which actress played Black Widow in the Marvel movies?",
        options: [
          { label: "A", text: "Jennifer Lawrence" },
          { label: "B", text: "Scarlett Johansson" },
          { label: "C", text: "Gal Gadot" },
          { label: "D", text: "Brie Larson" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "🔷",
    questions: [
      {
        id: "eth1",
        question: "Which programming language is most commonly used for writing Ethereum smart contracts?",
        options: [
          { label: "A", text: "Rust" },
          { label: "B", text: "Solidity" },
          { label: "C", text: "Python" },
          { label: "D", text: "Go" },
        ],
        correctAnswer: "B",
      },
      {
        id: "eth2",
        question: "What is the name of the Ethereum upgrade that moved the network to Proof-of-Stake?",
        options: [
          { label: "A", text: "The Fusion" },
          { label: "B", text: "The Shift" },
          { label: "C", text: "The Merge" },
          { label: "D", text: "The Upgrade" },
        ],
        correctAnswer: "C",
      },
      {
        id: "eth3",
        question: "Which unit is commonly used to measure very small amounts of Ether for gas fees?",
        options: [
          { label: "A", text: "Satoshi" },
          { label: "B", text: "Gwei" },
          { label: "C", text: "NanoETH" },
          { label: "D", text: "WeiCoin" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: "🟠",
    questions: [
      {
        id: "btc1",
        question: "What is the maximum supply of Bitcoin?",
        options: [
          { label: "A", text: "18 million" },
          { label: "B", text: "21 million" },
          { label: "C", text: "25 million" },
          { label: "D", text: "Unlimited" },
        ],
        correctAnswer: "B",
      },
      {
        id: "btc2",
        question: "What is the smallest unit of Bitcoin called?",
        options: [
          { label: "A", text: "Bit" },
          { label: "B", text: "MicroBTC" },
          { label: "C", text: "Satoshi" },
          { label: "D", text: "NanoCoin" },
        ],
        correctAnswer: "C",
      },
      {
        id: "btc3",
        question: "What mechanism secures the Bitcoin network?",
        options: [
          { label: "A", text: "Proof of Stake" },
          { label: "B", text: "Proof of Authority" },
          { label: "C", text: "Proof of Work" },
          { label: "D", text: "Delegated Proof" },
        ],
        correctAnswer: "C",
      },
    ],
  },
  {
    id: "solana",
    name: "Solana",
    icon: "🔵",
    questions: [
      {
        id: "sol1",
        question: "Solana achieves high throughput partly because of which time-keeping innovation?",
        options: [
          { label: "A", text: "Proof of Authority" },
          { label: "B", text: "Proof of History" },
          { label: "C", text: "Proof of Burn" },
          { label: "D", text: "Proof of Trust" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sol2",
        question: "Which programming language is commonly used to build programs on Solana?",
        options: [
          { label: "A", text: "Solidity" },
          { label: "B", text: "Rust" },
          { label: "C", text: "Java" },
          { label: "D", text: "PHP" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sol3",
        question: "What is the native token of Solana?",
        options: [
          { label: "A", text: "SOL" },
          { label: "B", text: "SLN" },
          { label: "C", text: "SONA" },
          { label: "D", text: "SLM" },
        ],
        correctAnswer: "A",
      },
    ],
  },
  {
    id: "base",
    name: "Base",
    icon: "🔵",
    questions: [
      {
        id: "base1",
        question: "Which company launched the Base blockchain?",
        options: [
          { label: "A", text: "Binance" },
          { label: "B", text: "Coinbase" },
          { label: "C", text: "Kraken" },
          { label: "D", text: "Circle" },
        ],
        correctAnswer: "B",
      },
      {
        id: "base2",
        question: "Base is built using technology from which Ethereum scaling stack?",
        options: [
          { label: "A", text: "OP Stack" },
          { label: "B", text: "Cosmos SDK" },
          { label: "C", text: "Avalanche Subnets" },
          { label: "D", text: "Polygon SDK" },
        ],
        correctAnswer: "A",
      },
      {
        id: "base3",
        question: "Base is designed mainly for:",
        options: [
          { label: "A", text: "Gaming only" },
          { label: "B", text: "Onchain applications and scaling Ethereum" },
          { label: "C", text: "Bitcoin mining" },
          { label: "D", text: "Private enterprise chains" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "🔵",
    questions: [
      {
        id: "pol1",
        question: "Polygon was previously called:",
        options: [
          { label: "A", text: "Plasma Network" },
          { label: "B", text: "Matic Network" },
          { label: "C", text: "LayerNet" },
          { label: "D", text: "ChainScale" },
        ],
        correctAnswer: "B",
      },
      {
        id: "pol2",
        question: "Polygon mainly functions as:",
        options: [
          { label: "A", text: "Bitcoin sidechain" },
          { label: "B", text: "Ethereum scaling solution" },
          { label: "C", text: "NFT marketplace" },
          { label: "D", text: "Stablecoin network" },
        ],
        correctAnswer: "B",
      },
      {
        id: "pol3",
        question: "What is the main token used in the Polygon ecosystem?",
        options: [
          { label: "A", text: "POLY" },
          { label: "B", text: "MATIC" },
          { label: "C", text: "PGN" },
          { label: "D", text: "PLG" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "sui",
    name: "Sui",
    icon: "🌊",
    questions: [
      {
        id: "sui1",
        question: "Which programming language is primarily used to develop smart contracts on Sui?",
        options: [
          { label: "A", text: "Solidity" },
          { label: "B", text: "Rust" },
          { label: "C", text: "Move" },
          { label: "D", text: "Go" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sui2",
        question: "Which company originally developed the Sui blockchain?",
        options: [
          { label: "A", text: "Mysten Labs" },
          { label: "B", text: "Offchain Labs" },
          { label: "C", text: "Solana Labs" },
          { label: "D", text: "Polygon Labs" },
        ],
        correctAnswer: "A",
      },
      {
        id: "sui3",
        question: "Sui is designed mainly to improve what aspect of blockchain performance?",
        options: [
          { label: "A", text: "Privacy transactions" },
          { label: "B", text: "Parallel transaction processing and scalability" },
          { label: "C", text: "Mining rewards" },
          { label: "D", text: "Stablecoin issuance" },
        ],
        correctAnswer: "B",
      },
    ],
  },
];
