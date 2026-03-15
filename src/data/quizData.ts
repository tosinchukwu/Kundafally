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
      {
        id: "sp4",
        question: "Which athlete holds the world record for the 100m sprint?",
        options: [
          { label: "A", text: "Tyson Gay" },
          { label: "B", text: "Yohan Blake" },
          { label: "C", text: "Usain Bolt" },
          { label: "D", text: "Justin Gatlin" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sp5",
        question: "In which sport is the 'Davis Cup' contested?",
        options: [
          { label: "A", text: "Golf" },
          { label: "B", text: "Tennis" },
          { label: "C", text: "Cricket" },
          { label: "D", text: "Rugby" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sp6",
        question: "How many players are on a standard soccer team on the field at once?",
        options: [
          { label: "A", text: "9" },
          { label: "B", text: "10" },
          { label: "C", text: "11" },
          { label: "D", text: "12" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sp7",
        question: "Which city is hosting the 2024 Summer Olympics?",
        options: [
          { label: "A", text: "Tokyo" },
          { label: "B", text: "Paris" },
          { label: "C", text: "Los Angeles" },
          { label: "D", text: "Brisbane" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sp8",
        question: "In golf, what is the term for scoring two under par on a single hole?",
        options: [
          { label: "A", text: "Birdie" },
          { label: "B", text: "Eagle" },
          { label: "C", text: "Albatross" },
          { label: "D", text: "Bogey" },
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
      {
        id: "en4",
        question: "What is the name of the kingdom where 'Frozen' takes place?",
        options: [
          { label: "A", text: "Arendelle" },
          { label: "B", text: "Genovia" },
          { label: "C", text: "DunBroch" },
          { label: "D", text: "Corona" },
        ],
        correctAnswer: "A",
      },
      {
        id: "en5",
        question: "Which artist released the album 'Thriller' in 1982?",
        options: [
          { label: "A", text: "Prince" },
          { label: "B", text: "Madonna" },
          { label: "C", text: "Michael Jackson" },
          { label: "D", text: "David Bowie" },
        ],
        correctAnswer: "C",
      },
      {
        id: "en6",
        question: "In the movie 'The Matrix', what color pill does Neo take?",
        options: [
          { label: "A", text: "Blue" },
          { label: "B", text: "Green" },
          { label: "C", text: "Red" },
          { label: "D", text: "Yellow" },
        ],
        correctAnswer: "C",
      },
      {
        id: "en7",
        question: "Which band sang 'Bohemian Rhapsody'?",
        options: [
          { label: "A", text: "The Beatles" },
          { label: "B", text: "Queen" },
          { label: "C", text: "Led Zeppelin" },
          { label: "D", text: "Pink Floyd" },
        ],
        correctAnswer: "B",
      },
      {
        id: "en8",
        question: "Who played the character Jack Sparrow in 'Pirates of the Caribbean'?",
        options: [
          { label: "A", text: "Brad Pitt" },
          { label: "B", text: "Johnny Depp" },
          { label: "C", text: "Orlando Bloom" },
          { label: "D", text: "Tom Hardy" },
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
      {
        id: "eth4",
        question: "Who is the primary co-founder of Ethereum?",
        options: [
          { label: "A", text: "Satoshi Nakamoto" },
          { label: "B", text: "Vitalik Buterin" },
          { label: "C", text: "Charles Hoskinson" },
          { label: "D", text: "Gavin Wood" },
        ],
        correctAnswer: "B",
      },
      {
        id: "eth5",
        question: "The ERC-721 standard is most commonly used for:",
        options: [
          { label: "A", text: "Fungible tokens" },
          { label: "B", text: "Non-fungible tokens (NFTs)" },
          { label: "C", text: "Governance tokens" },
          { label: "D", text: "Stablecoins" },
        ],
        correctAnswer: "B",
      },
      {
        id: "eth6",
        question: "What is the default block time for Ethereum (post-Merge)?",
        options: [
          { label: "A", text: "15 seconds" },
          { label: "B", text: "12 seconds" },
          { label: "C", text: "2 minutes" },
          { label: "D", text: "10 minutes" },
        ],
        correctAnswer: "B",
      },
      {
        id: "eth7",
        question: "What does EVM stand for in the Ethereum ecosystem?",
        options: [
          { label: "A", text: "Ethereum Virtual Machine" },
          { label: "B", text: "Ether Variable Meta" },
          { label: "C", text: "Encryption Verified Modal" },
          { label: "D", text: "Ethereum Video Module" },
        ],
        correctAnswer: "A",
      },
      {
        id: "eth8",
        question: "Which tool is often used as a 'crypto wallet' to interact with Ethereum dApps?",
        options: [
          { label: "A", text: "MetaMask" },
          { label: "B", text: "EthereumHub" },
          { label: "C", text: "Sollet" },
          { label: "D", text: "Phantom" },
        ],
        correctAnswer: "A",
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
      {
        id: "btc4",
        question: "In what year was the Bitcoin whitepaper published?",
        options: [
          { label: "A", text: "2007" },
          { label: "B", text: "2008" },
          { label: "C", text: "2009" },
          { label: "D", text: "2010" },
        ],
        correctAnswer: "B",
      },
      {
        id: "btc5",
        question: "What is the approximate time between Bitcoin block rewards halving?",
        options: [
          { label: "A", text: "2 years" },
          { label: "B", text: "4 years" },
          { label: "C", text: "6 years" },
          { label: "D", text: "10 years" },
        ],
        correctAnswer: "B",
      },
      {
        id: "btc6",
        question: "Who is the pseudonymous creator of Bitcoin?",
        options: [
          { label: "A", text: "Hal Finney" },
          { label: "B", text: "Nick Szabo" },
          { label: "C", text: "Satoshi Nakamoto" },
          { label: "D", text: "Craig Wright" },
        ],
        correctAnswer: "C",
      },
      {
        id: "btc7",
        question: "What was the price of 10,000 Bitcoins used to buy two pizzas in 2010?",
        options: [
          { label: "A", text: "$10" },
          { label: "B", text: "$40" },
          { label: "C", text: "$1,000" },
          { label: "D", text: "$10,000" },
        ],
        correctAnswer: "B",
      },
      {
        id: "btc8",
        question: "Bitcoin is often referred to as digital what?",
        options: [
          { label: "A", text: "Cash" },
          { label: "B", text: "Gold" },
          { label: "C", text: "Silver" },
          { label: "D", text: "Diamond" },
        ],
        correctAnswer: "B",
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
      {
        id: "sol4",
        question: "Solana belongs to which generation of blockchains?",
        options: [
          { label: "A", text: "1st Generation" },
          { label: "B", text: "2nd Generation" },
          { label: "C", text: "3rd Generation" },
          { label: "D", text: "Legacy Generation" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sol5",
        question: "What is the name of the popular NFT marketplace on Solana?",
        options: [
          { label: "A", text: "OpenSea" },
          { label: "B", text: "Magic Eden" },
          { label: "C", text: "Rarible" },
          { label: "D", text: "LooksRare" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sol6",
        question: "Which wallet is most widely used in the Solana ecosystem?",
        options: [
          { label: "A", text: "MetaMask" },
          { label: "B", text: "Phantom" },
          { label: "C", text: "Trust Wallet" },
          { label: "D", text: "Ledger Live" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sol7",
        question: "Solana blocks are confirmed approximately every how many milliseconds?",
        options: [
          { label: "A", text: "400ms" },
          { label: "B", text: "1000ms" },
          { label: "C", text: "5000ms" },
          { label: "D", text: "12000ms" },
        ],
        correctAnswer: "A",
      },
      {
        id: "sol8",
        question: "What are smart contracts called in the Solana developer documentation?",
        options: [
          { label: "A", text: "Procedures" },
          { label: "B", text: "Programs" },
          { label: "C", text: "Scripts" },
          { label: "D", text: "Classes" },
        ],
        correctAnswer: "B",
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
      {
        id: "base4",
        question: "Does Base have its own native network token?",
        options: [
          { label: "A", text: "Yes, BASE" },
          { label: "B", text: "No, it uses ETH for fees" },
          { label: "C", text: "Yes, CBETH" },
          { label: "D", text: "Yes, USDC" },
        ],
        correctAnswer: "B",
      },
      {
        id: "base5",
        question: "Base operates as what layer on top of Ethereum?",
        options: [
          { label: "A", text: "Layer 0" },
          { label: "B", text: "Layer 1" },
          { label: "C", text: "Layer 2" },
          { label: "D", text: "Layer 3" },
        ],
        correctAnswer: "C",
      },
      {
        id: "base6",
        question: "The slogan for Base is often 'Base is for...'?",
        options: [
          { label: "A", text: "Everyone" },
          { label: "B", text: "Builders" },
          { label: "C", text: "Traders" },
          { label: "D", text: "Miners" },
        ],
        correctAnswer: "B",
      },
      {
        id: "base7",
        question: "Which Ethereum scaling technology does Base use?",
        options: [
          { label: "A", text: "ZK Rollup" },
          { label: "B", text: "Optimistic Rollup" },
          { label: "C", text: "Plasma" },
          { label: "D", text: "Sidechain" },
        ],
        correctAnswer: "B",
      },
      {
        id: "base8",
        question: "What is the primary goal of the Onchain Summer campaign by Base?",
        options: [
          { label: "A", text: "Close down the network" },
          { label: "B", text: "Onboard people to use onchain apps" },
          { label: "C", text: "Sell physical hardware" },
          { label: "D", text: "Airdrop tokens" },
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
      {
        id: "pol4",
        question: "What is the name of Polygon's ZK-compatible scaling solution?",
        options: [
          { label: "A", text: "Polygon ZK-EVM" },
          { label: "B", text: "Polygon ZK-ETH" },
          { label: "C", text: "Polygon ZK-Roll" },
          { label: "D", text: "Polygon ZK-Scale" },
        ],
        correctAnswer: "A",
      },
      {
        id: "pol5",
        question: "Polygon uses which consensus mechanism for its main PoS chain?",
        options: [
          { label: "A", text: "Proof of Work" },
          { label: "B", text: "Proof of Stake" },
          { label: "C", text: "Proof of Burn" },
          { label: "D", text: "Proof of Capacity" },
        ],
        correctAnswer: "B",
      },
      {
        id: "pol6",
        question: "Which of these is NOT part of the Polygon 2.0 vision?",
        options: [
          { label: "A", text: "Unified liquidity" },
          { label: "B", text: "ZK-powered interoperability" },
          { label: "C", text: "Returning to Proof of Work" },
          { label: "D", text: "POL token upgrade" },
        ],
        correctAnswer: "C",
      },
      {
        id: "pol7",
        question: "Polygon PoS is an Ethereum-compatible what?",
        options: [
          { label: "A", text: "Smart contract" },
          { label: "B", text: "Sidechain" },
          { label: "C", text: "Mainnet" },
          { label: "D", text: "Protocol" },
        ],
        correctAnswer: "B",
      },
      {
        id: "pol8",
        question: "Which of these famous coffee chains launched an NFT-based loyalty program on Polygon?",
        options: [
          { label: "A", text: "Dunkin'" },
          { label: "B", text: "Starbucks" },
          { label: "C", text: "Costa" },
          { label: "D", text: "Coffee Bean" },
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
      {
        id: "sui4",
        question: "What is the native gas token of the Sui network?",
        options: [
          { label: "A", text: "SUI" },
          { label: "B", text: "OCEAN" },
          { label: "C", text: "MOVE" },
          { label: "D", text: "FLOW" },
        ],
        correctAnswer: "A",
      },
      {
        id: "sui5",
        question: "Sui utilizes an object-oriented approach instead of accounts. This is typical of which chain family?",
        options: [
          { label: "A", text: "EVM" },
          { label: "B", text: "Move-based" },
          { label: "C", text: "Cosmos" },
          { label: "D", text: "Bitcoin-forks" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sui6",
        question: "Is Sui a Layer 1 or Layer 2 blockchain?",
        options: [
          { label: "A", text: "Layer 1" },
          { label: "B", text: "Layer 2" },
          { label: "C", text: "Layer 3" },
          { label: "D", text: "Sidechain" },
        ],
        correctAnswer: "A",
      },
      {
        id: "sui7",
        question: "Which big tech company's former employees formed Mysten Labs?",
        options: [
          { label: "A", text: "Google" },
          { label: "B", text: "Meta (Facebook)" },
          { label: "C", text: "Apple" },
          { label: "D", text: "Amazon" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sui8",
        question: "What is the name of the consensus engine used by Sui?",
        options: [
          { label: "A", text: "Bullshark" },
          { label: "B", text: "Tendermint" },
          { label: "C", text: "Casper" },
          { label: "D", text: "Ghost" },
        ],
        correctAnswer: "A",
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    icon: "🧪",
    questions: [
      {
        id: "sc1",
        question: "What is the chemical symbol for the element Gold?",
        options: [
          { label: "A", text: "Gd" },
          { label: "B", text: "Ag" },
          { label: "C", text: "Au" },
          { label: "D", text: "Fe" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sc2",
        question: "Which planet is known as the Red Planet?",
        options: [
          { label: "A", text: "Venus" },
          { label: "B", text: "Mars" },
          { label: "C", text: "Jupiter" },
          { label: "D", text: "Saturn" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sc3",
        question: "What is the hardest natural substance on Earth?",
        options: [
          { label: "A", text: "Gold" },
          { label: "B", text: "Iron" },
          { label: "C", text: "Diamond" },
          { label: "D", text: "Quartz" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sc4",
        question: "What gas do plants absorb from the atmosphere for photosynthesis?",
        options: [
          { label: "A", text: "Oxygen" },
          { label: "B", text: "Nitrogen" },
          { label: "C", text: "Carbon Dioxide" },
          { label: "D", text: "Hydrogen" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sc5",
        question: "Who developed the theory of special relativity?",
        options: [
          { label: "A", text: "Isaac Newton" },
          { label: "B", text: "Albert Einstein" },
          { label: "C", text: "Nikola Tesla" },
          { label: "D", text: "Marie Curie" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sc6",
        question: "What is the largest organ of the human body?",
        options: [
          { label: "A", text: "Liver" },
          { label: "B", text: "Heart" },
          { label: "C", text: "Skin" },
          { label: "D", text: "Lungs" },
        ],
        correctAnswer: "C",
      },
      {
        id: "sc7",
        question: "Which force keeps planets in orbit around the Sun?",
        options: [
          { label: "A", text: "Magnetism" },
          { label: "B", text: "Gravity" },
          { label: "C", text: "Friction" },
          { label: "D", text: "Centrifugal" },
        ],
        correctAnswer: "B",
      },
      {
        id: "sc8",
        question: "What is the primary gas found in the Earth's atmosphere?",
        options: [
          { label: "A", text: "Oxygen" },
          { label: "B", text: "Nitrogen" },
          { label: "C", text: "Carbon Dioxide" },
          { label: "D", text: "Argon" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    icon: "🌍",
    questions: [
      {
        id: "geo1",
        question: "Which is the largest continent by area?",
        options: [
          { label: "A", text: "Africa" },
          { label: "B", text: "North America" },
          { label: "C", text: "Asia" },
          { label: "D", text: "Europe" },
        ],
        correctAnswer: "C",
      },
      {
        id: "geo2",
        question: "What is the capital of Japan?",
        options: [
          { label: "A", text: "Beijing" },
          { label: "B", text: "Seoul" },
          { label: "C", text: "Tokyo" },
          { label: "D", text: "Kyoto" },
        ],
        correctAnswer: "C",
      },
      {
        id: "geo3",
        question: "Which river is the longest in the world?",
        options: [
          { label: "A", text: "Amazon" },
          { label: "B", text: "Nile" },
          { label: "C", text: "Yangtze" },
          { label: "D", text: "Mississippi" },
        ],
        correctAnswer: "B",
      },
      {
        id: "geo4",
        question: "Which country has the largest population in the world (as of 2024)?",
        options: [
          { label: "A", text: "China" },
          { label: "B", text: "India" },
          { label: "C", text: "USA" },
          { label: "D", text: "Indonesia" },
        ],
        correctAnswer: "B",
      },
      {
        id: "geo5",
        question: "In which country can you find the Great Pyramid of Giza?",
        options: [
          { label: "A", text: "Mexico" },
          { label: "B", text: "Peru" },
          { label: "C", text: "Egypt" },
          { label: "D", text: "Greece" },
        ],
        correctAnswer: "C",
      },
      {
        id: "geo6",
        question: "What is the smallest country in the world by land area?",
        options: [
          { label: "A", text: "Monaco" },
          { label: "B", text: "Vatican City" },
          { label: "C", text: "San Marino" },
          { label: "D", text: "Nauru" },
        ],
        correctAnswer: "B",
      },
      {
        id: "geo7",
        question: "The Andes mountain range is located on which continent?",
        options: [
          { label: "A", text: "Europe" },
          { label: "B", text: "South America" },
          { label: "C", text: "Asia" },
          { label: "D", text: "Australia" },
        ],
        correctAnswer: "B",
      },
      {
        id: "geo8",
        question: "Which ocean is the largest on Earth?",
        options: [
          { label: "A", text: "Atlantic" },
          { label: "B", text: "Indian" },
          { label: "C", text: "Pacific" },
          { label: "D", text: "Arctic" },
        ],
        correctAnswer: "C",
      },
    ],
  },
  {
    id: "history",
    name: "History",
    icon: "📜",
    questions: [
      {
        id: "hi1",
        question: "Who was the first President of the United States?",
        options: [
          { label: "A", text: "Thomas Jefferson" },
          { label: "B", text: "John Adams" },
          { label: "C", text: "George Washington" },
          { label: "D", text: "Abraham Lincoln" },
        ],
        correctAnswer: "C",
      },
      {
        id: "hi2",
        question: "In which year did World War II end?",
        options: [
          { label: "A", text: "1918" },
          { label: "B", text: "1939" },
          { label: "C", text: "1945" },
          { label: "D", text: "1950" },
        ],
        correctAnswer: "C",
      },
      {
        id: "hi3",
        question: "Who was the famous Queen of Ancient Egypt known for her relationship with Julius Caesar?",
        options: [
          { label: "A", text: "Nefertiti" },
          { label: "B", text: "Cleopatra" },
          { label: "C", text: "Hatshepsut" },
          { label: "D", text: "Isis" },
        ],
        correctAnswer: "B",
      },
      {
        id: "hi4",
        question: "The French Revolution began in which year?",
        options: [
          { label: "A", text: "1776" },
          { label: "B", text: "1789" },
          { label: "C", text: "1812" },
          { label: "D", text: "1848" },
        ],
        correctAnswer: "B",
      },
      {
        id: "hi5",
        question: "Who was the primary leader of the Mongol Empire?",
        options: [
          { label: "A", text: "Attila the Hun" },
          { label: "B", text: "Genghis Khan" },
          { label: "C", text: "Kublai Khan" },
          { label: "D", text: "Alexander the Great" },
        ],
        correctAnswer: "B",
      },
      {
        id: "hi6",
        question: "The Magna Carta was signed in which year?",
        options: [
          { label: "A", text: "1066" },
          { label: "B", text: "1215" },
          { label: "C", text: "1492" },
          { label: "D", text: "1776" },
        ],
        correctAnswer: "B",
      },
      {
        id: "hi7",
        question: "Who was the famous civil rights leader who gave the 'I Have a Dream' speech?",
        options: [
          { label: "A", text: "Malcolm X" },
          { label: "B", text: "Martin Luther King Jr." },
          { label: "C", text: "Rosa Parks" },
          { label: "D", text: "Nelson Mandela" },
        ],
        correctAnswer: "B",
      },
      {
        id: "hi8",
        question: "The ancient city of Troy is located in which modern-day country?",
        options: [
          { label: "A", text: "Greece" },
          { label: "B", text: "Turkey" },
          { label: "C", text: "Italy" },
          { label: "D", text: "Egypt" },
        ],
        correctAnswer: "B",
      },
    ],
  },
];
