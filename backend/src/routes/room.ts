import { Router } from "express";
import protect from "@/middleware/auth.js";
import { getRooms, createRoom, getConversation } from "@/controllers/room.js";

const roomRoute = Router();

roomRoute.post("/create", protect, createRoom);
roomRoute.get("/list", protect, getRooms);
roomRoute.get("/:id", protect, getConversation);

export default roomRoute;
