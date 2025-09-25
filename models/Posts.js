const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Printest")

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // image URL
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board", // which board this pin belongs to
    },
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who saved the pin
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
