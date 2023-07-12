const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://victorkimaru8:<password>@cluster0.3clz1wb.mongodb.net/TicTacToe?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
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
  row: Number,
  column: Number,
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
    const game = await Game.findOne({ status: "ongoing" });

    if (game) {
      res.json(game);
    } else {
      const newGame = new Game({ board: createCells().map((cell) => cell.value) });
      const savedGame = await newGame.save();
      res.json(savedGame);
    }
  } catch (err) {
    console.error("Error retrieving game:", err);
    res.status(500).send("Error retrieving game");
  }
});

// Update game data and log moves
app.put("/games", async (req, res) => {
  const { board } = req.body;

  try {
    let game = await Game.findOneAndUpdate(
      {},
      { $set: { board } },
      { new: true }
    );

    if (!game) {
      return res.status(404).send("Game not found");
    }

    const winner = checkWinner(game.board);
    const status = winner ? "completed" : game.board.includes("") ? "ongoing" : "draw";

    game.status = status;
    game.winner = winner;

    const position = board.findIndex((cell) => cell === "X"); // Find the position of the move
    const row = Math.floor(position / 3); // Calculate the row index
    const column = position % 3; // Calculate the column index

    const move = new Move({
      game: game._id,
      player: "X", // Assuming player X makes the move
      row,
      column
    });

    await move.save();

    // Update the moves array in the game
    game.moves.push(move._id);

    await game.save();

    res.json(game);
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

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Helper function to create empty cells
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
