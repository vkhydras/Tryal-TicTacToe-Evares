const mongoose = require("mongoose");

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

module.exports = mongoose.model("Move", moveSchema);
