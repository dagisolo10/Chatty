import prisma from "@/lib/prisma.js";
import wrapper from "@/util/action-wrapper.js";
import type { Request, Response } from "express";

export async function syncUser(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const id = req.userId;
        const { name, username, bio, profile } = req.body;

        if (!id) throw new Error("User ID missing from verified token");

        const existingUsername = await prisma.user.findUnique({ where: { username } });

        if (existingUsername && existingUsername.id !== id) {
            throw new Error("Username is already taken by another account.");
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (profile !== undefined) updateData.profile = profile;

        const user = await prisma.user.upsert({
            where: { id },
            create: { id, name, username, profile, bio },
            update: updateData,
        });

        return user;
    }, "syncUser");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function getUser(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const id = req.userId;

        if (!id) throw new Error("Unauthorized. Login First");

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) throw new Error("User not found");

        return user;
    }, "getUser");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function searchUserByName(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "getUserByName");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function searchUserByUsername(req: Request, res: Response) {
    const result = await wrapper(async () => {}, "getUserByUsername");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}
