const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB

mongoose.connect("mongodb+srv://victorkimaru8:😁<password>😁@cluster0.3clz1wb.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected')
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define the move schema
const moveSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  player: String,
  position: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Move = mongoose.model("Move", moveSchema);

// Update the game schema to include moves
const gameSchema = new mongoose.Schema({
  board: [String],
  playerX: String,
  playerO: String,
  status: {
    type: String,
    default: "ongoing"
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  moves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Move'
  }]
});

const Game = mongoose.model("Game", gameSchema);


// Create a new game
app.post("/games", async (req, res) => {
  const { board } = req.body;

  try {
    const newGame = new Game({ board });
    const savedGame = await newGame.save();

    res.json(savedGame);
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(500).send("Error creating game");
  }
});

// Retrieve game data
app.get("/games", async (req, res) => {
  try {
    let game = await Game.findOne({});
    
    if (!game) {
      const newGame = new Game({ board: createCells().map((cell) => cell.value) });
      game = await newGame.save();
    }
    
    res.json(game);
  } catch (err) {
    console.error("Error retrieving game:", err);
    res.status(500).send("Error retrieving game");
  }
});


// Update game data and log moves
app.put("/games", async (req, res) => {
  const { board } = req.body;
  
  try {
    const game = await Game.findOne({});
    
    if (!game) {
      return res.status(404).send("Game not found");
    }
    
    game.board = board;
    
    const updatedGame = await game.save();
    
    const winner = checkWinner(updatedGame.board);
    const status = winner ? "completed" : "ongoing";
    
    updatedGame.status = status;
    updatedGame.winner = winner;
    
    await updatedGame.save();
    
    res.json(updatedGame);
  } catch (err) {
    console.error("Error updating game:", err);
    res.status(500).send("Error updating game");
  }
});



// Helper function to check for winning moves
function checkWinner(board) {
  const winningCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningCombo) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null; // No winner
}

// Delete a game
app.delete("/games/:id", (req, res) => {
  const gameId = req.params.id;

  Game.findByIdAndRemove(gameId, (err) => {
    if (err) {
      console.error("Error deleting game:", err);
      res.status(500).send("Error deleting game");
    } else {
      res.send("Game deleted successfully");
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Helper function to create empty cells
function createCells() {
  const cellsArray = [];

  for (let i = 0; i < 9; i++) {
    cellsArray.push("");
  }

  return cellsArray;
}

function createCells() {
  const cellsArray = [];

  for (let i = 0; i < 9; i++) {
    cellsArray.push({
      value: "",
      id: i,
      clicked: false,
    });
  }

  return cellsArray;
}