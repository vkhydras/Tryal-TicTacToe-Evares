const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  board: [String],
});

module.exports = mongoose.model("Game", gameSchema);
