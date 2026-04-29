import prisma from "@/lib/prisma.js";
import type { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import type { Message, User } from "@prisma/client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-events.js";

const userSocketMap = new Map<string, string[]>();

export default function initializeSocket(server: HttpServer) {
    const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(server, {
        cors: { origin: process.env.CLIENT_URL, credentials: true },
    });

    console.log("🚀 Socket.IO server connecting...");

    io.on("connection", (socket) => {
        socket.on("isOnline", (user: User) => {
            socket.data.userId = user.id;
            const currentSockets = userSocketMap.get(user.id) || [];
            userSocketMap.set(user.id, [...currentSockets, socket.id]);
            io.emit("onlineUsers", Array.from(userSocketMap.keys()));
            console.log(`✅ Socket.IO Connected. ${user.name} is online`);
        });

        socket.on("joinRoom", async (roomId: string) => {
            const userId = socket.data.userId;
            if (!userId) {
                socket.emit("roomJoinError", roomId, "Unauthorized: missing socket user id");
                return;
            }

            const isMember = await prisma.room.findFirst({ where: { id: roomId, members: { some: { userId } } }, select: { id: true } });

            if (!isMember) {
                socket.emit("roomJoinError", roomId, "Unauthorized: not a member of the room");
                return;
            }

            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("leaveRoom", async (roomId: string) => {
            const userId = socket.data.userId;
            if (!userId) {
                socket.emit("roomLeaveError", roomId, "Unauthorized: missing socket user id");
                return;
            }

            const isMember = await prisma.room.findFirst({ where: { id: roomId, members: { some: { userId } } }, select: { id: true } });

            if (!isMember) {
                socket.emit("roomLeaveError", roomId, "Unauthorized: not a member of the room");
                return;
            }

            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
        });

        socket.on("sendMessage", (newMessage: Message, roomId: string) => {
            if (socket.data.userId !== newMessage.senderId) return;
            io.to(roomId).emit("newMessage", newMessage, roomId);
        });

        socket.on("editMessage", (updatedMessage: Message, roomId: string) => {
            if (socket.data.userId !== updatedMessage.senderId) return;
            io.to(roomId).emit("messageEdited", updatedMessage);
        });

        socket.on("deleteMessage", (deletedMessage: Message, roomId: string) => {
            if (socket.data.userId !== deletedMessage.senderId) return;
            socket.to(roomId).emit("messageDeleted", deletedMessage.id, roomId);
        });

        socket.on("typing", (roomId: string, userId: string) => {
            if (socket.data.userId !== userId) return;
            io.to(roomId).emit("userStartedTyping", userId, roomId);
        });

        socket.on("stopTyping", (roomId: string, userId: string) => {
            if (socket.data.userId !== userId) return;
            io.to(roomId).emit("userStoppedTyping", userId, roomId);
        });

        socket.on("disconnect", () => {
            const userId = socket.data.userId;
            if (userId) {
                const filteredSockets = userSocketMap.get(userId)?.filter((socketId) => socketId !== socket.id) || [];
                if (filteredSockets.length === 0) userSocketMap.delete(userId);
                else userSocketMap.set(userId, filteredSockets);

                io.emit("onlineUsers", Array.from(userSocketMap.keys()));
                console.log(`❌ Socket.IO Disconnected. User ${userId} is offline`);
            }
        });
    });

    return io;
}

// Verify each finding against the current code and only fix it if needed.

// In `@backend/src/lib/socket.ts` around lines 16 - 22, The socket handler
// socket.on("isOnline") currently trusts a client-supplied User and writes
// socket.data.userId and updates userSocketMap from user.id—replace this by
// validating authentication server-side: extract the auth token/session from
// socket.handshake (or call the auth service/JWT verifier), resolve the real user
// id from that verification, set socket.data.userId to the verified id, and update
// userSocketMap using the verified id; also audit related handlers
// (send/edit/delete/typing) to ensure they check socket.data.userId (the verified
// identity) rather than any client-provided id before performing actions.
