import { Router } from "express";
import protect from "@/middleware/auth.js";
import { syncUser, getUser, searchUser } from "@/controllers/user.js";

const userRoute = Router();

userRoute.get("/", protect, getUser);
userRoute.post("/sync", protect, syncUser);
userRoute.post("/update", protect, syncUser);
userRoute.get("/search", protect, searchUser);

export default userRoute;
