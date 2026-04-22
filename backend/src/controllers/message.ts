import prisma from "@/lib/prisma.js";
import wrapper from "@/util/action-wrapper.js";
import type { Request, Response } from "express";

export async function sendMessage(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "sendMessage");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function editMessage(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "editMessage");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function deleteMessage(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "deleteMessage");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}
