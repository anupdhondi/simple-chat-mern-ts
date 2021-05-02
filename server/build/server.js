"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//initialize web socket server
require("./websocket");
const utility_1 = require("./utility");
const app = express_1.default();
mongoose_1.default.connect("mongodb://localhost:27017/chat-mern-ec2");
if (process.env.NODE_ENV !== "production") {
    app.use(cors_1.default());
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.get("/", (req, res) => {
    res.send("ok");
});
app.post("/api/register", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ status: "error", error: "Invalid email/password" });
    }
    // TODO: Hashing the password
    // bcrypt
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    try {
        const user = new User_1.default({ email, password: hashedPassword });
        await user.save();
    }
    catch (error) {
        console.log("Error", error);
        res.json({ status: "error", error: "Duplicate email" });
    }
    res.json({ status: "ok" });
});
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    //lean strips metadata which mongoose ships with. It returns plain js objects but not mongoose objects
    const user = await User_1.default.findOne({ email }).lean();
    if (!user) {
        return res.json({ status: "error", error: "User Not Found" });
    }
    let verified;
    try {
        verified = await bcrypt_1.default.compare(password, user.password);
    }
    catch (err) { }
    // TODO:
    // 1. Refresh tokens XX
    // 2. Storing JWT in memory instead of localStorage XX
    // Right now:
    // 1. JWT tokens directly
    // 2. localStorage
    // Refresh token -> httpOnly cookie
    if (verified) {
        const payload = jsonwebtoken_1.default.sign({ email: user.email }, utility_1.JWT_SECRET_TOKEN); // 10-15 minutes
        return res.json({ status: "ok", data: payload });
    }
    else {
        return res.json({ status: "not ok", error: "Password did not match" });
    }
});
app.listen(5000);
