import type { PopulatedRoom } from "../types/model.js";

import prisma from "@/lib/prisma.js";
import type { RoomType } from "@prisma/client";
import wrapper from "@/util/action-wrapper.js";
import type { Request, Response } from "express";

export async function createRoom(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const userId = req.userId;
        const name = req.body.name as string | undefined;
        const inviteCode = req.body.inviteCode as string | undefined;
        const type = (req.body.type as RoomType | undefined) ?? "Private";
        const memberIds = Array.isArray(req.body.memberIds) ? (req.body.memberIds as string[]) : [];

        if (!userId) throw new Error("Unauthorized");

        const uniqueMemberIds = [...new Set([userId, ...memberIds])].filter(Boolean);

        if (type === "Private") {
            if (uniqueMemberIds.length !== 2) throw new Error("Private rooms require exactly two members");

            const existingRoom = await prisma.room.findFirst({
                where: {
                    type: "Private",
                    AND: uniqueMemberIds.map((userId) => ({ members: { some: { userId } } })),
                },
                include: {
                    members: { include: { user: true } },
                    messages: { include: { user: true }, orderBy: { createdAt: "asc" } },
                },
            });

            if (existingRoom && existingRoom.members.length === 2) return existingRoom;
        }

        if (type === "Group" && !name?.trim()) throw new Error("Group name is required");

        const room = await prisma.room.create({
            data: {
                name: name?.trim() || null,
                inviteCode: inviteCode || null,
                type,
                members: {
                    create: uniqueMemberIds.map((id) => ({
                        userId: id,
                        role: id === userId ? "Admin" : "Member",
                    })),
                },
            },
            include: {
                members: { include: { user: true } },
                messages: { include: { user: true }, orderBy: { createdAt: "asc" } },
            },
        });

        return room;
    }, "createRoom");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function getRooms(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const userId = req.userId;

        if (!userId) throw new Error("Unauthorized");

        const rooms = await prisma.room.findMany({
            where: {
                members: { some: { userId } },
            },
            include: {
                members: { include: { user: true } },
                messages: {
                    include: { user: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
        });

        return rooms;
    }, "getRooms");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function getConversation(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const roomId = req.params.id as string;
        const userId = req.userId;

        if (!userId) throw new Error("Unauthorized");

        const result = await prisma.$transaction(async (tx) => {
            await tx.member.updateMany({
                where: { roomId, userId },
                data: { lastReadAt: new Date() },
            });

            const room = (await tx.room.findFirst({
                where: {
                    id: roomId,
                    members: { some: { userId } },
                },
                include: {
                    members: { include: { user: true } },
                    messages: { include: { user: true }, orderBy: { createdAt: "asc" } },
                },
            })) as PopulatedRoom | null;

            if (!room) throw new Error("Room not found");

            return room;
        });

        return result;
    }, "getConversation");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}
