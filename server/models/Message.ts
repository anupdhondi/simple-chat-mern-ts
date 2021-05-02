import mongoose from "mongoose";

const MessageModel = new mongoose.Schema(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Number, required: true }, //Date.now returns a number and we store it as a number
  },
  { collection: "messages" }
);

const model = mongoose.model("MessageModel", MessageModel);

export default model;
