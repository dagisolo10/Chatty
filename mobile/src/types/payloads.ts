import { MessageType, RoomType } from "./model";

interface BaseMessagePayload {
    message: string;
    messageType: MessageType;
}

export type MessagePayload = (BaseMessagePayload & { roomId: string; recipientId?: never }) | (BaseMessagePayload & { recipientId: string; roomId?: never });

export interface RoomPayload {
    name?: string;
    type: RoomType;
    inviteCode?: string;
    memberIds: string[];
}

export interface UserPayload {
    name: string;
    username: string;
    bio?: string;
    profile?: string;
}

export interface UpdateUserPayload {
    name?: string;
    username?: string;
    bio?: string;
    profile?: string;
}
