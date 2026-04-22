import cors from "cors";
import express from "express";
import ENV from "@/util/env.js";
import roomRoute from "@/routes/room.js";
import userRoute from "@/routes/user.js";
import messageRoute from "@/routes/message.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(express.json());

app.use(clerkMiddleware());
app.use(cors({ origin: [ENV.CLIENT_URL], credentials: true }));

app.use("/auth", userRoute);
app.use("/message", messageRoute);
app.use("/room", roomRoute);

export default app;
