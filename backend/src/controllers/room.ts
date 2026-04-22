import prisma from "@/lib/prisma.js";
import wrapper from "@/util/action-wrapper.js";
import type { Request, Response } from "express";

export async function createRoom(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "createRoom");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function getRooms(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "getUserConversations");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function getConversation(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "getConversation");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}
