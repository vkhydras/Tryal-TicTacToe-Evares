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
}).then(()=>{
  console.log('MongoDB connected')
})

// Define the game schema
const gameSchema = new mongoose.Schema({
  board: [String],
});

const Game = mongoose.model("Game", gameSchema);

// Create a new game
app.post("/games", (req, res) => {
  const { board } = req.body;
  const newGame = new Game({ board });

  newGame.save((err, game) => {
    if (err) {
      console.error("Error creating game:", err);
      res.status(500).send("Error creating game");
    } else {
      res.json(game);
    }
  });
});

// Retrieve game data
app.get("/games", async (req, res) => {
  try {
    const game = await Game.findOne({});
    if (!game) {
      const newGame = new Game({ board: createCells().map((cell) => cell.value) });
      const savedGame = await newGame.save();
      res.json(savedGame);
    } else {
      res.json(game);
    }
  } catch (err) {
    console.error("Error retrieving game:", err);
    res.status(500).send("Error retrieving game");
  }
});

// Update game data
app.put("/games", (req, res) => {
  const { board } = req.body;
  Game.findOneAndUpdate(
    {},
    { board },
    { new: true },
    (err, updatedGame) => {
      if (err) {
        console.error("Error updating game:", err);
        res.status(500).send("Error updating game");
      } else if (!updatedGame) {
        res.status(404).send("Game not found");
      } else {
        res.json(updatedGame);
      }
    }
  );
});

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
