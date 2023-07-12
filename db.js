const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://victorkimaru8:stvick.9028@cluster0.3clz1wb.mongodb.net/TicTacToe?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = connectDB;
