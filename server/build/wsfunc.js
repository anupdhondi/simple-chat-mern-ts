"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveAndSendMessages = exports.broadCastMessage = exports.setClients = exports.clients = void 0;
const Message_1 = __importDefault(require("./models/Message"));
exports.clients = [];
function setClients(newClients) {
    exports.clients = newClients;
}
exports.setClients = setClients;
function broadCastMessage(message, ws) {
    const newMessage = new Message_1.default({
        email: ws.connectionID,
        message: message.message,
        date: Date.now(),
    });
    newMessage.save();
    // broadcast it to all clients
    for (let i = 0; i < exports.clients.length; i++) {
        const client = exports.clients[i];
        client.send(JSON.stringify({
            message: message.message,
            user: ws.connectionID,
            intent: "chat",
        }));
    }
}
exports.broadCastMessage = broadCastMessage;
async function retrieveAndSendMessages(ws, count) {
    const messages = await Message_1.default.find({}, { email: 1, message: 1 }).sort({ date: -1 }).limit(count).lean();
    ws.send(JSON.stringify({
        intent: "old-messages",
        data: messages,
    }));
}
exports.retrieveAndSendMessages = retrieveAndSendMessages;
