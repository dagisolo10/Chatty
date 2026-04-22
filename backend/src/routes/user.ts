import { Router } from "express";
import protect from "@/middleware/auth.js";
import { searchUserByName, syncUser, searchUserByUsername, getUser } from "@/controllers/user.js";

const userRoute = Router();

userRoute.get("/", protect, getUser);
userRoute.post("/sync", protect, syncUser);
userRoute.post("/update", protect, syncUser);
userRoute.post("/users/:name", searchUserByName);
userRoute.post("/users/:username", searchUserByUsername);

export default userRoute;
