import { Room, Member, User, Message } from "./model";

export interface ChatListItem extends Room {
    members: (Member & { user: User })[];
    _count?: {
        messages: number;
    };
}

export interface HydratedMessage extends Message {
    user: User;
}
