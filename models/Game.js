// Game.js
const mongoose = require("mongoose");

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

module.exports = mongoose.model("Game", gameSchema);
