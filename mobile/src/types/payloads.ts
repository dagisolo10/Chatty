import { MessageType, RoomType } from "./model";

export interface MessagePayload {
    message: string;
    messageType: MessageType;
    roomId?: string;
    recipientId?: string;
}

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
