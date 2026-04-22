import { Router } from "express";
import protect from "@/middleware/auth.js";
import { deleteMessage, editMessage, sendMessage } from "@/controllers/message.js";

const messageRoute = Router();

messageRoute.post("/send", protect, sendMessage);
messageRoute.patch("/:id", protect, editMessage);
messageRoute.delete("/:id", protect, deleteMessage);

export default messageRoute;
