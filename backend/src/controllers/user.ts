import prisma from "@/lib/prisma.js";
import wrapper from "@/util/action-wrapper.js";
import type { Request, Response } from "express";
import { createUserPayloadSchema } from "@/lib/user-validation.js";

export async function syncUser(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const id = req.userId;

        if (!id) throw new Error("Unauthorized. Login First");

        const parsedPayload = createUserPayloadSchema.safeParse(req.body);
        if (!parsedPayload.success) {
            throw new Error(parsedPayload.error.issues[0]?.message || "Invalid onboarding payload.");
        }

        const { name, username, bio, profile } = parsedPayload.data;
        const existingUsername = await prisma.user.findUnique({ where: { username } });

        if (existingUsername && existingUsername.id !== id) {
            throw new Error("Username is already taken by another account.");
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (profile !== undefined) updateData.profile = profile;

        const createData = {
            id,
            name,
            username,
            ...(profile !== undefined ? { profile } : {}),
            ...(bio !== undefined ? { bio } : {}),
        };

        const user = await prisma.user.upsert({
            where: { id },
            create: createData,
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

export async function searchUser(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const name = req.query.name as string | undefined;
        const username = req.query.username as string | undefined;

        if (!name && !username) {
            throw new Error("Provide at least a name or username to search");
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    name
                        ? {
                              name: { contains: name, mode: "insensitive" },
                          }
                        : {},
                    username
                        ? {
                              username: { contains: username, mode: "insensitive" },
                          }
                        : {},
                ],
            },
        });

        return users;
    }, "searchUser");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}
