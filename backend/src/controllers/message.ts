import type { PopulatedRoom } from "../types/model.js";

import prisma from "@/lib/prisma.js";
import wrapper from "@/util/action-wrapper.js";
import type { Request, Response } from "express";
import { Server as SocketServer } from "socket.io";
import { Prisma, type MessageType } from "@prisma/client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-events.js";

export async function sendMessage(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const message = req.body.message as string;
        const messageType = req.body.messageType as MessageType;

        const senderId = req.userId;
        const roomId = req.body.roomId as string | undefined;
        const recipientId = req.body.recipientId as string | undefined;

        if (!senderId) throw new Error("Unauthorized");
        if (!message?.trim()) throw new Error("Message is required");
        if (!messageType) throw new Error("Message type is required");

        const result = await prisma.$transaction(async (tx) => {
            let existingRoom: PopulatedRoom | null = null;

            if (roomId && !recipientId) {
                existingRoom = await tx.room.findFirst({
                    where: {
                        id: roomId,
                        members: { some: { userId: senderId } },
                    },
                    include: { members: true },
                });
            } else if (!roomId && recipientId) {
                const privateRoomKey = [senderId, recipientId].sort().join(" | ");

                existingRoom = await tx.room.findUnique({
                    where: { privateKey: privateRoomKey },
                    include: { members: true, messages: true },
                });

                if (!existingRoom) {
                    try {
                        existingRoom = await tx.room.create({
                            data: {
                                type: "Private",
                                privateKey: privateRoomKey,
                                members: { create: [{ userId: senderId }, { userId: recipientId }] },
                            },
                            include: { members: true, messages: true },
                        });
                    } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                            existingRoom = await tx.room.findUnique({
                                where: { privateKey: privateRoomKey },
                                include: { members: true, messages: true },
                            });
                        } else {
                            throw error;
                        }
                    }
                }
            }

            if (!existingRoom) throw new Error("Room not found");

            const newMessage = await tx.message.create({
                data: {
                    senderId,
                    messageType,
                    message: message.trim(),
                    roomId: existingRoom.id,
                },
                include: { user: true },
            });

            await tx.room.update({
                where: { id: existingRoom.id },
                data: { lastMessage: message.trim(), lastMessageAt: newMessage.createdAt },
            });

            await tx.member.updateMany({
                where: { roomId: existingRoom.id, userId: senderId },
                data: { lastReadAt: newMessage.createdAt },
            });

            return { roomId: existingRoom.id, message: newMessage };
        });

        const io: SocketServer<ClientToServerEvents, ServerToClientEvents> = req.app.get("io");

        if (io) {
            io.to(result.roomId).emit("newMessage", result.message);
        }

        return result;
    }, "sendMessage");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function editMessage(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const { id } = req.params;
        const { message } = req.body;
        const senderId = req.userId;

        if (!senderId) throw new Error("Unauthorized");
        if (!id || typeof id !== "string") throw new Error("Message ID is required");
        if (!message?.trim()) throw new Error("Message is required");

        const existingMessage = await prisma.message.findUnique({
            where: { id },
            include: { room: { include: { members: true } } },
        });

        if (!existingMessage) throw new Error("Message not found");
        if (existingMessage.senderId !== senderId) throw new Error("You can only edit your own messages");

        const isMember = existingMessage.room.members.some((m) => m.userId === senderId);
        if (!isMember) throw new Error("Not a member of this room");

        const updatedMessage = await prisma.message.update({
            where: { id },
            data: { message: message.trim() },
            include: { user: true },
        });

        const io: SocketServer<ClientToServerEvents, ServerToClientEvents> = req.app.get("io");

        if (io) {
            io.to(existingMessage.roomId).emit("messageEdited", updatedMessage);
        }

        return updatedMessage;
    }, "editMessage");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}

export async function deleteMessage(req: Request, res: Response) {
    const result = await wrapper(async () => {
        const { id } = req.params;
        const senderId = req.userId;

        if (!senderId) throw new Error("Unauthorized");
        if (!id || typeof id !== "string") throw new Error("Message ID is required");

        const existingMessage = await prisma.message.findUnique({
            where: { id },
            include: { room: { include: { members: true } } },
        });

        if (!existingMessage) throw new Error("Message not found");
        if (existingMessage.senderId !== senderId) throw new Error("You can only delete your own messages");

        const isMember = existingMessage.room.members.some((m) => m.userId === senderId);
        if (!isMember) throw new Error("Not a member of this room");

        const deletedMessage = await prisma.message.delete({ where: { id } });

        const io: SocketServer<ClientToServerEvents, ServerToClientEvents> = req.app.get("io");

        if (io) {
            io.to(existingMessage.roomId).emit("messageDeleted", existingMessage.id, existingMessage.roomId);
        }

        return deletedMessage;
    }, "deleteMessage");

    return !result.success ? res.status(400).json(result) : res.status(200).json(result);
}
