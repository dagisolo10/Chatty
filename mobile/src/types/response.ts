export interface User {
    id: string;
    name: string;
    username: string;
    profile?: string | null;
    bio?: string | null;
    lastOnlineAt: string | Date;
    createdAt: string | Date;

    members?: Member[];
    messages?: Message[];
}

export interface Member {
    id: string;
    role: Role;
    userId: string;
    roomId: string;
    lastReadAt: string | Date;
    createdAt: string | Date;

    user?: User;
    room?: Room;
}

export interface Room {
    id: string;
    name?: string | null;
    inviteCode?: string | null;
    type: RoomType;
    lastMessage?: string | null;
    lastMessageAt?: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;

    members?: Member[];
    messages?: Message[];
}

export interface Message {
    id: string;
    message: string;
    messageType: MessageType;
    roomId: string;
    senderId: string;
    createdAt: string | Date;

    user?: User;
    room?: Room;
}

export enum MessageType {
    Text = "Text",
    Image = "Image",
    Video = "Video",
}

export enum RoomType {
    Private = "Private",
    Group = "Group",
}

export enum Role {
    Admin = "Admin",
    Member = "Member",
}
