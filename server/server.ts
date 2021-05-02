import express from "express";
import cors from "cors";
import mongoose, { MongooseDocument } from "mongoose";
import User from "./models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//initialize web socket
import "./websocket";

const app = express();

const JWT_SECRET_TOKEN = "fusdgjkfdshjbvfsdhjfvsdhjv1213vhjvdshjfvsjh";

const PRODUCTION = process.env.NODE_ENV === "production";

if (PRODUCTION) {
  app.use(express.static("/home/ubuntu/webapp/client/build"));
  mongoose.connect("mongodb://localhost:27017/chat-mern-ec2");
} else {
  mongoose.connect("mongodb://localhost:27017/chat-mern-ec2");
}

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded());

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
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
  } catch (error) {
    console.log("Error", error);
    res.json({ status: "error", error: "Duplicate email" });
  }

  res.json({ status: "ok" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  //lean strips metadata which mongoose ships with. It returns plain js objects but not mongoose objects
  const user: { email: string; password: string } = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "User Not Found" });
  }
  let verified;
  try {
    verified = await bcrypt.compare(password, user.password);
  } catch (err) {}

  // TODO:
  // 1. Refresh tokens XX
  // 2. Storing JWT in memory instead of localStorage XX

  // Right now:
  // 1. JWT tokens directly
  // 2. localStorage

  // Refresh token -> httpOnly cookie
  if (verified) {
    const payload = jwt.sign({ email: user.email }, JWT_SECRET_TOKEN); // 10-15 minutes
    return res.json({ status: "ok", data: payload });
  } else {
    return res.json({ status: "not ok", error: "Password did not match" });
  }
});

app.listen(5000);
