import { MessageType, RoomType } from "./model";

export interface CreateMessagePayload {
    message: string;
    messageType: MessageType;
    roomId: string;
}

export interface CreateRoomPayload {
    name?: string;
    type: RoomType;
    inviteCode?: string;
    memberIds: string[];
}

export interface UpdateUserPayload {
    name?: string;
    username?: string;
    bio?: string;
    profile?: string;
}
