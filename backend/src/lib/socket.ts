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
            socket.emit("onlineUsers", Array.from(userSocketMap.keys()));
            console.log(`✅ Socket.IO Connected. ${user.name} is online`);
        });

        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("leaveRoom", (roomId: string) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
        });

        socket.on("sendMessage", (newMessage: Message, roomId: string) => {
            if (socket.data.userId !== newMessage.senderId) return;
            io.to(roomId).emit("newMessage", newMessage);
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
