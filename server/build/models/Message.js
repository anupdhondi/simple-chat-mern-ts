"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageModel = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Number, required: true }, //Date.now returns a number and we store it as a number
}, { collection: "messages" });
const model = mongoose_1.default.model("MessageModel", MessageModel);
exports.default = model;
