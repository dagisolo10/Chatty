import useAuthStore from "./auth-store";

import api from "@/lib/axios";
import { create } from "zustand";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { io, Socket } from "socket.io-client";
import { MessagePayload } from "@/types/payloads";
import { Message, Room, User } from "@/types/model";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket-events";
import { MessageSendResponse, RoomResponse, RoomsResponse } from "@/types/response";

interface RoomStore {
    rooms: Room[];
    messages: Message[];
    onlineUsers: string[];
    pendingUser: User | null;
    typingUsers: Record<string, string[]>;
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;

    getRooms: () => Promise<void>;
    getConversation: (roomId: string) => Promise<void>;

    connectSocket: () => void;
    disconnectSocket: () => void;

    setPendingUser: (user: User | null) => void;
    sendMessage: (payload: MessagePayload) => Promise<MessageSendResponse>;
}

function resolveBaseUrl() {
    const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
    if (configuredUrl) return configuredUrl;

    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(":")[0];

    if (host) return `http://${host}:3000`;

    if (Platform.OS === "web") return "http://localhost:3000";

    if (Platform.OS === "android") return "http://10.0.2.2:3000";

    return "http://localhost:3000";
}

const useRoomStore = create<RoomStore>((set, get) => ({
    rooms: [],
    messages: [],
    socket: null,
    pendingUser: null,
    onlineUsers: [],
    typingUsers: {},

    setPendingUser: (user: User | null) => {
        set({ pendingUser: user });
    },

    connectSocket: () => {
        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(resolveBaseUrl(), { transports: ["websocket"] });

        socket.on("connect", () => {
            const user = useAuthStore.getState().user;
            if (user) {
                set((state) => ({ onlineUsers: [...state.onlineUsers, user.id] }));
                socket.emit("isOnline", user);
            }
        });

        socket.on("onlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on("newMessage", (message) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });

        socket.on("messageEdited", (updatedMessage) => {
            set((state) => ({ messages: state.messages.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)) }));
        });

        socket.on("messageDeleted", (messageId: string) => {
            set((state) => ({ messages: state.messages.filter((msg) => msg.id !== messageId) }));
        });

        socket.on("userStartedTyping", (userId: string, roomId: string) => {
            set((state) => ({
                typingUsers: {
                    ...state.typingUsers,
                    [roomId]: [...(state.typingUsers[roomId] || []), userId],
                },
            }));
        });

        socket.on("userStoppedTyping", (userId, roomId) => {
            set((state) => ({
                typingUsers: {
                    ...state.typingUsers,
                    [roomId]: (state.typingUsers[roomId] || []).filter((id) => id !== userId),
                },
            }));
        });

        socket.on("roomJoinError", (roomId, message) => {
            console.error(`Failed to join room ${roomId}: ${message}`);
        });

        socket.on("roomLeaveError", (roomId, message) => {
            console.error(`Failed to leave room ${roomId}: ${message}`);
        });

        set({ socket });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    getRooms: async () => {
        try {
            const token = useAuthStore.getState().lastToken;
            const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const res = await api.get<RoomsResponse>("/room/list", authConfig);
            const data = res.data;
            if (!data.success) throw new Error(res.data.error);

            set({ rooms: res.data.data || [] });
        } catch (err) {
            console.error("Error fetching rooms", err);
        }
    },

    sendMessage: async (payload: MessagePayload) => {
        try {
            const token = useAuthStore.getState().lastToken;
            const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const res = await api.post<MessageSendResponse>("/message/send", payload, authConfig);
            const data = res.data;
            if (!data.success) throw new Error(data.error);

            set((state) => ({ messages: [...state.messages, data.data.message] }));

            return data;
        } catch (err: any) {
            console.error("Error sending message", err);
            return { success: false, error: err.message || "Failed to send message" } as MessageSendResponse;
        }
    },

    getConversation: async (roomId: string) => {
        try {
            const token = useAuthStore.getState().lastToken;
            const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const res = await api.get<RoomResponse>(`/room/${roomId}`, authConfig);
            const data = res.data;
            if (!data.success) throw new Error(data.error);

            const socket = get().socket;
            const currentMessages = get().messages;

            if (socket && currentMessages.length > 0) {
                const previousRoomId = currentMessages[0].roomId;
                if (previousRoomId !== roomId) {
                    socket.emit("leaveRoom", previousRoomId);
                }
                socket.emit("joinRoom", roomId);
            }

            set({ messages: data.data.messages || [] });
        } catch (err: any) {
            console.error("Error sending message", err);
        }
    },
}));

export default useRoomStore;
